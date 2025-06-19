const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const messageController = require('../controllers/messageController');

// GET    /api/conversations?user_id=...
router.get('/', conversationController.getConversationsByUser);

// POST   /api/conversations
router.post('/', conversationController.createConversation);

// GET    /api/conversations/search
router.get('/search', conversationController.searchConversations);

// // GET    /api/messages/search
// router.get('/messages/search', messageController.searchMessages);

// DELETE /api/conversations/:id
router.delete('/:conversation_id', conversationController.deleteConversation);

// GET    /api/conversations/:conversation_id/messages
router.get('/:conversation_id/messages', messageController.getMessagesBySession);

// DELETE /api/conversations/:conversation_id/messages
router.delete('/:conversation_id/messages', messageController.deleteMessagesInConversation);

module.exports = router;