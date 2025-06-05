const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const socialAccountSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: ['twitter', 'instagram', 'linkedin', 'facebook', 'tiktok', 'youtube', 'snapchat', 'other']
  },
  username: {
    type: String,
    required: true
  },
  profileUrl: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const trustScoreFactorSchema = new mongoose.Schema({
  timeSpentOnApp: {
    value: { type: Number, default: 0 }, // in minutes
    score: { type: Number, default: 0 },
    weight: { type: Number, default: 0.10 }
  },
  recentActivity: {
    value: { type: Number, default: 0 }, // activity points in last 30 days
    score: { type: Number, default: 0 },
    weight: { type: Number, default: 0.15 }
  },
  postings: {
    quantity: { type: Number, default: 0 },
    qualityScore: { type: Number, default: 0 }, // based on reactions
    score: { type: Number, default: 0 },
    weight: { type: Number, default: 0.15 }
  },
  comments: {
    quantity: { type: Number, default: 0 },
    qualityScore: { type: Number, default: 0 }, // based on reactions
    score: { type: Number, default: 0 },
    weight: { type: Number, default: 0.10 }
  },
  engagement: {
    likesGiven: { type: Number, default: 0 },
    sharesGiven: { type: Number, default: 0 },
    flagsAccurate: { type: Number, default: 0 },
    flagsInaccurate: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    weight: { type: Number, default: 0.10 }
  },
  friends: {
    mutualFriends: { type: Number, default: 0 },
    totalFriends: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    weight: { type: Number, default: 0.20 }
  },
  eventsAttended: {
    count: { type: Number, default: 0 },
    participationLevel: { type: Number, default: 0 }, // 1-10 based on engagement
    score: { type: Number, default: 0 },
    weight: { type: Number, default: 0.05 }
  },
  socialMediaAccounts: {
    count: { type: Number, default: 0 },
    verifiedCount: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    weight: { type: Number, default: 0.20 }
  },
  postReactions: {
    positiveReactions: { type: Number, default: 0 },
    negativeReactions: { type: Number, default: 0 },
    score: { type: Number, default: 0 }
  },
  coneProfiles: {
    created: { type: Number, default: 0 },
    accuracyScore: { type: Number, default: 0 }, // based on verification when users join
    score: { type: Number, default: 0 }
  }
});

const userSchema = new mongoose.Schema({
  // Basic Information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  location: {
    city: String,
    state: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },

  // Social Media Accounts
  socialAccounts: [socialAccountSchema],

  // Trust Score System
  trustScore: {
    current: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    factors: trustScoreFactorSchema,
    history: [{
      score: Number,
      factors: Object,
      timestamp: { type: Date, default: Date.now },
      reason: String
    }],
    lastCalculated: {
      type: Date,
      default: Date.now
    }
  },

  // Activity Tracking
  activityStats: {
    totalTimeSpent: { type: Number, default: 0 }, // in minutes
    lastActive: { type: Date, default: Date.now },
    loginStreak: { type: Number, default: 0 },
    postsCreated: { type: Number, default: 0 },
    commentsPosted: { type: Number, default: 0 },
    eventsCreated: { type: Number, default: 0 },
    eventsAttended: { type: Number, default: 0 }
  },

  // Social Connections
  friends: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'blocked'], default: 'pending' },
    connectedAt: { type: Date, default: Date.now },
    mutualFriends: { type: Number, default: 0 }
  }],

  // Verification and Security
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationBadges: [{
    type: { type: String, enum: ['email', 'phone', 'social', 'identity', 'scoop-verified'] },
    verifiedAt: { type: Date, default: Date.now },
    verificationData: Object
  }],
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'banned', 'pending'],
    default: 'active'
  },
  flagCount: {
    type: Number,
    default: 0
  },

  // Preferences and Settings
  preferences: {
    privacy: {
      profileVisibility: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
      showTrustScore: { type: Boolean, default: true },
      allowFriendRequests: { type: Boolean, default: true },
      showOnMap: { type: Boolean, default: true }
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      friendRequests: { type: Boolean, default: true },
      eventInvites: { type: Boolean, default: true },
      trustScoreUpdates: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'trustScore.current': -1 });
userSchema.index({ 'location.coordinates': '2dsphere' });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
userSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Virtual for friend count
userSchema.virtual('friendCount').get(function() {
  return this.friends.filter(friend => friend.status === 'accepted').length;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate trust score
userSchema.methods.calculateTrustScore = function() {
  const factors = this.trustScore.factors;
  let totalScore = 0;

  // Time Spent on App (10% weight)
  const timeScore = Math.min(factors.timeSpentOnApp.value / 1000, 100); // Max at ~16 hours
  factors.timeSpentOnApp.score = timeScore;
  totalScore += timeScore * factors.timeSpentOnApp.weight;

  // Recent Activity (15% weight)
  const activityScore = Math.min(factors.recentActivity.value * 2, 100); // Max at 50 activity points
  factors.recentActivity.score = activityScore;
  totalScore += activityScore * factors.recentActivity.weight;

  // Postings (15% weight)
  const postQuantityScore = Math.min(factors.postings.quantity * 5, 50);
  const postQualityScore = Math.min(factors.postings.qualityScore, 50);
  factors.postings.score = postQuantityScore + postQualityScore;
  totalScore += factors.postings.score * factors.postings.weight;

  // Comments (10% weight)
  const commentQuantityScore = Math.min(factors.comments.quantity * 2, 50);
  const commentQualityScore = Math.min(factors.comments.qualityScore, 50);
  factors.comments.score = commentQuantityScore + commentQualityScore;
  totalScore += factors.comments.score * factors.comments.weight;

  // Engagement (10% weight)
  const engagementScore = Math.min(
    (factors.engagement.likesGiven * 0.5 + 
     factors.engagement.sharesGiven * 1 + 
     factors.engagement.flagsAccurate * 2 - 
     factors.engagement.flagsInaccurate * 5), 100
  );
  factors.engagement.score = Math.max(engagementScore, 0);
  totalScore += factors.engagement.score * factors.engagement.weight;

  // Friends (20% weight)
  const friendScore = Math.min(factors.friends.mutualFriends * 3 + factors.friends.totalFriends * 1, 100);
  factors.friends.score = friendScore;
  totalScore += friendScore * factors.friends.weight;

  // Events Attended (5% weight)
  const eventScore = Math.min(factors.eventsAttended.count * 5 + factors.eventsAttended.participationLevel * 2, 100);
  factors.eventsAttended.score = eventScore;
  totalScore += eventScore * factors.eventsAttended.weight;

  // Social Media Accounts (20% weight) - diminishing returns after 6 accounts
  const accountCount = Math.min(factors.socialMediaAccounts.count, 6);
  const verifiedBonus = factors.socialMediaAccounts.verifiedCount * 5;
  const socialScore = Math.min(accountCount * 15 + verifiedBonus, 100);
  factors.socialMediaAccounts.score = socialScore;
  totalScore += socialScore * factors.socialMediaAccounts.weight;

  // Post Reactions - progressive scaling
  const positiveReactionScore = Math.min(Math.sqrt(factors.postReactions.positiveReactions) * 10, 50);
  const negativeReactionPenalty = Math.min(factors.postReactions.negativeReactions * factors.postReactions.negativeReactions * 0.1, 50);
  factors.postReactions.score = Math.max(positiveReactionScore - negativeReactionPenalty, 0);
  totalScore += factors.postReactions.score * 0.05; // 5% weight

  // Cone Profiles
  const coneScore = Math.min(factors.coneProfiles.created * 3 + factors.coneProfiles.accuracyScore, 100);
  factors.coneProfiles.score = coneScore;
  totalScore += coneScore * 0.05; // 5% weight

  // Update trust score
  const newScore = Math.min(Math.max(totalScore, 0), 100);
  
  // Add to history if score changed significantly
  if (Math.abs(this.trustScore.current - newScore) > 0.5) {
    this.trustScore.history.push({
      score: this.trustScore.current,
      factors: JSON.parse(JSON.stringify(factors)),
      timestamp: new Date(),
      reason: 'Automatic recalculation'
    });
  }

  this.trustScore.current = newScore;
  this.trustScore.lastCalculated = new Date();
  
  return newScore;
};

// Method to update social account count
userSchema.methods.updateSocialAccountCount = function() {
  this.trustScore.factors.socialMediaAccounts.count = this.socialAccounts.length;
  this.trustScore.factors.socialMediaAccounts.verifiedCount = this.socialAccounts.filter(acc => acc.verified).length;
  this.calculateTrustScore();
};

// Method to safely return user data (exclude sensitive info)
userSchema.methods.toSafeObject = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);