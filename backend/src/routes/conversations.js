const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const messageController = require('../controllers/messageController');

// GET    /api/conversations?user_id=...
router.get('/', conversationController.getConversationsByUser);

// POST   /api/conversations
router.post('/', conversationController.createConversation);

router.get('/search', conversationController.searchConversations);
router.get('/messages/search', messageController.searchMessages);

// DELETE /api/conversations/:id
router.delete('/:session_id', conversationController.deleteConversation);

router.delete('/:session_id/messages', messageController.deleteMessagesInConversation);

router.get('/:session_id/messages', messageController.getMessagesBySession);

module.exports = router;