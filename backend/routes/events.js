const express = require('express');
const Event = require('../models/Event');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/events
// @desc    Get events
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const events = await Event.find({ 
      visibility: 'public',
      startDate: { $gte: new Date() }
    })
      .populate('organizer', 'username firstName lastName profilePicture trustScore.current')
      .sort({ startDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({ events });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      error: 'Failed to get events',
      message: 'An error occurred while retrieving events'
    });
  }
});

module.exports = router;