const { v4: uuidv4 } = require('uuid');
const aiService = require('../services/aiService');
const storage = require('../services/storageService');
const logger = require('../utils/logger');

async function handleChat(req, res) {
  try {
    const { user_id, session_id, message, settings = {} } = req.body;
    
    if (!user_id || !session_id || !message) {
      return res.status(400).json({ error: 'user_id, session_id, and message are required' });
    }

    // Kiểm tra conversation tồn tại
    const conversation = storage.getConversationById(session_id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Lưu message từ user
    const userMessage = {
      id: uuidv4(),
      conversationId: session_id, // Sửa thành session_id
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    storage.addMessage(userMessage);

    // Lấy history
    const history = storage
      .getMessagesByConversationId(session_id) // Sửa thành session_id
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .slice(-10)
      .map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
        timestamp: m.timestamp,
      }));

    const aiRequestData = {
      user_id,
      session_id,
      message,
      history
    };

    // Gọi FastAPI
    const aiResponseText = await aiService.callChatAPI(aiRequestData);

    // Lưu message AI
    const aiMessage = {
      id: uuidv4(),
      conversationId: session_id, // Sửa thành session_id
      text: aiResponseText,
      sender: 'ai',
      timestamp: new Date().toISOString(),
    };
    storage.addMessage(aiMessage);

    // Cập nhật conversation
    conversation.updatedAt = new Date().toISOString();
    conversation.messageCount = storage.getMessagesByConversationId(session_id).length;
    storage.updateConversation(conversation);

    await storage.saveData();

    res.json({
      response: aiResponseText,
      messageId: aiMessage.id,
      timestamp: aiMessage.timestamp,
    });

  } catch (err) {
    logger.error('Chat error:', err);
    res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
}

module.exports = {
  handleChat
};