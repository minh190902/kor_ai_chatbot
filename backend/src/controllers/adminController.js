const adminService = require('../services/adminService');
const response = require('../utils/response');

async function getAllUsers(req, res) {
  try {
    const users = await adminService.getAllUsers();
    response.success(res, users);
  } catch (err) {
    response.error(res, 'Failed to get users');
  }
}

async function getStats(req, res) {
  try {
    const stats = await adminService.getStats();
    response.success(res, stats);
  } catch (err) {
    response.error(res, 'Failed to get stats');
  }
}

async function deleteUser(req, res) {
  const userId = req.params.user_id;
  if (!userId) return response.error(res, 'User ID is required', 400);

  try {
    const result = await adminService.deleteUser(userId);
    if (result.notFound) return response.error(res, 'User not found', 404);
    if (result.forbidden) return response.error(res, 'Cannot delete admin user', 403);
    response.success(res, { message: 'User and all related data deleted successfully' });
  } catch (err) {
    response.error(res, 'Failed to delete user');
  }
}

async function cleanupOldConversations(req, res) {
  const days = parseInt(req.query.days, 10) || 90;
  try {
    const result = await adminService.cleanupOldConversations(days);
    response.success(res, {
      message: `Deleted ${result.deletedCount} conversations older than ${days} days.`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    response.error(res, 'Failed to cleanup old conversations.');
  }
}

module.exports = {
  getAllUsers,
  getStats,
  deleteUser,
  cleanupOldConversations
};