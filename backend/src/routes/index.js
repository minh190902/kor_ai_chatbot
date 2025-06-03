// src/routes/index.js
const express = require('express');
const router = express.Router();

const conversationRoutes = require('./conversations');
const chatRoutes = require('./chat');

router.use('/conversations', conversationRoutes);
router.use('/chat', chatRoutes);

module.exports = router;
