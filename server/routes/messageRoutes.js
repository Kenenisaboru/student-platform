const express = require('express');
const router = express.Router();
const {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
  getUnreadCount,
  createGroupConversation,
  addParticipants,
  removeParticipant,
  updateConversation
} = require('../controllers/messageController');
const { secure } = require('../middleware/authMiddleware');
const { validate, sendMessageRules, paginationRules, createGroupRules, updateConversationRules } = require('../middleware/validation');

router.get('/conversations', secure, getConversations);
router.get('/unread-count', secure, getUnreadCount);
router.post('/conversations/group', secure, createGroupRules, validate, createGroupConversation);
router.put('/conversations/:id/participants', secure, addParticipants);
router.delete('/conversations/:id/participants', secure, removeParticipant);
router.put('/conversations/:id', secure, updateConversationRules, validate, updateConversation);
router.post('/conversation/:userId', secure, getOrCreateConversation);
router.get('/:conversationId', secure, paginationRules, validate, getMessages);
router.post('/:conversationId', secure, sendMessageRules, validate, sendMessage);

module.exports = router;
