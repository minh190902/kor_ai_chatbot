const conversationService = require('../services/conversationService');
const response = require('../utils/response');

async function getConversationsByUser(req, res) {
  const { user_id } = req.query;
  if (!user_id) return response.error(res, 'user_id is required', 400);

  try {
    const user = await conversationService.getUserById(user_id);
    if (!user) return response.error(res, 'User not found. Please login again.', 400);

    const sessions = await conversationService.getConversationsByUser(user_id);
    return response.success(res, sessions.map(s => ({
      id: s.id,
      title: s.title,
      startedAt: s.started_at,
      endedAt: s.ended_at,
      isActive: s.is_active
    })));
  } catch (err) {
    response.error(res, 'Failed to get conversations');
  }
}

async function searchConversations(req, res) {
  const { user_id, q, from, to } = req.query;
  if (!user_id) return response.error(res, 'user_id is required', 400);

  try {
    const sessions = await conversationService.searchConversations({ user_id, q, from, to });
    response.success(res, sessions.map(s => ({
      id: s.id,
      title: s.title,
      startedAt: s.started_at,
      endedAt: s.ended_at,
      isActive: s.is_active
    })));
  } catch (err) {
    response.error(res, 'Failed to search conversations');
  }
}

async function createConversation(req, res) {
  const { user_id, title } = req.body;
  if (!user_id) return response.error(res, 'user_id is required', 400);

  try {
    const session = await conversationService.createConversation(user_id, title);
    return response.success(res, { id: session.id, title: session.title, startedAt: session.started_at }, 201);
  } catch (err) {
    response.error(res, err.message, 400);
  }
}

async function deleteConversation(req, res) {
  const { conversation_id } = req.params;
  try {
    const deleted = await conversationService.deleteConversation(conversation_id);
    if (!deleted) return response.error(res, 'Conversation not found', 404);
    response.success(res, { message: 'Conversation deleted successfully' });
  } catch (err) {
    response.error(res, 'Failed to delete conversation');
  }
}

module.exports = {
  getConversationsByUser,
  createConversation,
  deleteConversation,
  searchConversations
};