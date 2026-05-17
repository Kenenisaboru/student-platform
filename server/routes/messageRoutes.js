const express = require('express');
const router = express.Router();
const {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
  getUnreadCount
} = require('../controllers/messageController');
const { secure } = require('../middleware/authMiddleware');
const { validate, sendMessageRules, paginationRules } = require('../middleware/validation');

router.get('/conversations', secure, getConversations);
router.get('/unread-count', secure, getUnreadCount);
router.post('/conversation/:userId', secure, getOrCreateConversation);
router.get('/:conversationId', secure, paginationRules, validate, getMessages);
router.post('/:conversationId', secure, sendMessageRules, validate, sendMessage);

module.exports = router;
