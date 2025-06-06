const express = require('express');
const router = express.Router();

const conversationRoutes = require('./conversations');
const chatRoutes = require('./chat');
const authRoutes = require('./auth');
const adminRoutes = require('./admin');

router.use('/admin', adminRoutes);
router.use('/conversations', conversationRoutes);
router.use('/chat', chatRoutes);
router.use('/', authRoutes);

module.exports = router;