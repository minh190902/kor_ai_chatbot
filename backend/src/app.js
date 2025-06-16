const express = require('express');
const corsMiddleware = require('./middleware/cors');
const rateLimiter = require('./middleware/rateLimiter');
const authMiddleware = require('./middleware/auth');
const routes = require('./routes');
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(corsMiddleware());
app.use(express.json());
app.use(rateLimiter());
// app.use(authMiddleware()); // turn on when auth is ready

// Health-check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// setup routes
app.use('/api', routes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = {
  getApp: () => app,
};
