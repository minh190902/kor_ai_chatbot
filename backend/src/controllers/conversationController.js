// src/controllers/conversationController.js
const { v4: uuidv4 } = require('uuid');
const storage = require('../services/storageService');
const { sortByUpdatedAtDesc, generateTitleFromMessage } = require('../utils/helpers');

/**
 * GET /api/conversations
 */
async function getAllConversations(req, res) {
  try {
    let convs = storage.getAllConversations();
    convs = sortByUpdatedAtDesc(convs);
    res.json(convs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
}

/**
 * POST /api/conversations
 */
async function createConversation(req, res) {
  try {
    const { title } = req.body;
    const newConversation = {
      id: uuidv4(),
      title: title || 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
    };
    storage.createConversation(newConversation);
    await storage.saveData();
    res.json({ session_id });
    res.status(201).json(newConversation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
}

/**
 * GET /api/conversations/:id
 */
async function getConversationById(req, res) {
  try {
    const { id } = req.params;
    const conversation = storage.getConversationById(id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
}

/**
 * GET /api/conversations/:id/messages
 */
async function getMessagesForConversation(req, res) {
  try {
    const { id } = req.params;
    const msgs = storage.getMessagesByConversationId(id)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    res.json(msgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get messages' });
  }
}

/**
 * DELETE /api/conversations/:id
 */
async function deleteConversation(req, res) {
  try {
    const { id } = req.params;
    const existing = storage.getConversationById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    storage.deleteConversationById(id);
    await storage.saveData();
    res.json({ message: 'Conversation deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
}

module.exports = {
  getAllConversations,
  createConversation,
  getConversationById,
  getMessagesForConversation,
  deleteConversation,
};
