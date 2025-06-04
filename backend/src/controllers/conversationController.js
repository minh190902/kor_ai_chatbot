const { User, ChatSession, Message } = require('../db/models');

// GET /api/conversations?user_id=...
async function getConversationsByUser(req, res) {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: 'user_id is required' });

  try {
    let user = await User.findByPk(user_id);
    if (!user) {
      user = await User.create({ id: user_id, username: `user_${user_id}` });
      const session = await ChatSession.create({ user_id: user.id, title: 'Cuộc trò chuyện mới' });
      return res.json([{ id: session.id, title: session.title, startedAt: session.started_at }]);
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
  const { id } = req.params;
  try {
    const session = await ChatSession.findByPk(id);
    if (!session) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    // Xóa tất cả messages thuộc session này
    await Message.destroy({ where: { session_id: id } });
    // Xóa session
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
};