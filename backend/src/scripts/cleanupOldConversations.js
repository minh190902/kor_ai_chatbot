const { ChatSession, Message } = require('../db/models');
const { Op } = require('sequelize');
const sequelize = require('../db/sequelize');

async function cleanupOldConversations(days = 90) {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Tìm các session quá hạn
  const oldSessions = await ChatSession.findAll({
    where: { started_at: { [Op.lt]: cutoff } },
    attributes: ['id'],
  });
  const oldSessionIds = oldSessions.map(s => s.id);

  // Xóa messages thuộc các session này
  await Message.destroy({ where: { session_id: { [Op.in]: oldSessionIds } } });

  // Xóa các session
  await ChatSession.destroy({ where: { id: { [Op.in]: oldSessionIds } } });

  console.log(`Deleted ${oldSessionIds.length} old conversations and messages above ${days} days.`);
}

sequelize.authenticate().then(() => {
  cleanupOldConversations(90).then(() => process.exit(0));
});