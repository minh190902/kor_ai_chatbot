const { Message } = require('../db/models');
const { Op } = require('sequelize');

async function getMessagesBySession(req, res) {
  const { session_id } = req.params;
  try {
    const messages = await Message.findAll({
      where: { session_id },
      order: [['timestamp', 'ASC']]
    });
    res.json(messages.map(m => ({
      id: m.id,
      role: m.role,
      content: m.content,
      timestamp: m.timestamp
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get messages' });
  }
}

async function searchMessages(req, res) {
  const { user_id, q, from, to } = req.query;
  if (!user_id || !q) return res.status(400).json({ error: 'user_id and q are required' });

  let where = { user_id, content: { [Op.iLike]: `%${q}%` } };
  if (from || to) {
    where.created_at = {};
    if (from) where.created_at[Op.gte] = new Date(from);
    if (to) where.created_at[Op.lte] = new Date(to);
  }

  try {
    const messages = await Message.findAll({
      where,
      order: [['created_at', 'DESC']]
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search messages' });
  }
};

module.exports = { 
  getMessagesBySession,
  searchMessages
};