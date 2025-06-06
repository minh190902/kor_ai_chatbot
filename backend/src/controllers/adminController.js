const { User, ChatSession, Message } = require('../db/models');
const { Op } = require('sequelize');

// GET /api/admin/users
async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'created_at', 'last_active', 'status', 'role'],
      order: [['created_at', 'DESC']]
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get users' });
  }
}

// GET /api/admin/stats
async function getStats(req, res) {
  try {
    const [totalUsers, totalSessions, totalMessages, activeUsers] = await Promise.all([
      User.count(),
      ChatSession.count(),
      Message.count(),
      User.count({ where: { status: 'ACTIVE' } })
    ]);

    res.json({
      totalUsers,
      totalSessions,
      totalMessages,
      activeUsers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get stats' });
  }
}

async function deleteUser(req, res) {
  const userId = req.params.id;
  if (!userId) return res.status(400).json({ error: 'User ID is required' });

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.role === 'admin') {
      return res.status(403).json({ error: 'Cannot delete admin user' });
    }

    // Delete all messages and sessions related to this user
    const userSessions = await ChatSession.findAll({
      where: { user_id: userId },
      attributes: ['id']
    });
    const sessionIds = userSessions.map(s => s.id);

    if (sessionIds.length > 0) {
      await Message.destroy({ where: { session_id: { [Op.in]: sessionIds } } });
      await ChatSession.destroy({ where: { user_id: userId } });
    }

    await user.destroy();
    res.json({ message: 'User and all related data deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function cleanupOldConversations(req, res) {
  const days = parseInt(req.query.days, 10) || 90;
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  try {
    const oldSessions = await ChatSession.findAll({
      where: { started_at: { [Op.lt]: cutoff } },
      attributes: ['id'],
    });
    const oldSessionIds = oldSessions.map(s => s.id);

    if (oldSessionIds.length > 0) {
      await Message.destroy({ where: { session_id: { [Op.in]: oldSessionIds } } });
      await ChatSession.destroy({ where: { id: { [Op.in]: oldSessionIds } } });
    }

    res.json({ 
      message: `Deleted ${oldSessionIds.length} conversations older than ${days} days.`,
      deletedCount: oldSessionIds.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to cleanup old conversations.' });
  }
}

module.exports = {
  getAllUsers,
  getStats,
  deleteUser,
  cleanupOldConversations
};