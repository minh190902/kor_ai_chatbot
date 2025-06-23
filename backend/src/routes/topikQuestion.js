const express = require('express');
const router = express.Router();
const topikQuestionController = require('../controllers/topikQuestionController');

// POST /api/topik/question
router.post('/question', topikQuestionController.handleTopikQuestionGen);

module.exports = router;