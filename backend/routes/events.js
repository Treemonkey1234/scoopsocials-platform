const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   GET /api/events
// @desc    Get events with filtering and location-based discovery
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      lat, 
      lng, 
      radius = 5000, // 5km default
      category,
      minTrustScore,
      maxTrustScore 
    } = req.query;
    
    let query = { 
      visibility: 'public',
      startDate: { $gte: new Date() },
      status: 'published'
    };

    // Location-based filtering
    if (lat && lng) {
      query['location.physical.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      };
    }

    // Category filtering
    if (category) {
      query.category = category;
    }

    // Trust score filtering
    if (minTrustScore) {
      query['trustScoreRequirement.min'] = { $lte: parseInt(minTrustScore) };
    }

    const events = await Event.find(query)
      .populate('organizer', 'username firstName lastName profilePicture trustScore.current')
      .populate('attendees.user', 'username firstName lastName profilePicture trustScore.current')
      .sort({ startDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Filter events based on user's trust score
    const user = await User.findById(req.user.id);
    const filteredEvents = events.filter(event => {
      if (event.trustScoreRequirement.enforced) {
        return user.trustScore.current >= event.trustScoreRequirement.min;
      }
      return true;
    });

    res.json({ 
      events: filteredEvents,
      totalCount: filteredEvents.length,
      page: parseInt(page),
      totalPages: Math.ceil(filteredEvents.length / limit)
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      error: 'Failed to get events',
      message: 'An error occurred while retrieving events'
    });
  }
});

// @route   GET /api/events/map
// @desc    Get events for map display with basic info
// @access  Private
router.get('/map', auth, async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Location required',
        message: 'Latitude and longitude are required for map view'
      });
    }

    const user = await User.findById(req.user.id);
    
    const events = await Event.find({
      visibility: 'public',
      startDate: { $gte: new Date() },
      status: 'published',
      'location.physical.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    })
    .populate('organizer', 'username firstName lastName profilePicture trustScore.current')
    .select('title description startDate endDate location.physical organizer category goingCount capacity.max trustScoreRequirement')
    .limit(100);

    // Filter by trust score and return map-friendly format
    const mapEvents = events
      .filter(event => {
        if (event.trustScoreRequirement.enforced) {
          return user.trustScore.current >= event.trustScoreRequirement.min;
        }
        return true;
      })
      .map(event => ({
        id: event._id,
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        category: event.category,
        organizer: event.organizer,
        goingCount: event.goingCount,
        capacity: event.capacity.max,
        coordinates: event.location.physical.coordinates,
        address: event.location.physical.address,
        trustScoreRequired: event.trustScoreRequirement.min || 0
      }));

    res.json({ events: mapEvents });

  } catch (error) {
    console.error('Get map events error:', error);
    res.status(500).json({
      error: 'Failed to get map events',
      message: 'An error occurred while retrieving events for map'
    });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'username firstName lastName profilePicture trustScore.current bio')
      .populate('attendees.user', 'username firstName lastName profilePicture trustScore.current')
      .populate('comments.author', 'username firstName lastName profilePicture');

    if (!event) {
      return res.status(404).json({
        error: 'Event not found',
        message: 'The requested event does not exist'
      });
    }

    // Check if user can view this event
    if (event.visibility === 'private' || event.visibility === 'invite-only') {
      const isAttendee = event.attendees.some(a => a.user._id.equals(req.user.id));
      const isOrganizer = event.organizer._id.equals(req.user.id);
      
      if (!isAttendee && !isOrganizer) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'You do not have permission to view this event'
        });
      }
    }

    // Increment view count
    await event.incrementView(req.user.id);

    res.json({ event });

  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      error: 'Failed to get event',
      message: 'An error occurred while retrieving the event'
    });
  }
});

// @route   POST /api/events
// @desc    Create new event (Groups feature)
// @access  Private
router.post('/', [
  auth,
  body('title').isLength({ min: 1, max: 200 }).withMessage('Title is required and must be under 200 characters'),
  body('description').isLength({ min: 1, max: 5000 }).withMessage('Description is required and must be under 5000 characters'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('location.physical.address').optional().isLength({ min: 1 }).withMessage('Address is required for physical events'),
  body('category').isIn(['social', 'professional', 'educational', 'entertainment', 'sports', 'health', 'food', 'travel', 'technology', 'arts', 'music', 'gaming', 'charity', 'religious', 'other']).withMessage('Valid category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const user = await User.findById(req.user.id);
    
    // Check trust score requirement for event creation (Groups spec: 50+)
    if (user.trustScore.current < 50) {
      return res.status(403).json({
        error: 'Insufficient trust score',
        message: 'You need a trust score of 50 or higher to create events'
      });
    }

    const {
      title,
      description,
      startDate,
      endDate,
      location,
      category,
      tags,
      visibility = 'public',
      capacity,
      trustScoreRequirement = {},
      pricing = { isFree: true }
    } = req.body;

    // Validate capacity (Groups spec: max 200)
    if (capacity && capacity.max > 200) {
      return res.status(400).json({
        error: 'Capacity limit exceeded',
        message: 'Maximum event capacity is 200 attendees'
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({
        error: 'Invalid dates',
        message: 'End date must be after start date'
      });
    }

    const event = new Event({
      title,
      description,
      organizer: req.user.id,
      startDate: start,
      endDate: end,
      location,
      category,
      tags: tags || [],
      visibility,
      capacity: capacity || { max: 200 },
      trustScoreRequirement: {
        min: trustScoreRequirement.min || 0,
        enforced: trustScoreRequirement.enforced || false
      },
      pricing,
      status: 'published'
    });

    // Add organizer as first attendee
    event.attendees.push({
      user: req.user.id,
      status: 'going',
      role: 'organizer'
    });

    await event.save();

    // Update user's events created count
    user.activityStats.eventsCreated += 1;
    await user.save();

    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'username firstName lastName profilePicture trustScore.current');

    res.status(201).json({ 
      event: populatedEvent,
      message: 'Event created successfully'
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      error: 'Failed to create event',
      message: 'An error occurred while creating the event'
    });
  }
});

// @route   POST /api/events/:id/rsvp
// @desc    RSVP to event (Going/Maybe/CantGo)
// @access  Private
router.post('/:id/rsvp', [
  auth,
  body('status').isIn(['going', 'maybe', 'not-going']).withMessage('Valid RSVP status required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { status } = req.body;
    const event = await Event.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!event) {
      return res.status(404).json({
        error: 'Event not found'
      });
    }

    // Check if user can attend
    const canAttend = await event.canUserAttend(user);
    if (!canAttend.canAttend && status === 'going') {
      return res.status(403).json({
        error: 'Cannot attend event',
        message: canAttend.reason
      });
    }

    // Add or update RSVP
    await event.addAttendee(req.user.id, status);

    res.json({ 
      message: `RSVP updated to ${status}`,
      status
    });

  } catch (error) {
    console.error('RSVP error:', error);
    res.status(500).json({
      error: 'Failed to RSVP',
      message: 'An error occurred while updating your RSVP'
    });
  }
});

// @route   DELETE /api/events/:id/rsvp
// @desc    Remove RSVP from event
// @access  Private
router.delete('/:id/rsvp', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        error: 'Event not found'
      });
    }

    // Check if user is organizer (can't remove themselves)
    if (event.organizer.equals(req.user.id)) {
      return res.status(400).json({
        error: 'Cannot remove RSVP',
        message: 'Event organizers cannot remove their RSVP'
      });
    }

    await event.removeAttendee(req.user.id);

    res.json({ 
      message: 'RSVP removed successfully'
    });

  } catch (error) {
    console.error('Remove RSVP error:', error);
    res.status(500).json({
      error: 'Failed to remove RSVP',
      message: 'An error occurred while removing your RSVP'
    });
  }
});

// @route   GET /api/events/user/created
// @desc    Get events created by current user
// @access  Private
router.get('/user/created', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const events = await Event.find({ 
      organizer: req.user.id 
    })
      .populate('organizer', 'username firstName lastName profilePicture trustScore.current')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({ events });

  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({
      error: 'Failed to get user events',
      message: 'An error occurred while retrieving your events'
    });
  }
});

// @route   GET /api/events/user/attending
// @desc    Get events user is attending
// @access  Private
router.get('/user/attending', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const events = await Event.find({ 
      'attendees.user': req.user.id,
      'attendees.status': { $in: ['going', 'maybe'] }
    })
      .populate('organizer', 'username firstName lastName profilePicture trustScore.current')
      .sort({ startDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({ events });

  } catch (error) {
    console.error('Get attending events error:', error);
    res.status(500).json({
      error: 'Failed to get attending events',
      message: 'An error occurred while retrieving your attending events'
    });
  }
});

module.exports = router;