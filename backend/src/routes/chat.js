// src/routes/chat.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// POST /api/chat
router.post('/chat', chatController.handleChat);

// GET  /api/models
// router.get('/models', chatController.getModels);

module.exports = router;
