const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learningController');

router.post('/', learningController.createLearningPlan);

module.exports = router;