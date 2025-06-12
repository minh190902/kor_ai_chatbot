const { User, ChatSession, Message } = require('../db/models');
const { Op } = require('sequelize');

// GET /api/conversations?user_id=...
async function getConversationsByUser(req, res) {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: 'user_id is required' });

  try {
    let user = await User.findByPk(user_id);
    if (!user) {
      return res.status(400).json({ error: 'User not found. Please login again.' });
    }

    const sessions = await ChatSession.findAll({
      where: { user_id },
      order: [['started_at', 'DESC']]
    });
    return res.json(sessions.map(s => ({
      id: s.id,
      title: s.title,
      startedAt: s.started_at,
      endedAt: s.ended_at,
      isActive: s.is_active
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
}

async function searchConversations(req, res) {
  const { user_id, q, from, to } = req.query;
  if (!user_id) return res.status(400).json({ error: 'user_id is required' });

  let where = { user_id };
  if (q) where.title = { [Op.iLike]: `%${q}%` };
  if (from || to) {
    where.started_at = {};
    if (from) where.started_at[Op.gte] = new Date(from);
    if (to) where.started_at[Op.lte] = new Date(to);
  }

  try {
    const sessions = await ChatSession.findAll({
      where,
      order: [['started_at', 'DESC']]
    });
    res.json(sessions.map(s => ({
      id: s.id,
      title: s.title,
      startedAt: s.started_at,
      endedAt: s.ended_at,
      isActive: s.is_active
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to search conversations' });
  }
};

// POST /api/conversations
async function createConversation(req, res) {
  const { user_id, title } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id is required' });

  try {
    let user = await User.findByPk(user_id);
    if (!user) user = await User.create({ id: user_id, username: `user_${user_id}` });

    const session = await ChatSession.create({ user_id, title: title || 'Cuộc trò chuyện mới' });
    return res.json({ id: session.id, title: session.title, startedAt: session.started_at });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
}

// DELETE /api/conversations/:id
async function deleteConversation(req, res) {
  const { session_id } = req.params;
  try {
    console.log('Delete API called with id:', session_id);
    const session = await ChatSession.findByPk(session_id);
    console.log('Session found:', session);
    if (!session) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    // remove all messages in this session
    await Message.destroy({ where: { session_id: session_id } });
    await session.destroy();
    res.json({ message: 'Conversation deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
}

module.exports = {
  getConversationsByUser,
  createConversation,
  deleteConversation,
  searchConversations
};