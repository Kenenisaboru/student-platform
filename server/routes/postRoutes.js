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
const { secure } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const { validate, createPostRules, updatePostRules, paginationRules } = require('../middleware/validation');

// Stats routes (before /:id to avoid conflicts)
router.get('/trending-tags', secure, getTrendingTags);
router.get('/community-stats', secure, getCommunityStats);

// Post CRUD with image upload support & validation
router.post('/', secure, upload.single('image'), createPostRules, validate, createPost);
router.get('/', paginationRules, validate, getPosts);
router.get('/:id', getPostById);
router.put('/:id', secure, updatePostRules, validate, updatePost);
router.delete('/:id', secure, deletePost);
router.post('/:id/like', secure, likePost);
router.post('/:id/vote', secure, votePoll);

module.exports = router;
