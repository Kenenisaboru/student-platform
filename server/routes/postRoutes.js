const express = require('express');
const router = express.Router();
const { 
  createPost, 
  getPosts, 
  getPostById, 
  updatePost, 
  deletePost, 
  likePost,
  votePoll,
  getTrendingTags,
  getCommunityStats
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const { validate, createPostRules, updatePostRules, paginationRules } = require('../middleware/validation');

// Stats routes (before /:id to avoid conflicts)
router.get('/trending-tags', protect, getTrendingTags);
router.get('/community-stats', protect, getCommunityStats);

// Post CRUD with image upload support & validation
router.post('/', protect, upload.single('image'), createPostRules, validate, createPost);
router.get('/', paginationRules, validate, getPosts);
router.get('/:id', getPostById);
router.put('/:id', protect, updatePostRules, validate, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);
router.post('/:id/vote', protect, votePoll);

module.exports = router;
