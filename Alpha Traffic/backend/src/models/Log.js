const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      default: null,
      index: true
    },
    proxyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proxy',
      default: null,
      index: true
    },
    type: {
      type: String,
      enum: [
        'session_start',
        'session_end',
        'action_executed',
        'proxy_used',
        'error',
        'warning',
        'info',
        'success'
      ],
      required: true,
      index: true
    },
    level: {
      type: String,
      enum: ['debug', 'info', 'warn', 'error', 'critical'],
      default: 'info',
      index: true
    },
    message: {
      type: String,
      required: [true, 'Log message is required']
    },
    description: {
      type: String,
      default: ''
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    statusCode: {
      type: Number,
      default: null
    },
    duration: {
      type: Number,
      default: null // milliseconds
    },
    ipAddress: {
      type: String,
      default: null
    },
    userAgent: {
      type: String,
      default: null
    },
    error: {
      message: String,
      stack: String
    }
  },
  {
    timestamps: true,
    expireAfterSeconds: 2592000 // 30 days TTL
  }
);

// Indexes for efficient querying
logSchema.index({ userId: 1, createdAt: -1 });
logSchema.index({ sessionId: 1, createdAt: -1 });
logSchema.index({ type: 1, level: 1, createdAt: -1 });
logSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model('Log', logSchema);
