const contextService = require('../services/contextService');
const { ChatSession } = require('../db/models');
const response = require('../utils/response');

async function getContextStats(req, res) {
  const { conversation_id } = req.params;
  try {
    const stats = await contextService.getContextStats(conversation_id);
    if (!stats) return response.error(res, 'Conversation not found', 404);
    response.success(res, stats);
  } catch (err) {
    response.error(res, 'Failed to get context stats');
  }
}

async function createSummary(req, res) {
  const { conversation_id } = req.params;
  if (!conversation_id) return response.error(res, 'conversation_id is required', 400);
  try {
    const summary = await contextService.createSummaryForSession(conversation_id);
    if (!summary) return response.error(res, 'Not enough messages to create summary', 400);
    response.success(res, { summary });
  } catch (err) {
    response.error(res, 'Failed to create summary');
  }
}

async function cleanupContext(req, res) {
  const { conversation_id } = req.params;
  const { keep_recent = 10 } = req.body;
  if (!conversation_id) return response.error(res, 'conversation_id is required', 400);
  try {
    const result = await contextService.cleanupOldContext(conversation_id, keep_recent);
    response.success(res, result);
  } catch (err) {
    response.error(res, 'Failed to cleanup context');
  }
}

async function configureContext(req, res) {
  const { conversation_id } = req.params;
  const config = req.body;
  try {
    const updatedContext = await contextService.configureContextForSession(conversation_id, config);
    response.success(res, { config: updatedContext });
  } catch (err) {
    response.error(res, 'Failed to configure context');
  }
}

async function previewContext(req, res) {
  const { conversation_id } = req.params;
  const { max_messages, max_tokens } = req.query;
  try {
    const contextResult = await contextService.getContextForSession(conversation_id, {
      maxMessages: max_messages ? parseInt(max_messages) : undefined,
      maxTokens: max_tokens ? parseInt(max_tokens) : undefined
    });
    response.success(res, {
      messages: contextResult.messages,
      totalTokens: contextResult.totalTokens,
      truncated: contextResult.truncated,
      summary: contextResult.summary,
      totalMessagesInSession: contextResult.totalMessagesInSession,
      shouldCreateSummary: contextResult.shouldCreateSummary
    });
  } catch (err) {
    response.error(res, 'Failed to preview context');
  }
}

async function deleteSummary(req, res) {
  const { conversation_id } = req.params;
  try {
    const session = await ChatSession.findByPk(conversation_id);
    if (!session) return response.error(res, 'Conversation not found', 404);
    const updatedContext = {
      ...session.llm_context,
      summary: null,
      summary_created_at: null,
      summarized_messages_count: null
    };
    await ChatSession.update({
      llm_context: updatedContext
    }, {
      where: { id: conversation_id }
    });
    response.success(res, { message: 'Summary deleted successfully' });
  } catch (err) {
    response.error(res, 'Failed to delete summary');
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