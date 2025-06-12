const express = require('express');
const router = express.Router();

const conversationRoutes = require('./conversations');
const chatRoutes = require('./chat');
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const contextRoutes = require('./context');
const learningplanRoutes = require('./plan');

router.use('/admin', adminRoutes);
router.use('/conversations', conversationRoutes);
router.use('/chat', chatRoutes);
router.use('/learning-plan', learningplanRoutes);
router.use('/context', contextRoutes);
router.use('/', authRoutes);

module.exports = router;