const { User, ChatSession, Message } = require('../db/models');
const { Op } = require('sequelize');

async function getUserById(user_id) {
  return User.findByPk(user_id);
}

async function getConversationsByUser(user_id) {
  return ChatSession.findAll({
    where: { user_id },
    order: [['started_at', 'DESC']]
  });
}

async function searchConversations({ user_id, q, from, to }) {
  let where = { user_id };
  if (q) where.title = { [Op.iLike]: `%${q}%` };
  if (from || to) {
    where.started_at = {};
    if (from) where.started_at[Op.gte] = new Date(from);
    if (to) where.started_at[Op.lte] = new Date(to);
  }
  return ChatSession.findAll({
    where,
    order: [['started_at', 'DESC']]
  });
}

async function createConversation(user_id, title) {
  const user = await User.findByPk(user_id);
  if (!user) throw new Error('User not found. Please login again.');
  return ChatSession.create({ user_id, title: title || 'Cuộc trò chuyện mới' });
}

async function deleteConversation(conversation_id) {
  const session = await ChatSession.findByPk(conversation_id);
  if (!session) return null;
  await Message.destroy({ where: { conversation_id } });
  await session.destroy();
  return true;
}

module.exports = {
  getUserById,
  getConversationsByUser,
  searchConversations,
  createConversation,
  deleteConversation
};