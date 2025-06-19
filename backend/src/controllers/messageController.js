const messageService = require('../services/messageService');
const response = require('../utils/response');

async function getMessagesBySession(req, res) {
  const { conversation_id } = req.params;
  try {
    const messages = await messageService.getMessagesBySession(conversation_id);
    response.success(res, messages.map(m => ({
      id: m.id,
      role: m.role,
      content: m.content,
      timestamp: m.timestamp
    })));
  } catch (err) {
    response.error(res, 'Failed to get messages');
  }
}

async function searchMessages(req, res) {
  const { user_id, q, from, to } = req.query;
  if (!user_id || !q) return response.error(res, 'user_id and q are required', 400);

  try {
    const messages = await messageService.searchMessages({ user_id, q, from, to });
    response.success(res, messages);
  } catch (err) {
    response.error(res, 'Failed to search messages');
  }
}

async function deleteMessagesInConversation(req, res) {
  const { conversation_id } = req.params;
  try {
    await messageService.deleteMessagesInConversation(conversation_id);
    response.success(res, { message: 'All messages in conversation deleted successfully' });
  } catch (err) {
    response.error(res, 'Failed to delete messages in conversation');
  }
}

module.exports = {
  getMessagesBySession,
  searchMessages,
  deleteMessagesInConversation
};