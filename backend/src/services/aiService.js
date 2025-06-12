const axios = require('axios');
const logger = require('../utils/logger');

const FASTAPI_URL = process.env.AI_API_URL || 'http://localhost:8080';

/**
 * Hàm tổng quát gọi bất kỳ endpoint FastAPI nào (non-stream)
 */
async function callFastAPI(endpoint, payload, options = {}) {
  try {
    const res = await axios.post(
      `${FASTAPI_URL}${endpoint}`,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: options.timeout || 30000,
        ...options.axiosConfig,
      }
    );
    // Nếu trả về response dạng object có field response/message thì lấy, không thì trả về toàn bộ
    return res.data.response || res.data.message || res.data;
  } catch (err) {
    logger.error(`AI API Error [${endpoint}]:`, err.message);
    if (err.response) {
      logger.error('AI API Response Error:', {
        status: err.response.status,
        data: err.response.data,
      });
    }
    throw err;
  }
}

/**
 * Hàm tổng quát gọi endpoint FastAPI dạng stream
 */
async function callFastAPIStream(endpoint, payload, onChunk, options = {}) {
  try {
    const response = await axios.post(
      `${FASTAPI_URL}${endpoint}`,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'stream',
        timeout: options.timeout || 60000,
        ...options.axiosConfig,
      }
    );

    return new Promise((resolve, reject) => {
      let buffer = '';

      response.data.on('data', (chunk) => {
        buffer += chunk.toString();

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                onChunk(data.content);
              }
              if (data.done) {
                resolve();
                return;
              }
            } catch (e) {
              logger.warn('Failed to parse streaming data:', line);
            }
          }
        }
      });

      response.data.on('end', () => {
        resolve();
      });

      response.data.on('error', (err) => {
        logger.error('Stream error:', err);
        reject(err);
      });
    });

  } catch (err) {
    logger.error(`AI Streaming API Error [${endpoint}]:`, err.message);
    onChunk('Sorry, I am having technical issues. Please try again later.');
    throw err;
  }
}

/**
 * Wrapper cho các API cụ thể (dễ mở rộng)
 */
async function callChatAPI(payload) {
  return callFastAPI('/chatbot/chat_response', payload);
}

async function callChatAPIStream(payload, onChunk) {
  return callFastAPIStream('/chatbot/chat_stream', payload, onChunk);
}

async function callPlanAPI(payload) {
  return callFastAPI('/learning/planning_response', payload);
}

async function callSummaryAPI(payload) {
  return callFastAPI('/chatbot/summary', payload);
}

async function callFeedbackAPI(payload) {
  return callFastAPI('/chatbot/feedback', payload);
}

/**
 * Lấy danh sách model từ FastAPI
 */
async function getAvailableModels() {
  try {
    const res = await axios.get(`${FASTAPI_URL}/models`);
    return res.data;
  } catch (err) {
    logger.error('Error fetching models:', err.message);
    return { models: ['default'] };
  }
}

module.exports = {
  callFastAPI,
  callFastAPIStream,
  callChatAPI,
  callChatAPIStream,
  callPlanAPI,
  callSummaryAPI,
  callFeedbackAPI,
  getAvailableModels,
};