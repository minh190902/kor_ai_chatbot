const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const adminRoutes = require('./admin');

// Chat Features
const contextRoutes = require('./context');
const conversationRoutes = require('./conversations');
const chatRoutes = require('./chat');

// AI features
const learningplanRoutes = require('./learningPlans');
const vocabExpansionRoutes = require('./vocabExpansion');
const topikQuestionRoutes = require('./topikQuestion');

router.use('/admin', adminRoutes);
router.use('/conversations', conversationRoutes);
router.use('/chat', chatRoutes);
router.use('/context', contextRoutes);
router.use('/learning-plan', learningplanRoutes);
router.use('/vocab-expansion', vocabExpansionRoutes);
router.use('/topik', topikQuestionRoutes);
router.use('/', authRoutes);

module.exports = router;