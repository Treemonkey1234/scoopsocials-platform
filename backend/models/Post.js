const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'love', 'laugh', 'wow', 'sad', 'angry', 'agree', 'disagree'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  reactions: [reactionSchema],
  replies: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, maxlength: 500 },
    reactions: [reactionSchema],
    createdAt: { type: Date, default: Date.now }
  }],
  flagged: {
    count: { type: Number, default: 0 },
    flaggedBy: [{ 
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reason: { type: String, enum: ['spam', 'inappropriate', 'harassment', 'misinformation', 'other'] },
      timestamp: { type: Date, default: Date.now }
    }],
    resolved: { type: Boolean, default: false }
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    content: String,
    editedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    text: {
      type: String,
      required: true,
      maxlength: 2000
    },
    images: [{
      url: String,
      caption: String,
      cloudinaryId: String
    }],
    videos: [{
      url: String,
      caption: String,
      cloudinaryId: String,
      duration: Number
    }],
    links: [{
      url: String,
      title: String,
      description: String,
      image: String
    }]
  },
  
  // Engagement metrics
  reactions: [reactionSchema],
  comments: [commentSchema],
  shares: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    platform: { type: String, enum: ['internal', 'twitter', 'facebook', 'instagram', 'other'] },
    timestamp: { type: Date, default: Date.now }
  }],
  
  // Content categorization
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  mentions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String
  }],
  
  // Trust and verification
  trustScore: {
    initialScore: { type: Number, default: 0 }, // Author's trust score when posted
    communityValidation: {
      agrees: { type: Number, default: 0 },
      disagrees: { type: Number, default: 0 },
      verifiedUsers: { type: Number, default: 0 }, // Reactions from high-trust users
      score: { type: Number, default: 0 } // Overall community trust score for this post
    }
  },
  
  // Moderation
  flagged: {
    count: { type: Number, default: 0 },
    flaggedBy: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reason: { type: String, enum: ['spam', 'inappropriate', 'harassment', 'misinformation', 'copyright', 'other'] },
      description: String,
      timestamp: { type: Date, default: Date.now }
    }],
    status: { type: String, enum: ['pending', 'approved', 'removed'], default: 'approved' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
    reviewNotes: String
  },
  
  // Visibility and access
  visibility: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public'
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  allowShares: {
    type: Boolean,
    default: true
  },
  
  // Location (optional)
  location: {
    name: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    city: String,
    state: String,
    country: String
  },
  
  // Scheduled posting
  scheduledFor: {
    type: Date,
    default: null
  },
  isScheduled: {
    type: Boolean,
    default: false
  },
  
  // Post type and metadata
  postType: {
    type: String,
    enum: ['text', 'image', 'video', 'link', 'poll', 'event-announcement'],
    default: 'text'
  },
  metadata: {
    estimatedReadTime: Number, // in seconds
    wordCount: Number,
    language: { type: String, default: 'en' }
  },
  
  // Edit history
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    content: Object,
    editedAt: { type: Date, default: Date.now },
    reason: String
  }],
  
  // Analytics
  analytics: {
    views: { type: Number, default: 0 },
    uniqueViews: [{ 
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date, default: Date.now }
    }],
    clickThroughRate: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ 'flagged.status': 1 });
postSchema.index({ tags: 1 });
postSchema.index({ visibility: 1, createdAt: -1 });
postSchema.index({ 'location.coordinates': '2dsphere' });
postSchema.index({ 'trustScore.communityValidation.score': -1 });

// Virtual for total reactions count
postSchema.virtual('totalReactions').get(function() {
  return this.reactions.length;
});

// Virtual for total comments count (including replies)
postSchema.virtual('totalComments').get(function() {
  return this.comments.reduce((total, comment) => {
    return total + 1 + comment.replies.length;
  }, 0);
});

// Virtual for engagement score
postSchema.virtual('engagementScore').get(function() {
  const reactions = this.reactions.length;
  const comments = this.totalComments;
  const shares = this.shares.length;
  const views = this.analytics.views || 1;
  
  return ((reactions * 1 + comments * 2 + shares * 3) / views) * 100;
});

// Virtual for community validation percentage
postSchema.virtual('communityValidationPercentage').get(function() {
  const total = this.trustScore.communityValidation.agrees + this.trustScore.communityValidation.disagrees;
  if (total === 0) return 0;
  return (this.trustScore.communityValidation.agrees / total) * 100;
});

// Pre-save middleware to calculate metadata
postSchema.pre('save', function(next) {
  if (this.isModified('content.text')) {
    // Calculate word count
    this.metadata.wordCount = this.content.text.split(/\s+/).length;
    
    // Estimate read time (average 200 words per minute)
    this.metadata.estimatedReadTime = Math.ceil(this.metadata.wordCount / 200 * 60);
    
    // Extract mentions
    const mentionRegex = /@(\w+)/g;
    const mentions = this.content.text.match(mentionRegex);
    if (mentions) {
      this.mentions = mentions.map(mention => ({
        username: mention.substring(1)
      }));
    }
    
    // Extract hashtags as tags
    const hashtagRegex = /#(\w+)/g;
    const hashtags = this.content.text.match(hashtagRegex);
    if (hashtags) {
      this.tags = [...new Set([...this.tags, ...hashtags.map(tag => tag.substring(1).toLowerCase())])];
    }
  }
  
  next();
});

// Method to calculate community validation score
postSchema.methods.calculateCommunityValidation = function() {
  const agrees = this.trustScore.communityValidation.agrees;
  const disagrees = this.trustScore.communityValidation.disagrees;
  const verifiedUsers = this.trustScore.communityValidation.verifiedUsers;
  
  const total = agrees + disagrees;
  if (total === 0) {
    this.trustScore.communityValidation.score = 50; // Neutral
    return 50;
  }
  
  // Base score from agree/disagree ratio
  const baseScore = (agrees / total) * 100;
  
  // Bonus for verified user engagement (up to 20 point bonus)
  const verifiedBonus = Math.min(verifiedUsers * 2, 20);
  
  // Penalty for low engagement (if less than 5 total reactions)
  const engagementPenalty = total < 5 ? 10 : 0;
  
  const finalScore = Math.max(0, Math.min(100, baseScore + verifiedBonus - engagementPenalty));
  this.trustScore.communityValidation.score = finalScore;
  
  return finalScore;
};

// Method to add reaction
postSchema.methods.addReaction = async function(userId, reactionType) {
  // Remove existing reaction from this user
  this.reactions = this.reactions.filter(r => !r.user.equals(userId));
  
  // Add new reaction
  this.reactions.push({
    user: userId,
    type: reactionType
  });
  
  // Update community validation if reaction is agree/disagree
  if (reactionType === 'agree') {
    this.trustScore.communityValidation.agrees++;
  } else if (reactionType === 'disagree') {
    this.trustScore.communityValidation.disagrees++;
  }
  
  // Recalculate community validation score
  this.calculateCommunityValidation();
  
  return this.save();
};

// Method to remove reaction
postSchema.methods.removeReaction = async function(userId) {
  const existingReaction = this.reactions.find(r => r.user.equals(userId));
  
  if (existingReaction) {
    // Update community validation counts
    if (existingReaction.type === 'agree') {
      this.trustScore.communityValidation.agrees = Math.max(0, this.trustScore.communityValidation.agrees - 1);
    } else if (existingReaction.type === 'disagree') {
      this.trustScore.communityValidation.disagrees = Math.max(0, this.trustScore.communityValidation.disagrees - 1);
    }
    
    // Remove reaction
    this.reactions = this.reactions.filter(r => !r.user.equals(userId));
    
    // Recalculate community validation score
    this.calculateCommunityValidation();
  }
  
  return this.save();
};

// Method to increment view count
postSchema.methods.incrementView = function(userId = null) {
  this.analytics.views++;
  
  if (userId && !this.analytics.uniqueViews.some(view => view.user.equals(userId))) {
    this.analytics.uniqueViews.push({ user: userId });
  }
  
  // Update engagement rate
  const totalEngagement = this.reactions.length + this.comments.length + this.shares.length;
  this.analytics.engagementRate = this.analytics.views > 0 ? (totalEngagement / this.analytics.views) * 100 : 0;
  
  return this.save();
};

module.exports = mongoose.model('Post', postSchema);