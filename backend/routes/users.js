const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/search
// @desc    Search users
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({
        error: 'Query too short',
        message: 'Search query must be at least 2 characters'
      });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } }
      ],
      _id: { $ne: req.user._id }
    })
    .select('username firstName lastName profilePicture trustScore.current')
    .limit(10);

    res.json({ users });

  } catch (error) {
    console.error('User search error:', error);
    res.status(500).json({
      error: 'Search failed',
      message: 'An error occurred while searching users'
    });
  }
});

module.exports = router;