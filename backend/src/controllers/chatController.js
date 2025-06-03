// src/controllers/chatController.js
const { v4: uuidv4 } = require('uuid');
const storage = require('../services/storageService');
const aiService = require('../services/aiService');
const { generateTitleFromMessage } = require('../utils/helpers');

/**
 * POST /api/chat
 */
async function handleChat(req, res) {
  try {
    const { message, conversationId, settings = {} } = req.body;
    if (!message || !conversationId) {
      return res.status(400).json({ error: 'Message and conversationId are required' });
    }

    // Kiểm tra conversation tồn tại
    const conversation = storage.getConversationById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Lưu message từ user
    const userMessage = {
      id: uuidv4(),
      conversationId,
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    storage.addMessage(userMessage);

    // Lấy history để feed vào AI (10 tin nhắn gần nhất)
    const history = storage.getMessagesByConversationId(conversationId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .slice(-10)
      .map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
        timestamp: m.timestamp,
      }));

    // Chuẩn payload cho AI
    const aiRequestData = {
      message,
      conversation_history: history,
      settings: {
        model: settings.model || 'default',
        temperature: settings.temperature || 0.7,
        max_tokens: settings.maxTokens || 1000,
        ...settings,
      },
    };

    // Gọi FastAPI
    const aiResponseText = await aiService.callChatAPI(aiRequestData);

    // Lưu message từ AI
    const aiMessage = {
      id: uuidv4(),
      conversationId,
      text: aiResponseText,
      sender: 'ai',
      timestamp: new Date().toISOString(),
    };
    storage.addMessage(aiMessage);

    // Cập nhật conversation: updatedAt, messageCount, title (nếu lần đầu)
    conversation.updatedAt = new Date().toISOString();
    const totalMsgs = storage.getMessagesByConversationId(conversationId).length;
    conversation.messageCount = totalMsgs;
    if (totalMsgs === 2 && conversation.title === 'New Conversation') {
      conversation.title = generateTitleFromMessage(message);
    }
    storage.updateConversation(conversation);

    await storage.saveData();

    res.json({
      response: aiResponseText,
      messageId: aiMessage.id,
      timestamp: aiMessage.timestamp,
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/models
 */
async function getModels(req, res) {
  try {
    const data = await aiService.getAvailableModels();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
}

module.exports = {
  handleChat,
  getModels,
};
