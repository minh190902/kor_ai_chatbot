const express = require('express');
const router = express.Router();
const topikQuestionController = require('../controllers/topikQuestionController');

// POST /api/topik/question
router.post('/question', topikQuestionController.handleTopikQuestionGen);
router.get('/question-types', topikQuestionController.getTopikQuestionTypes);

module.exports = router;