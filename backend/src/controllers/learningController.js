const aiService = require('../services/aiService');

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

module.exports = { 
  createLearningPlan,
  fetchLearningPlan
};