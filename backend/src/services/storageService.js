// src/services/storageService.js
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

const DATA_DIR = path.join(__dirname, '../../data');
const CONVERSATIONS_FILE = path.join(DATA_DIR, 'conversations.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

let conversations = [];
let messages = [];
let users = [];

function findUserByUsername(username) {
  return users.find(u => u.username === username);
}

function createUser(user) {
  users.push(user);
  return user;
}

module.exports = {
  // ...các hàm khác
  findUserByUsername,
  createUser,
};

/**
 * Đảm bảo folder data tồn tại
 */
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    logger.error('Error creating data directory:', err);
  }
}

/**
 * Load dữ liệu từ file JSON vào memory
 */
async function loadData() {
  try {
    await ensureDataDir();

    // Load conversations
    try {
      const data = await fs.readFile(CONVERSATIONS_FILE, 'utf8');
      conversations = JSON.parse(data);
    } catch (err) {
      conversations = [];
    }

    // Load messages
    try {
      const data = await fs.readFile(MESSAGES_FILE, 'utf8');
      messages = JSON.parse(data);
    } catch (err) {
      messages = [];
    }

    logger.info('✅ Data loaded: ', {
      conversations: conversations.length,
      messages: messages.length
    });
  } catch (err) {
    logger.error('Error loading data:', err);
  }
}

/**
 * Ghi dữ liệu từ memory vào file JSON
 */
async function saveData() {
  try {
    await fs.writeFile(CONVERSATIONS_FILE, JSON.stringify(conversations, null, 2));
    await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));
    logger.info('✅ Data saved successfully');
  } catch (err) {
    logger.error('Error saving data:', err);
  }
}

/**
 * Các hàm CRUD cho conversations và messages
 */
function getAllConversations() {
  return conversations;
}

function getConversationById(id) {
  return conversations.find((c) => c.id === id);
}

function createConversation(obj) {
  conversations.push(obj);
  return obj;
}

function deleteConversationById(id) {
  conversations = conversations.filter((c) => c.id !== id);
  messages = messages.filter((m) => m.conversationId !== id);
}

function addMessage(message) {
  messages.push(message);
  return message;
}

function getMessagesByConversationId(conversationId) {
  return messages.filter(m => m.conversationId === conversationId);
}

function updateConversation(conversation) {
  const index = conversations.findIndex(c => c.id === conversation.id);
  if (index !== -1) {
    conversations[index] = conversation;
  }
  return conversation;
}

module.exports = {
  loadData,
  saveData,
  getAllConversations,
  getConversationById,
  createConversation,
  deleteConversationById,
  updateConversation,
  getMessagesByConversationId,
  addMessage,
};
