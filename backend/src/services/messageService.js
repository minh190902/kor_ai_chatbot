const { Message } = require('../db/models');
const { Op } = require('sequelize');

async function getMessagesBySession(conversation_id) {
  return Message.findAll({
    where: { conversation_id },
    order: [['timestamp', 'ASC']]
  });
}

async function searchMessages({ user_id, q, from, to }) {
  let where = { user_id, content: { [Op.iLike]: `%${q}%` } };
  if (from || to) {
    where.created_at = {};
    if (from) where.created_at[Op.gte] = new Date(from);
    if (to) where.created_at[Op.lte] = new Date(to);
  }
  return Message.findAll({
    where,
    order: [['created_at', 'DESC']]
  });
}

async function deleteMessagesInConversation(conversation_id) {
  return Message.destroy({ where: { conversation_id } });
}

module.exports = {
  getMessagesBySession,
  searchMessages,
  deleteMessagesInConversation
};