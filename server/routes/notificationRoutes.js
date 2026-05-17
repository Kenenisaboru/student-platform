const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const { secure } = require('../middleware/authMiddleware');

router.get('/', secure, getNotifications);
router.put('/read', secure, markAsRead);

module.exports = router;
