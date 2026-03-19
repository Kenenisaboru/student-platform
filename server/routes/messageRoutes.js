const express = require('express');
const router = express.Router();
const {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
  getUnreadCount
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const { validate, sendMessageRules, paginationRules } = require('../middleware/validation');

router.get('/conversations', protect, getConversations);
router.get('/unread-count', protect, getUnreadCount);
router.post('/conversation/:userId', protect, getOrCreateConversation);
router.get('/:conversationId', protect, paginationRules, validate, getMessages);
router.post('/:conversationId', protect, sendMessageRules, validate, sendMessage);

module.exports = router;
