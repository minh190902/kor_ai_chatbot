const chatService = require('../services/chatService');
const response = require('../utils/response');

async function handleChat(req, res) {
  const { user_id, conversation_id, message, language = 'vi', settings = {}, stream = false } = req.body;
  if (!user_id || !conversation_id || !message) {
    return response.error(res, 'user_id, conversation_id, and message are required', 400);
  }

  try {
    const result = await chatService.handleChat({
      user_id,
      conversation_id,
      message,
      language,
      settings,
      stream,
      res
    });

    // Only send JSON if not streaming
    if (!stream && result) {
      return response.success(res, result);
    }
    // If streaming, response is handled in service
  } catch (err) {
    if (stream) {
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'Failed to process chat' })}\n\n`);
      res.end();
    } else {
      response.error(res, 'Failed to process chat', 500);
    }
  }
}

module.exports = { handleChat };