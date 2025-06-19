const aiService = require('../services/aiService');
const learningPlanService = require('../services/learningPlanService');
const response = require('../utils/response');

async function getLearningPlansByUser(req, res) {
  const { user_id } = req.query;
  if (!user_id) return response.error(res, 'Missing user_id', 400);
  try {
    const plans = await learningPlanService.getLearningPlansByUser(user_id);
    response.success(res, plans);
  } catch (err) {
    response.error(res, 'Failed to fetch learning plans');
  }
}

async function createLearningPlan(req, res) {
  try {
    const plan = await aiService.callPlanAPI(req.body);
    response.success(res, plan, 201);
  } catch (err) {
    response.error(res, err.message || 'Failed to create learning plan');
  }
}

async function getLearningPlanDetail(req, res) {
  const { plan_id } = req.params;
  try {
    const plan = await learningPlanService.getLearningPlanDetail(plan_id);
    if (!plan) return response.error(res, 'Not found', 404);
    response.success(res, {
      ...plan.toJSON(),
      content_json: plan.learning_plan?.content_json
    });
  } catch (err) {
    response.error(res, 'Failed to fetch learning plan detail');
  }
}

module.exports = {
  getLearningPlansByUser,
  createLearningPlan,
  getLearningPlanDetail
};