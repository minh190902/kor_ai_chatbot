const express = require('express');
const router = express.Router();
const contextController = require('../controllers/contextController');

// GET /api/context/:session_id/stats - Get context statistics
router.get('/:session_id/stats', contextController.getContextStats);

// GET /api/context/:session_id/preview - Preview context
router.get('/:session_id/preview', contextController.previewContext);

// POST /api/context/summary - Create summary
router.post('/summary', contextController.createSummary);

// POST /api/context/cleanup - Cleanup old context
router.post('/cleanup', contextController.cleanupContext);

// PUT /api/context/:session_id/config - Configure context settings
router.put('/:session_id/config', contextController.configureContext);

// DELETE /api/context/:session_id/summary - Delete summary
router.delete('/:session_id/summary', contextController.deleteSummary);

module.exports = router;