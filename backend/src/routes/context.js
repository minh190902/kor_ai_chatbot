const express = require('express');
const router = express.Router();
const contextController = require('../controllers/contextController');

// GET    /api/context/:conversation_id/stats
router.get('/:conversation_id/stats', contextController.getContextStats);

// GET    /api/context/:conversation_id/preview
router.get('/:conversation_id/preview', contextController.previewContext);

// POST   /api/context/:conversation_id/summary
router.post('/:conversation_id/summary', contextController.createSummary);

// POST   /api/context/:conversation_id/cleanup
router.post('/:conversation_id/cleanup', contextController.cleanupContext);

// PUT    /api/context/:conversation_id/config
router.put('/:conversation_id/config', contextController.configureContext);

// DELETE /api/context/:conversation_id/summary
router.delete('/:conversation_id/summary', contextController.deleteSummary);

module.exports = router;