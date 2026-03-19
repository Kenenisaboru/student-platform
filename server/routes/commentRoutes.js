const express = require('express');
const router = express.Router();
const { 
  createComment, 
  getCommentsByPost, 
  deleteComment,
  likeComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const { validate, createCommentRules, paginationRules } = require('../middleware/validation');

router.post('/:postId', protect, createCommentRules, validate, createComment);
router.get('/:postId', paginationRules, validate, getCommentsByPost);
router.delete('/:id', protect, deleteComment);
router.post('/:id/like', protect, likeComment);

module.exports = router;
