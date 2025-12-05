const express = require('express');
const router = express.Router();
const { sendMessage, getConversation, getConversations, markAsRead } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendMessage);
router.get('/', protect, getConversations);
router.get('/:userId', protect, getConversation);
router.put('/:userId/read', protect, markAsRead);

module.exports = router;
