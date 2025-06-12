const aiService = require('../services/aiService');

async function createLearningPlan(req, res) {
  try {
    const plan = await aiService.callPlanAPI(req.body);
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create learning plan' });
  }
}

module.exports = { createLearningPlan };