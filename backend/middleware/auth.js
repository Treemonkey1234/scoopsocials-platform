const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied', 
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Access denied', 
        message: 'Invalid token - user not found' 
      });
    }

    if (user.accountStatus !== 'active') {
      return res.status(403).json({ 
        error: 'Account inactive', 
        message: `Account is ${user.accountStatus}` 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Access denied', 
        message: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Access denied', 
        message: 'Token expired' 
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: 'Authentication failed' 
    });
  }
};

// Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (user && user.accountStatus === 'active') {
      req.user = user;
    } else {
      req.user = null;
    }
    
    next();
  } catch (error) {
    // If token is invalid, just continue without user
    req.user = null;
    next();
  }
};

// Check if user has minimum trust score
const requireTrustScore = (minScore) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Please log in to access this resource' 
      });
    }

    if (req.user.trustScore.current < minScore) {
      return res.status(403).json({ 
        error: 'Insufficient trust score', 
        message: `Minimum trust score of ${minScore} required. Your current score: ${req.user.trustScore.current}` 
      });
    }

    next();
  };
};

// Check if user is verified
const requireVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required', 
      message: 'Please log in to access this resource' 
    });
  }

  if (!req.user.isVerified) {
    return res.status(403).json({ 
      error: 'Verification required', 
      message: 'Please verify your account to access this resource' 
    });
  }

  next();
};

// Check if user has specific verification badges
const requireVerificationBadges = (requiredBadges) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Please log in to access this resource' 
      });
    }

    const userBadges = req.user.verificationBadges.map(badge => badge.type);
    const hasRequiredBadges = requiredBadges.every(badge => userBadges.includes(badge));

    if (!hasRequiredBadges) {
      const missingBadges = requiredBadges.filter(badge => !userBadges.includes(badge));
      return res.status(403).json({ 
        error: 'Additional verification required', 
        message: `Missing verification badges: ${missingBadges.join(', ')}` 
      });
    }

    next();
  };
};

// Rate limiting per user (additional to global rate limiting)
const userRateLimit = (maxRequests, windowMinutes = 15) => {
  const requests = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user._id.toString();
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;

    if (!requests.has(userId)) {
      requests.set(userId, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const userRequests = requests.get(userId);

    if (now > userRequests.resetTime) {
      userRequests.count = 1;
      userRequests.resetTime = now + windowMs;
      return next();
    }

    if (userRequests.count >= maxRequests) {
      return res.status(429).json({ 
        error: 'Too many requests', 
        message: `Rate limit exceeded. Try again in ${Math.ceil((userRequests.resetTime - now) / 60000)} minutes` 
      });
    }

    userRequests.count++;
    next();
  };
};

// Check if user can perform action on resource (e.g., edit post)
const checkResourceOwnership = (Model, resourceIdParam = 'id', allowedFields = []) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam];
      const resource = await Model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({ 
          error: 'Resource not found', 
          message: 'The requested resource does not exist' 
        });
      }

      // Check if user owns the resource
      const isOwner = resource.author?.equals(req.user._id) || 
                     resource.organizer?.equals(req.user._id) || 
                     resource._id.equals(req.user._id);

      if (!isOwner) {
        // Check if user has elevated permissions
        const isCoOrganizer = resource.coOrganizers?.some(id => id.equals(req.user._id));
        const isModerator = req.user.verificationBadges?.some(badge => badge.type === 'moderator');
        
        if (!isCoOrganizer && !isModerator) {
          return res.status(403).json({ 
            error: 'Access denied', 
            message: 'You do not have permission to modify this resource' 
          });
        }
      }

      // If specific fields are being updated, check permissions
      if (allowedFields.length > 0) {
        const updateFields = Object.keys(req.body);
        const unauthorizedFields = updateFields.filter(field => !allowedFields.includes(field));
        
        if (unauthorizedFields.length > 0) {
          return res.status(403).json({ 
            error: 'Forbidden fields', 
            message: `You cannot update these fields: ${unauthorizedFields.join(', ')}` 
          });
        }
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error('Resource ownership check error:', error);
      res.status(500).json({ 
        error: 'Server error', 
        message: 'Failed to verify resource ownership' 
      });
    }
  };
};

// Update user activity
const updateActivity = async (req, res, next) => {
  if (req.user) {
    try {
      // Update last active time
      req.user.activityStats.lastActive = new Date();
      
      // Calculate activity points based on action
      let activityPoints = 0;
      const method = req.method.toLowerCase();
      const path = req.path;

      if (method === 'post') {
        if (path.includes('/posts')) activityPoints = 10;
        else if (path.includes('/comments')) activityPoints = 5;
        else if (path.includes('/events')) activityPoints = 15;
        else activityPoints = 3;
      } else if (method === 'put' || method === 'patch') {
        activityPoints = 2;
      } else if (method === 'get') {
        activityPoints = 1;
      }

      // Update recent activity for trust score
      req.user.trustScore.factors.recentActivity.value += activityPoints;
      
      // Recalculate trust score if significant activity
      if (activityPoints > 5) {
        req.user.calculateTrustScore();
      }
      
      await req.user.save();
    } catch (error) {
      console.error('Activity update error:', error);
      // Don't fail the request if activity update fails
    }
  }
  
  next();
};

module.exports = {
  auth,
  optionalAuth,
  requireTrustScore,
  requireVerification,
  requireVerificationBadges,
  userRateLimit,
  checkResourceOwnership,
  updateActivity
};