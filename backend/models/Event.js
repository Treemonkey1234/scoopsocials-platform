const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['going', 'maybe', 'not-going', 'invited'],
    default: 'invited'
  },
  role: {
    type: String,
    enum: ['attendee', 'organizer', 'moderator', 'vip'],
    default: 'attendee'
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  responseDate: {
    type: Date
  },
  checkInTime: {
    type: Date
  },
  participationLevel: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

const eventSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coOrganizers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Event Details
  category: {
    type: String,
    required: true,
    enum: [
      'social', 'professional', 'educational', 'entertainment', 
      'sports', 'health', 'food', 'travel', 'technology', 
      'arts', 'music', 'gaming', 'charity', 'religious', 'other'
    ]
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  
  // Date and Time
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  timezone: {
    type: String,
    required: true,
    default: 'UTC'
  },
  isAllDay: {
    type: Boolean,
    default: false
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'] },
    interval: { type: Number, default: 1 },
    endDate: Date,
    daysOfWeek: [{ type: Number, min: 0, max: 6 }] // 0 = Sunday, 6 = Saturday
  },

  // Location
  location: {
    type: {
      type: String,
      enum: ['physical', 'virtual', 'hybrid'],
      required: true
    },
    physical: {
      name: String,
      address: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
      coordinates: {
        latitude: { type: Number, min: -90, max: 90 },
        longitude: { type: Number, min: -180, max: 180 }
      },
      venue: String,
      room: String,
      parkingInfo: String,
      accessibility: String
    },
    virtual: {
      platform: { type: String, enum: ['zoom', 'teams', 'discord', 'google-meet', 'custom', 'other'] },
      url: String,
      meetingId: String,
      passcode: String,
      dialInNumber: String,
      additionalInstructions: String
    }
  },

  // Attendees and Capacity
  attendees: [attendeeSchema],
  capacity: {
    max: { type: Number, min: 1 },
    current: { type: Number, default: 0 },
    waitingList: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      position: Number,
      addedAt: { type: Date, default: Date.now }
    }]
  },

  // Privacy and Visibility
  visibility: {
    type: String,
    enum: ['public', 'friends', 'invite-only', 'private'],
    default: 'public'
  },
  requiresApproval: {
    type: Boolean,
    default: false
  },
  ageRestriction: {
    min: { type: Number, min: 0, max: 100 },
    max: { type: Number, min: 0, max: 100 }
  },
  trustScoreRequirement: {
    min: { type: Number, min: 0, max: 100 },
    enforced: { type: Boolean, default: false }
  },

  // Event Content
  images: [{
    url: String,
    caption: String,
    cloudinaryId: String,
    isMainImage: { type: Boolean, default: false }
  }],
  videos: [{
    url: String,
    caption: String,
    cloudinaryId: String
  }],
  documents: [{
    name: String,
    url: String,
    type: String,
    size: Number,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],

  // Pricing and Tickets
  pricing: {
    isFree: { type: Boolean, default: true },
    cost: { type: Number, min: 0 },
    currency: { type: String, default: 'USD' },
    ticketTypes: [{
      name: String,
      price: Number,
      description: String,
      quantity: Number,
      sold: { type: Number, default: 0 }
    }],
    refundPolicy: String
  },

  // Event Status
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'postponed', 'completed'],
    default: 'draft'
  },
  cancellationReason: String,
  postponementInfo: {
    newStartDate: Date,
    newEndDate: Date,
    reason: String
  },

  // Engagement and Community
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, maxlength: 1000 },
    timestamp: { type: Date, default: Date.now },
    replies: [{
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: { type: String, maxlength: 500 },
      timestamp: { type: Date, default: Date.now }
    }]
  }],
  likes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }],
  shares: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    platform: String,
    timestamp: { type: Date, default: Date.now }
  }],

  // Analytics and Metrics
  analytics: {
    views: { type: Number, default: 0 },
    uniqueViews: [{ 
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date, default: Date.now }
    }],
    invitesSent: { type: Number, default: 0 },
    responseRate: { type: Number, default: 0 },
    attendanceRate: { type: Number, default: 0 },
    averageParticipation: { type: Number, default: 0 }
  },

  // Trust and Safety
  flagged: {
    count: { type: Number, default: 0 },
    flaggedBy: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reason: { type: String, enum: ['inappropriate', 'spam', 'misleading', 'safety-concern', 'other'] },
      description: String,
      timestamp: { type: Date, default: Date.now }
    }],
    resolved: { type: Boolean, default: false }
  },
  verification: {
    isVerified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verificationDate: Date,
    verificationNotes: String
  },

  // Communication
  announcements: [{
    title: String,
    message: String,
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sentAt: { type: Date, default: Date.now },
    recipients: { type: String, enum: ['all', 'going', 'maybe', 'organizers'], default: 'all' }
  }],
  reminders: [{
    type: { type: String, enum: ['email', 'push', 'sms'] },
    timing: { type: String, enum: ['1-hour', '1-day', '1-week', 'custom'] },
    customTiming: Number, // minutes before event
    message: String,
    enabled: { type: Boolean, default: true }
  }],

  // External Integration
  externalLinks: [{
    platform: String,
    url: String,
    type: { type: String, enum: ['website', 'social', 'ticket', 'stream', 'other'] }
  }],
  importedFrom: {
    platform: String,
    externalId: String,
    syncEnabled: { type: Boolean, default: false }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
eventSchema.index({ startDate: 1, status: 1 });
eventSchema.index({ organizer: 1, createdAt: -1 });
eventSchema.index({ 'location.physical.coordinates': '2dsphere' });
eventSchema.index({ category: 1, startDate: 1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ visibility: 1, startDate: 1 });
eventSchema.index({ 'trustScoreRequirement.min': 1 });

// Virtual for going attendees count
eventSchema.virtual('goingCount').get(function() {
  return this.attendees.filter(attendee => attendee.status === 'going').length;
});

// Virtual for maybe attendees count
eventSchema.virtual('maybeCount').get(function() {
  return this.attendees.filter(attendee => attendee.status === 'maybe').length;
});

// Virtual for total interested count
eventSchema.virtual('interestedCount').get(function() {
  return this.attendees.filter(attendee => 
    attendee.status === 'going' || attendee.status === 'maybe'
  ).length;
});

// Virtual for days until event
eventSchema.virtual('daysUntilEvent').get(function() {
  const now = new Date();
  const diffTime = this.startDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for event duration
eventSchema.virtual('duration').get(function() {
  return this.endDate - this.startDate; // in milliseconds
});

// Virtual for is past event
eventSchema.virtual('isPastEvent').get(function() {
  return this.endDate < new Date();
});

// Virtual for is live event
eventSchema.virtual('isLiveEvent').get(function() {
  const now = new Date();
  return this.startDate <= now && this.endDate >= now;
});

// Pre-save middleware
eventSchema.pre('save', function(next) {
  // Update current capacity
  this.capacity.current = this.goingCount;
  
  // Calculate response rate
  const totalInvited = this.attendees.length;
  const totalResponded = this.attendees.filter(a => 
    a.status !== 'invited'
  ).length;
  this.analytics.responseRate = totalInvited > 0 ? (totalResponded / totalInvited) * 100 : 0;
  
  // Calculate attendance rate (only for past events)
  if (this.isPastEvent) {
    const checkedIn = this.attendees.filter(a => a.checkInTime).length;
    this.analytics.attendanceRate = this.goingCount > 0 ? (checkedIn / this.goingCount) * 100 : 0;
    
    // Calculate average participation
    const participationScores = this.attendees
      .filter(a => a.checkInTime && a.participationLevel)
      .map(a => a.participationLevel);
    
    this.analytics.averageParticipation = participationScores.length > 0 
      ? participationScores.reduce((sum, score) => sum + score, 0) / participationScores.length 
      : 0;
  }
  
  next();
});

// Method to add attendee
eventSchema.methods.addAttendee = function(userId, status = 'going', invitedBy = null) {
  // Check if user is already an attendee
  const existingIndex = this.attendees.findIndex(a => a.user.equals(userId));
  
  if (existingIndex !== -1) {
    // Update existing attendee
    this.attendees[existingIndex].status = status;
    this.attendees[existingIndex].responseDate = new Date();
  } else {
    // Add new attendee
    this.attendees.push({
      user: userId,
      status: status,
      invitedBy: invitedBy,
      responseDate: new Date()
    });
  }
  
  return this.save();
};

// Method to remove attendee
eventSchema.methods.removeAttendee = function(userId) {
  this.attendees = this.attendees.filter(a => !a.user.equals(userId));
  return this.save();
};

// Method to check in attendee
eventSchema.methods.checkInAttendee = function(userId, participationLevel = 5) {
  const attendee = this.attendees.find(a => a.user.equals(userId));
  
  if (attendee) {
    attendee.checkInTime = new Date();
    attendee.participationLevel = participationLevel;
  }
  
  return this.save();
};

// Method to check if user can attend
eventSchema.methods.canUserAttend = async function(user) {
  // Check age restriction
  if (this.ageRestriction.min && user.age < this.ageRestriction.min) {
    return { canAttend: false, reason: 'Below minimum age requirement' };
  }
  
  if (this.ageRestriction.max && user.age > this.ageRestriction.max) {
    return { canAttend: false, reason: 'Above maximum age requirement' };
  }
  
  // Check trust score requirement
  if (this.trustScoreRequirement.enforced && 
      user.trustScore.current < this.trustScoreRequirement.min) {
    return { canAttend: false, reason: 'Trust score too low' };
  }
  
  // Check capacity
  if (this.capacity.max && this.goingCount >= this.capacity.max) {
    return { canAttend: false, reason: 'Event is at capacity' };
  }
  
  // Check if event is in the past
  if (this.isPastEvent) {
    return { canAttend: false, reason: 'Event has already ended' };
  }
  
  return { canAttend: true };
};

// Method to get nearby events
eventSchema.statics.findNearby = function(coordinates, maxDistance = 10000) {
  return this.find({
    'location.physical.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    },
    status: 'published',
    startDate: { $gte: new Date() }
  });
};

// Method to increment view
eventSchema.methods.incrementView = function(userId = null) {
  this.analytics.views++;
  
  if (userId && !this.analytics.uniqueViews.some(view => view.user.equals(userId))) {
    this.analytics.uniqueViews.push({ user: userId });
  }
  
  return this.save();
};

module.exports = mongoose.model('Event', eventSchema);