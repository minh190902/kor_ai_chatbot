const express = require('express');
const router = express.Router();

const conversationRoutes = require('./conversations');
const chatRoutes = require('./chat');
const authRoutes = require('./auth'); // Thêm dòng này

router.use('/conversations', conversationRoutes);
router.use('/chat', chatRoutes);
router.use('/', authRoutes); // Thêm dòng này

module.exports = router;