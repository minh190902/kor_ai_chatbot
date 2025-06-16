const aiService = require('../services/aiService');
const { LearningPlan } = require('../db/models');

async function createLearningPlan(req, res) {
  try {
    const plan = await aiService.callPlanAPI(req.body);
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create learning plan' });
  }
}

async function fetchLearningPlan(req, res) {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });
  const plans = await LearningPlan.findAll({
    where: { user_id },
    attributes: ['plan_id', 'title', 'overview', 'created_at', 'status'],
    order: [['created_at', 'DESC']]
  });
  res.json(plans)};

async function getLearningPlanDetail(req, res) {
  const { plan_id } = req.params;
  const plan = await LearningPlan.findByPk(plan_id);
  if (!plan) return res.status(404).json({ error: 'Not found' });
  res.json({
    ...plan.toJSON(),
    content_json: plan.learning_plan?.content_json
  });
};

module.exports = { 
  createLearningPlan,
  fetchLearningPlan,
  getLearningPlanDetail
};