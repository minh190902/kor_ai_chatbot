const express = require('express');
const router = express.Router();
const learningPlanController = require('../controllers/learningPlanController');

// GET /api/learning-plans?user_id=...
router.get('/', learningPlanController.getLearningPlansByUser);

// POST /api/learning-plans
router.post('/', learningPlanController.createLearningPlan);

// GET /api/learning-plans/:plan_id
router.get('/:plan_id', learningPlanController.getLearningPlanDetail);

module.exports = router;