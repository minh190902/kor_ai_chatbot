const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learningController');

router.post('/', learningController.createLearningPlan);
router.get('/', learningController.fetchLearningPlan);

module.exports = router;