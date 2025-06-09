const contextService = require('../services/contextService');
const { ChatSession } = require('../db/models');

/**
 * GET /api/context/:session_id/stats
 * Get context statistics for a session
 */
async function getContextStats(req, res) {
  const { session_id } = req.params;
  
  try {
    const stats = await contextService.getContextStats(session_id);
    if (!stats) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(stats);
  } catch (err) {
    console.error('Error getting context stats:', err);
    res.status(500).json({ error: 'Failed to get context stats' });
  }
}

/**
 * POST /api/context/summary
 * Create or update summary for a session
 */
async function createSummary(req, res) {
  const { session_id } = req.body;
  
  if (!session_id) {
    return res.status(400).json({ error: 'session_id is required' });
  }

  try {
    const summary = await contextService.createSummaryForSession(session_id);
    if (!summary) {
      return res.status(400).json({ error: 'Not enough messages to create summary' });
    }
    res.json({ summary, success: true });
  } catch (err) {
    console.error('Error creating summary:', err);
    res.status(500).json({ error: 'Failed to create summary' });
  }
}

/**
 * POST /api/context/cleanup
 * Cleanup old context while keeping recent messages
 */
async function cleanupContext(req, res) {
  const { session_id, keep_recent = 10 } = req.body;
  
  if (!session_id) {
    return res.status(400).json({ error: 'session_id is required' });
  }

  try {
    const result = await contextService.cleanupOldContext(session_id, keep_recent);
    res.json(result);
  } catch (err) {
    console.error('Error cleaning up context:', err);
    res.status(500).json({ error: 'Failed to cleanup context' });
  }
}

/**
 * PUT /api/context/:session_id/config
 * Configure context settings for a session
 */
async function configureContext(req, res) {
  const { session_id } = req.params;
  const config = req.body;

  try {
    const updatedContext = await contextService.configureContextForSession(session_id, config);
    res.json({ config: updatedContext, success: true });
  } catch (err) {
    console.error('Error configuring context:', err);
    res.status(500).json({ error: 'Failed to configure context' });
  }
}

/**
 * GET /api/context/:session_id/preview
 * Preview what context will be sent to AI
 */
async function previewContext(req, res) {
  const { session_id } = req.params;
  const { max_messages, max_tokens } = req.query;

  try {
    const contextResult = await contextService.getContextForSession(session_id, {
      maxMessages: max_messages ? parseInt(max_messages) : undefined,
      maxTokens: max_tokens ? parseInt(max_tokens) : undefined
    });

    res.json({
      messages: contextResult.messages,
      totalTokens: contextResult.totalTokens,
      truncated: contextResult.truncated,
      summary: contextResult.summary,
      totalMessagesInSession: contextResult.totalMessagesInSession,
      shouldCreateSummary: contextResult.shouldCreateSummary
    });
  } catch (err) {
    console.error('Error previewing context:', err);
    res.status(500).json({ error: 'Failed to preview context' });
  }
}

/**
 * DELETE /api/context/:session_id/summary
 * Delete summary for a session
 */
async function deleteSummary(req, res) {
  const { session_id } = req.params;

  try {
    const session = await ChatSession.findByPk(session_id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const updatedContext = {
      ...session.llm_context,
      summary: null,
      summary_created_at: null,
      summarized_messages_count: null
    };

    await ChatSession.update({
      llm_context: updatedContext
    }, {
      where: { id: session_id }
    });

    res.json({ success: true, message: 'Summary deleted successfully' });
  } catch (err) {
    console.error('Error deleting summary:', err);
    res.status(500).json({ error: 'Failed to delete summary' });
  }
}

module.exports = {
  getContextStats,
  createSummary,
  cleanupContext,
  configureContext,
  previewContext,
  deleteSummary
};