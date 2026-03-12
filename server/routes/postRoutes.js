const express = require('express');
const router = express.Router();
const { 
  createPost, 
  getPosts, 
  getPostById, 
  updatePost, 
  deletePost, 
  likePost 
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);

module.exports = router;
