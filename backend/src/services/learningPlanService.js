const { LearningPlan } = require('../db/models');

async function getLearningPlansByUser(user_id) {
  return LearningPlan.findAll({
    where: { user_id },
    attributes: ['plan_id', 'title', 'overview', 'created_at', 'status'],
    order: [['created_at', 'DESC']]
  });
}

async function getLearningPlanDetail(plan_id) {
  return LearningPlan.findByPk(plan_id);
}

module.exports = {
  getLearningPlansByUser,
  getLearningPlanDetail
};