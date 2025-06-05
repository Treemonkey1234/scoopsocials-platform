const express = require('express');
const Post = require('../models/Post');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/posts
// @desc    Get posts feed
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const posts = await Post.find({ visibility: 'public' })
      .populate('author', 'username firstName lastName profilePicture trustScore.current')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({ posts });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      error: 'Failed to get posts',
      message: 'An error occurred while retrieving posts'
    });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { content, visibility = 'public' } = req.body;

    if (!content || !content.text) {
      return res.status(400).json({
        error: 'Content required',
        message: 'Post content is required'
      });
    }

    const post = new Post({
      author: req.user._id,
      content,
      visibility,
      trustScore: {
        initialScore: req.user.trustScore.current
      }
    });

    await post.save();
    await post.populate('author', 'username firstName lastName profilePicture trustScore.current');

    res.status(201).json({
      message: 'Post created successfully',
      post
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      error: 'Failed to create post',
      message: 'An error occurred while creating the post'
    });
  }
});

module.exports = router;