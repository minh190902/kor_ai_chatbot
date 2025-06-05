const express = require('express');
const router = express.Router();

const conversationRoutes = require('./conversations');
const chatRoutes = require('./chat');
const authRoutes = require('./auth');

router.use('/conversations', conversationRoutes);
router.use('/chat', chatRoutes);
router.use('/', authRoutes);

module.exports = router;