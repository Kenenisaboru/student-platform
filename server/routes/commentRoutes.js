const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsByPost,
  deleteComment,
  likeComment
} = require('../controllers/commentController');
const { secure } = require('../middleware/authMiddleware');
const { validate, createCommentRules, paginationRules } = require('../middleware/validation');

router.post('/:postId', secure, createCommentRules, validate, createComment);
router.get('/:postId', paginationRules, validate, getCommentsByPost);
router.delete('/:id', secure, deleteComment);
router.post('/:id/like', secure, likeComment);

module.exports = router;
