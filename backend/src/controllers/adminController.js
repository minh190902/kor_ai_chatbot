const { User, ChatSession, Message } = require('../db/models');
const { Op } = require('sequelize');

async function deleteUser(req, res) {
  const userId = req.params.id;
  if (!userId) return res.status(400).json({ error: 'User ID is required' });

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

async function cleanupOldConversations(req, res) {
  const days = parseInt(req.query.days, 10) || 90;
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  try {
    const oldSessions = await ChatSession.findAll({
      where: { started_at: { [Op.lt]: cutoff } },
      attributes: ['id'],
    });
    const oldSessionIds = oldSessions.map(s => s.id);

    await Message.destroy({ where: { session_id: { [Op.in]: oldSessionIds } } });
    await ChatSession.destroy({ where: { id: { [Op.in]: oldSessionIds } } });

    res.json({ message: `Deleted ${oldSessionIds.length} conversations older than ${days} days.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cleanup old conversations.' });
  }
}

module.exports = {
    deleteUser,
    cleanupOldConversations
}