const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/friends
// @desc    Get user's friends
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends.user', 'username firstName lastName profilePicture trustScore.current');
    
    const friends = user.friends.filter(friend => friend.status === 'accepted');
    
    res.json({ friends });

  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({
      error: 'Failed to get friends',
      message: 'An error occurred while retrieving friends'
    });
  }
});

module.exports = router;