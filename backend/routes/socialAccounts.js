const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, updateActivity } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/social-accounts
// @desc    Get user's connected social accounts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('socialAccounts');
    
    res.json({
      socialAccounts: user.socialAccounts
    });

  } catch (error) {
    console.error('Get social accounts error:', error);
    res.status(500).json({
      error: 'Failed to get social accounts',
      message: 'An error occurred while retrieving social accounts'
    });
  }
});

// @route   POST /api/social-accounts
// @desc    Add a social media account
// @access  Private
router.post('/', [
  auth,
  updateActivity,
  body('platform')
    .isIn(['twitter', 'instagram', 'linkedin', 'facebook', 'tiktok', 'youtube', 'snapchat', 'other'])
    .withMessage('Invalid platform'),
  body('username')
    .isLength({ min: 1, max: 50 })
    .withMessage('Username is required and must be less than 50 characters'),
  body('profileUrl')
    .isURL()
    .withMessage('Please provide a valid profile URL')
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

    const { platform, username, profileUrl } = req.body;
    const user = await User.findById(req.user._id);

    // Check if this platform/username combination already exists for this user
    const existingAccount = user.socialAccounts.find(
      account => account.platform === platform && account.username === username
    );

    if (existingAccount) {
      return res.status(400).json({
        error: 'Account already exists',
        message: `You have already added this ${platform} account`
      });
    }

    // Check if user has reached the maximum limit (optional)
    if (user.socialAccounts.length >= 10) {
      return res.status(400).json({
        error: 'Maximum accounts reached',
        message: 'You can only connect up to 10 social media accounts'
      });
    }

    // Add new social account
    const newAccount = {
      platform,
      username,
      profileUrl,
      verified: false // Will be verified through community validation or manual process
    };

    user.socialAccounts.push(newAccount);
    
    // Update trust score factors
    user.updateSocialAccountCount();
    
    // Add activity points for connecting social account
    user.trustScore.factors.recentActivity.value += 10;
    user.calculateTrustScore();

    await user.save();

    res.status(201).json({
      message: 'Social account added successfully',
      account: newAccount,
      trustScoreUpdate: {
        oldScore: user.trustScore.current,
        newScore: user.calculateTrustScore()
      }
    });

  } catch (error) {
    console.error('Add social account error:', error);
    res.status(500).json({
      error: 'Failed to add social account',
      message: 'An error occurred while adding the social account'
    });
  }
});

// @route   PUT /api/social-accounts/:accountId
// @desc    Update a social media account
// @access  Private
router.put('/:accountId', [
  auth,
  updateActivity,
  body('username')
    .optional()
    .isLength({ min: 1, max: 50 }),
  body('profileUrl')
    .optional()
    .isURL()
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

    const { accountId } = req.params;
    const { username, profileUrl } = req.body;
    
    const user = await User.findById(req.user._id);
    const account = user.socialAccounts.id(accountId);

    if (!account) {
      return res.status(404).json({
        error: 'Account not found',
        message: 'Social media account not found'
      });
    }

    // Update account details
    if (username) account.username = username;
    if (profileUrl) account.profileUrl = profileUrl;
    
    // Mark as unverified if significant changes were made
    if (username || profileUrl) {
      account.verified = false;
    }

    await user.save();

    res.json({
      message: 'Social account updated successfully',
      account
    });

  } catch (error) {
    console.error('Update social account error:', error);
    res.status(500).json({
      error: 'Failed to update social account',
      message: 'An error occurred while updating the social account'
    });
  }
});

// @route   DELETE /api/social-accounts/:accountId
// @desc    Remove a social media account
// @access  Private
router.delete('/:accountId', [auth, updateActivity], async (req, res) => {
  try {
    const { accountId } = req.params;
    const user = await User.findById(req.user._id);
    
    const accountIndex = user.socialAccounts.findIndex(
      account => account._id.toString() === accountId
    );

    if (accountIndex === -1) {
      return res.status(404).json({
        error: 'Account not found',
        message: 'Social media account not found'
      });
    }

    // Remove the account
    user.socialAccounts.splice(accountIndex, 1);
    
    // Update trust score
    user.updateSocialAccountCount();
    user.calculateTrustScore();

    await user.save();

    res.json({
      message: 'Social account removed successfully',
      trustScoreUpdate: {
        newScore: user.trustScore.current
      }
    });

  } catch (error) {
    console.error('Remove social account error:', error);
    res.status(500).json({
      error: 'Failed to remove social account',
      message: 'An error occurred while removing the social account'
    });
  }
});

// @route   POST /api/social-accounts/:accountId/verify
// @desc    Request verification for a social media account
// @access  Private
router.post('/:accountId/verify', [auth, updateActivity], async (req, res) => {
  try {
    const { accountId } = req.params;
    const user = await User.findById(req.user._id);
    
    const account = user.socialAccounts.id(accountId);

    if (!account) {
      return res.status(404).json({
        error: 'Account not found',
        message: 'Social media account not found'
      });
    }

    if (account.verified) {
      return res.status(400).json({
        error: 'Already verified',
        message: 'This account is already verified'
      });
    }

    // In a real implementation, this would:
    // 1. Send a verification request to moderators
    // 2. Or initiate an automated verification process
    // 3. Or send instructions to the user for manual verification
    
    // For now, we'll mark it as pending verification
    // You could add a "verificationStatus" field to track this
    
    res.json({
      message: 'Verification request submitted',
      note: 'Your account will be reviewed by our verification team. This may take 1-3 business days.'
    });

  } catch (error) {
    console.error('Verify social account error:', error);
    res.status(500).json({
      error: 'Failed to request verification',
      message: 'An error occurred while requesting account verification'
    });
  }
});

// @route   GET /api/social-accounts/platforms
// @desc    Get list of supported platforms
// @access  Public
router.get('/platforms', (req, res) => {
  const platforms = [
    {
      name: 'twitter',
      displayName: 'Twitter / X',
      baseUrl: 'https://twitter.com/',
      icon: 'twitter',
      color: '#1DA1F2'
    },
    {
      name: 'instagram',
      displayName: 'Instagram',
      baseUrl: 'https://instagram.com/',
      icon: 'instagram',
      color: '#E4405F'
    },
    {
      name: 'linkedin',
      displayName: 'LinkedIn',
      baseUrl: 'https://linkedin.com/in/',
      icon: 'linkedin',
      color: '#0077B5'
    },
    {
      name: 'facebook',
      displayName: 'Facebook',
      baseUrl: 'https://facebook.com/',
      icon: 'facebook',
      color: '#1877F2'
    },
    {
      name: 'tiktok',
      displayName: 'TikTok',
      baseUrl: 'https://tiktok.com/@',
      icon: 'tiktok',
      color: '#000000'
    },
    {
      name: 'youtube',
      displayName: 'YouTube',
      baseUrl: 'https://youtube.com/@',
      icon: 'youtube',
      color: '#FF0000'
    },
    {
      name: 'snapchat',
      displayName: 'Snapchat',
      baseUrl: 'https://snapchat.com/add/',
      icon: 'snapchat',
      color: '#FFFC00'
    },
    {
      name: 'other',
      displayName: 'Other Platform',
      baseUrl: '',
      icon: 'globe',
      color: '#6B7280'
    }
  ];

  res.json({
    platforms,
    maxAccounts: 10,
    trustScoreBonus: 'Adding verified social accounts significantly improves your trust score'
  });
});

// @route   GET /api/social-accounts/stats
// @desc    Get social accounts statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('socialAccounts trustScore');
    
    const stats = {
      totalAccounts: user.socialAccounts.length,
      verifiedAccounts: user.socialAccounts.filter(acc => acc.verified).length,
      platformBreakdown: {},
      trustScoreContribution: user.trustScore.factors.socialMediaAccounts.score,
      maxPossibleScore: 100,
      recommendedActions: []
    };

    // Calculate platform breakdown
    user.socialAccounts.forEach(account => {
      stats.platformBreakdown[account.platform] = 
        (stats.platformBreakdown[account.platform] || 0) + 1;
    });

    // Generate recommendations
    if (user.socialAccounts.length < 3) {
      stats.recommendedActions.push('Add more social media accounts to increase your trust score');
    }
    
    if (user.socialAccounts.filter(acc => acc.verified).length < user.socialAccounts.length) {
      stats.recommendedActions.push('Verify your social media accounts for a trust score boost');
    }
    
    if (user.socialAccounts.length < 6) {
      stats.recommendedActions.push('Consider adding accounts from major platforms (Twitter, Instagram, LinkedIn)');
    }

    res.json(stats);

  } catch (error) {
    console.error('Get social accounts stats error:', error);
    res.status(500).json({
      error: 'Failed to get statistics',
      message: 'An error occurred while retrieving social accounts statistics'
    });
  }
});

module.exports = router;