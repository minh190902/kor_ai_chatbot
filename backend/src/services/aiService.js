const axios = require('axios');
const logger = require('../utils/logger');

const FASTAPI_URL = process.env.AI_API_URL || 'http://localhost:8080';
const CHAT_ENDPOINT = '/chatbot/chat_response';
const CHAT_STREAM_ENDPOINT = '/chatbot/chat_stream';

/**
 * Call FastAPI chat (non-streaming)
 */
async function callChatAPI({ user_id, session_id, message, language, history }) {
  try {
    const payload = {
      user_id,
      session_id,
      message,
      language,
      history,
    };
    const res = await axios.post(
      `${FASTAPI_URL}${CHAT_ENDPOINT}`,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      }
    );
    return res.data.response || res.data.message || res.data;
  } catch (err) {
    logger.error('AI API Error:', err.message);
    if (err.response) {
      logger.error('AI API Response Error:', {
        status: err.response.status,
        data: err.response.data,
      });
    }
    return 'Sorry, I am having technical issues. Please try again later.';
  }
}

/**
 * Call FastAPI chat (streaming)
 */
async function callChatAPIStream({ user_id, session_id, message, language, history }, onChunk) {
  try {
    const payload = {
      user_id,
      session_id,
      message,
      language,
      history,
    };

    const response = await axios.post(
      `${FASTAPI_URL}${CHAT_STREAM_ENDPOINT}`,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'stream',
        timeout: 60000,
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
    logger.error('AI Streaming API Error:', err.message);
    // Fallback
    onChunk('Sorry, I am having technical issues. Please try again later.');
    throw err;
  }
}

/**
 * Get model list from FastAPI
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
  callChatAPI,
  callChatAPIStream,
  getAvailableModels,
};