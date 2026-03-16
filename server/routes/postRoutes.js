const express = require('express');
const router = express.Router();
const { 
  createPost, 
  getPosts, 
  getPostById, 
  updatePost, 
  deletePost, 
  likePost,
  getTrendingTags,
  getCommunityStats
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Stats routes (before /:id to avoid conflicts)
router.get('/trending-tags', protect, getTrendingTags);
router.get('/community-stats', protect, getCommunityStats);

// Post CRUD with image upload support
router.post('/', protect, upload.single('image'), createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);

module.exports = router;
