// src/middleware/rateLimiter.js
// Dùng express-rate-limit làm ví dụ
const rateLimit = require('express-rate-limit');

module.exports = function () {
  return rateLimit({
    windowMs: 1 * 60 * 1000, // 1 phút
    max: 100, // cho phép 100 request mỗi IP
    message: 'Quá nhiều yêu cầu từ IP này, hãy thử lại sau 1 phút.'
  });
};
