const cors = require('cors');

module.exports = function () {
  // Configure CORS middleware
  return cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });
};
