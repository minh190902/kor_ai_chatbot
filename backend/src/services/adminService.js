const { User, ChatSession, Message } = require('../db/models');
const { Op } = require('sequelize');
const { USER_STATUS } = require('../constants/status');
const { ADMIN } = require('../constants/role');

async function getAllUsers() {
  return User.findAll({
    attributes: ['id', 'username', 'email', 'created_at', 'last_active', 'status', 'role'],
    order: [['created_at', 'DESC']]
  });
}

async function getStats() {
  const [totalUsers, totalSessions, totalMessages, activeUsers] = await Promise.all([
    User.count(),
    ChatSession.count(),
    Message.count(),
    User.count({ where: { status: USER_STATUS.ACTIVE } })
  ]);
  return { totalUsers, totalSessions, totalMessages, activeUsers };
}

async function deleteUser(userId) {
  const user = await User.findByPk(userId);
  if (!user) return { notFound: true };
  if (user.role === ADMIN) return { forbidden: true };

  const userSessions = await ChatSession.findAll({ where: { user_id: userId }, attributes: ['id'] });
  const sessionIds = userSessions.map(s => s.id);

  if (sessionIds.length > 0) {
    await Message.destroy({ where: { conversation_id: { [Op.in]: sessionIds } } });
    await ChatSession.destroy({ where: { user_id: userId } });
  }
  await user.destroy();
  return { deleted: true };
}

async function cleanupOldConversations(days = 90) {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const oldSessions = await ChatSession.findAll({
    where: { started_at: { [Op.lt]: cutoff } },
    attributes: ['id'],
  });
  const oldSessionIds = oldSessions.map(s => s.id);

  if (oldSessionIds.length > 0) {
    await Message.destroy({ where: { conversation_id: { [Op.in]: oldSessionIds } } });
    await ChatSession.destroy({ where: { id: { [Op.in]: oldSessionIds } } });
  }
  return { deletedCount: oldSessionIds.length, days };
}

module.exports = {
  getAllUsers,
  getStats,
  deleteUser,
  cleanupOldConversations
};