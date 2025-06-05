const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/trust-score
// @desc    Get trust score details
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('trustScore');
    
    res.json({
      trustScore: user.trustScore
    });

  } catch (error) {
    console.error('Get trust score error:', error);
    res.status(500).json({
      error: 'Failed to get trust score',
      message: 'An error occurred while retrieving trust score'
    });
  }
});

// @route   POST /api/trust-score/calculate
// @desc    Recalculate trust score
// @access  Private
router.post('/calculate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const oldScore = user.trustScore.current;
    
    const newScore = user.calculateTrustScore();
    await user.save();
    
    res.json({
      message: 'Trust score recalculated',
      oldScore,
      newScore,
      trustScore: user.trustScore
    });

  } catch (error) {
    console.error('Calculate trust score error:', error);
    res.status(500).json({
      error: 'Failed to calculate trust score',
      message: 'An error occurred while calculating trust score'
    });
  }
});

module.exports = router;