const express = require('express');
const router = express.Router();
const requireRole = require('../middleware/requireRole');
const adminController = require('../controllers/adminController');

router.delete('/delete-user/:id', requireRole('admin'), adminController.deleteUser);

// Cleanup conversations older than X days (default 90)
router.post('/cleanup', requireRole('admin'), adminController.cleanupOldConversations);

module.exports = router;