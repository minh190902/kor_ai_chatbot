const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// POST /api/chat - Main chat endpoint
router.post('/', chatController.handleChat);

// GET /api/chat/context/:session_id - Get context stats
router.get('/context/:session_id', chatController.getContextStats);

// POST /api/chat/summary - Create summary for session
router.post('/summary', chatController.createSummary);

// POST /api/chat/cleanup - Cleanup old context
router.post('/cleanup', chatController.cleanupContext);

module.exports = router;