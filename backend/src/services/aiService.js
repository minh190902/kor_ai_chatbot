// src/services/aiService.js
const axios = require('axios');
const logger = require('../utils/logger');

const FASTAPI_URL = process.env.AI_API_URL || 'http://localhost:8080';
const CHAT_ENDPOINT = '/chat';
// const MODELS_ENDPOINT = '/api/v1/models';

/**
 * Gọi API chat của FastAPI
 * @param {Object} payload { message, conversation_history, settings }
 */
async function callChatAPI(payload) {
  try {
    const res = await axios.post(
      `${FASTAPI_URL}${CHAT_ENDPOINT}`,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      }
    );
    let aiResp = res.data.response || res.data.message || res.data;
    if (typeof aiResp === 'object') {
      aiResp = aiResp.content || aiResp.text || JSON.stringify(aiResp);
    }
    return aiResp;
  } catch (err) {
    logger.error('AI API Error:', err.message);
    if (err.response) {
      logger.error('AI API Response Error:', {
        status: err.response.status,
        data: err.response.data,
      });
    }
    // Trả về fallback message
    return 'Xin lỗi, tôi đang gặp vấn đề kỹ thuật. Vui lòng thử lại sau.';
  }
}

/**
 * Lấy danh sách model từ FastAPI
 */
async function getAvailableModels() {
  try {
    const res = await axios.get(`${FASTAPI_URL}${CHAT_ENDPOINT}`);
    return res.data;
  } catch (err) {
    logger.error('Error fetching models:', err.message);
    return { models: ['default'] }; // fallback
  }
}

module.exports = {
  callChatAPI,
  getAvailableModels,
};
