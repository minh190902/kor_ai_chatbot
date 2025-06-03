// src/middleware/cors.js
const cors = require('cors');

module.exports = function () {
  // Cấu hình CORS tùy chỉnh nếu cần
  return cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });
};
