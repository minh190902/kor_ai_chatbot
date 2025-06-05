// Dùng express-rate-limit làm ví dụ
const rateLimit = require('express-rate-limit');

module.exports = function () {
  return rateLimit({
    windowMs: 1 * 60 * 1000, // 1 min
    max: 100, // allow 100 requests per IP
    message: 'So many request from this IP. Please try again after a minute'
  });
};
