// server.js
require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await app.loadData(); // đảm bảo dữ liệu đã được load trước khi listen
    app.getApp().listen(PORT, () => {
      logger.info(`🚀 AI Chat Backend running on port ${PORT}`);
      logger.info(`📡 AI API URL: ${process.env.AI_API_URL}`);
      logger.info(`💾 Data stored in directory: ./data`);
      logger.info(`🌐 Frontend should kết nối tới: http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Bắt tín hiệu để shutdown một cách graceful
process.on('SIGINT', async () => {
  logger.info('🛑 Shutting down gracefully (SIGINT)...');
  await app.saveData();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('🛑 Shutting down gracefully (SIGTERM)...');
  await app.saveData();
  process.exit(0);
});

startServer();
