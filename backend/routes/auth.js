const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, updateActivity } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('username')
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-30 characters and contain only letters, numbers, and underscores'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .isLength({ min: 1, max: 50 })
    .trim()
    .withMessage('First name is required and must be less than 50 characters'),
  body('lastName')
    .isLength({ min: 1, max: 50 })
    .trim()
    .withMessage('Last name is required and must be less than 50 characters'),
  body('dateOfBirth')
    .isISO8601()
    .custom((value) => {
      const age = Math.floor((new Date() - new Date(value)) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 13) {
        throw new Error('You must be at least 13 years old to register');
      }
      return true;
    })
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, username, password, firstName, lastName, dateOfBirth, bio, location } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(400).json({
        error: 'User already exists',
        message: `A user with this ${field} already exists`
      });
    }

    // Create new user
    const user = new User({
      email,
      username,
      password,
      firstName,
      lastName,
      dateOfBirth,
      bio: bio || '',
      location: location || {}
    });

    // Set initial trust score factors
    user.trustScore.factors.socialMediaAccounts.count = 0;
    user.calculateTrustScore();

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data (excluding password)
    const userResponse = user.toSafeObject();

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        error: 'Duplicate field',
        message: `A user with this ${field} already exists`
      });
    }

    res.status(500).json({
      error: 'Registration failed',
      message: 'An error occurred during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('emailOrUsername')
    .notEmpty()
    .withMessage('Email or username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { emailOrUsername, password } = req.body;

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername }
      ]
    });

    if (!user) {
      return res.status(400).json({
        error: 'Invalid credentials',
        message: 'User not found'
      });
    }

    // Check if account is active
    if (user.accountStatus !== 'active') {
      return res.status(403).json({
        error: 'Account inactive',
        message: `Your account is currently ${user.accountStatus}`
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        error: 'Invalid credentials',
        message: 'Incorrect password'
      });
    }

    // Update login statistics
    user.activityStats.lastActive = new Date();
    
    // Update login streak
    const lastLogin = user.activityStats.lastActive;
    const now = new Date();
    const daysDiff = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      user.activityStats.loginStreak += 1;
    } else if (daysDiff > 1) {
      user.activityStats.loginStreak = 1;
    }

    // Update recent activity for trust score
    user.trustScore.factors.recentActivity.value += 5; // Login activity points
    user.calculateTrustScore();

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data
    const userResponse = user.toSafeObject();

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'An error occurred during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user data
// @access  Private
router.get('/me', auth, updateActivity, async (req, res) => {
  try {
    // Populate friend details
    const user = await User.findById(req.user._id)
      .populate('friends.user', 'username firstName lastName profilePicture trustScore.current')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User data not available'
      });
    }

    res.json({
      user: user.toSafeObject()
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user data',
      message: 'An error occurred while retrieving user information'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  updateActivity,
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .trim(),
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .trim(),
  body('bio')
    .optional()
    .isLength({ max: 500 }),
  body('location.city')
    .optional()
    .isLength({ max: 100 }),
  body('location.state')
    .optional()
    .isLength({ max: 100 }),
  body('location.country')
    .optional()
    .isLength({ max: 100 })
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const allowedUpdates = [
      'firstName', 'lastName', 'bio', 'location', 'profilePicture'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: 'No valid updates provided',
        message: 'Please provide valid fields to update'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: user.toSafeObject()
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'Profile update failed',
      message: 'An error occurred while updating your profile'
    });
  }
});

// @route   PUT /api/auth/password
// @desc    Change user password
// @access  Private
router.put('/password', [
  auth,
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id);

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({
      error: 'Password update failed',
      message: 'An error occurred while updating your password'
    });
  }
});

// @route   PUT /api/auth/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', [
  auth,
  updateActivity,
  body('privacy.profileVisibility')
    .optional()
    .isIn(['public', 'friends', 'private']),
  body('privacy.showTrustScore')
    .optional()
    .isBoolean(),
  body('privacy.allowFriendRequests')
    .optional()
    .isBoolean(),
  body('privacy.showOnMap')
    .optional()
    .isBoolean(),
  body('notifications.email')
    .optional()
    .isBoolean(),
  body('notifications.push')
    .optional()
    .isBoolean()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const user = await User.findById(req.user._id);

    // Update preferences
    if (req.body.privacy) {
      Object.assign(user.preferences.privacy, req.body.privacy);
    }
    if (req.body.notifications) {
      Object.assign(user.preferences.notifications, req.body.notifications);
    }

    await user.save();

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });

  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({
      error: 'Preferences update failed',
      message: 'An error occurred while updating your preferences'
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', auth, async (req, res) => {
  try {
    // Generate new token
    const token = generateToken(req.user._id);

    res.json({
      message: 'Token refreshed successfully',
      token
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Token refresh failed',
      message: 'An error occurred while refreshing your token'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, (req, res) => {
  // With JWT, logout is primarily client-side
  // This endpoint exists for consistency and potential future server-side token blacklisting
  res.json({
    message: 'Logout successful'
  });
});

// @route   DELETE /api/auth/account
// @desc    Delete user account
// @access  Private
router.delete('/account', [
  auth,
  body('password')
    .notEmpty()
    .withMessage('Password is required to delete account'),
  body('confirmationText')
    .equals('DELETE MY ACCOUNT')
    .withMessage('Please type "DELETE MY ACCOUNT" to confirm')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { password } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id);

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'Password is incorrect'
      });
    }

    // Instead of deleting, mark account as deleted for data integrity
    user.accountStatus = 'deleted';
    user.email = `deleted_${user._id}@scoopsocials.com`;
    user.username = `deleted_${user._id}`;
    await user.save();

    res.json({
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({
      error: 'Account deletion failed',
      message: 'An error occurred while deleting your account'
    });
  }
});

module.exports = router;