// src/routes/conversations.js
const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

// GET    /api/conversations
router.get('/', conversationController.getAllConversations);

// POST   /api/conversations
router.post('/', conversationController.createConversation);

// GET    /api/conversations/:id
router.get('/:id', conversationController.getConversationById);

// GET    /api/conversations/:id/messages
router.get('/:id/messages', conversationController.getMessagesForConversation);

// DELETE /api/conversations/:id
router.delete('/:id', conversationController.deleteConversation);

module.exports = router;
