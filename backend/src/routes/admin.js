const express = require('express');
const router = express.Router();
const requireRole = require('../middleware/requireRole');
const adminController = require('../controllers/adminController');

// GET    /api/admin/users
router.get('/users', requireRole('admin'), adminController.getAllUsers);

// GET    /api/admin/stats
router.get('/stats', requireRole('admin'), adminController.getStats);

// DELETE /api/admin/users/:user_id
router.delete('/users/:user_id', requireRole('admin'), adminController.deleteUser);

// POST   /api/admin/cleanup
router.post('/cleanup', requireRole('admin'), adminController.cleanupOldConversations);

module.exports = router;