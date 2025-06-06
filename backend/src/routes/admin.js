const express = require('express');
const router = express.Router();
const requireRole = require('../middleware/requireRole');
const adminController = require('../controllers/adminController');

router.delete('/delete-user/:id', requireRole('admin'), adminController.deleteUser);

module.exports = router;