// src/app.js
const express = require('express');
const corsMiddleware = require('./middleware/cors');
const rateLimiter = require('./middleware/rateLimiter');
const authMiddleware = require('./middleware/auth');
const routes = require('./routes/chat');
const storageService = require('./services/storageService');
const logger = require('./utils/logger');

const app = express();

// Middleware toàn cục
app.use(corsMiddleware());
app.use(express.json());
app.use(rateLimiter());    // Ví dụ: giới hạn tần suất request
// app.use(authMiddleware()); // Bật nếu cần xác thực chung

// Health-check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Đăng ký toàn bộ route
app.use('/api', routes);

app.listen(8000, () => {
  console.log('Server running on port 8000');
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware (cuối cùng)
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = {
  getApp: () => app,
  loadData: storageService.loadData,   // gọi load file JSON vào memory
  saveData: storageService.saveData,   // gọi save JSON khi shutdown
};
