const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const config = require('./config');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profiles');
const proxyRoutes = require('./routes/proxies');
const logRoutes = require('./routes/logs');
const sessionRoutes = require('./routes/sessions');
const realtimeRoutes = require('./routes/realtime');

// Initialize Express app
const app = express();

// ==================== MIDDLEWARE ====================

// Logging middleware
app.use(morgan('combined'));

// CORS middleware
app.use(cors(config.cors));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const { connectDB: db } = require('./config/database');
  const dbStatus = require('./config/database').getConnectionStatus();
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.server.env,
    database: dbStatus
  });
});

// ==================== ROUTES ====================

// Auth routes
app.use('/api/auth', authRoutes);

// Profile routes
app.use('/api/profiles', profileRoutes);

// Proxy routes
app.use('/api/proxies', proxyRoutes);

// Log routes
app.use('/api/logs', logRoutes);

// Session routes
app.use('/api/sessions', sessionRoutes);

// Real-time routes
app.use('/api/realtime', realtimeRoutes);

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
