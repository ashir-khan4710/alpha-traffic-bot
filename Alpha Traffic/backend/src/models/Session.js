const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    proxyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proxy',
      default: null,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Session name is required'],
      maxlength: [100, 'Session name cannot exceed 100 characters']
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'paused', 'completed', 'failed', 'idle'],
      default: 'pending',
      index: true
    },
    startedAt: {
      type: Date,
      default: null
    },
    endedAt: {
      type: Date,
      default: null
    },
    pausedAt: {
      type: Date,
      default: null
    },
    resumedAt: {
      type: Date,
      default: null
    },
    sessionType: {
      type: String,
      enum: ['manual', 'scheduled', 'automated'],
      default: 'manual'
    },
    actionCount: {
      type: Number,
      default: 0,
      min: 0
    },
    successCount: {
      type: Number,
      default: 0,
      min: 0
    },
    failureCount: {
      type: Number,
      default: 0,
      min: 0
    },
    totalDuration: {
      type: Number,
      default: 0 // milliseconds
    },
    actions: [
      {
        id: String,
        type: String,
        timestamp: Date,
        status: {
          type: String,
          enum: ['pending', 'success', 'failed']
        },
        result: mongoose.Schema.Types.Mixed
      }
    ],
    performance: {
      avgActionTime: {
        type: Number,
        default: 0
      },
      successRate: {
        type: Number,
        default: 0
      }
    },
    config: {
      maxRetries: {
        type: Number,
        default: 3
      },
      timeout: {
        type: Number,
        default: 30000 // milliseconds
      },
      parallel: {
        type: Boolean,
        default: false
      }
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Calculate duration on save if session is ended
sessionSchema.pre('save', function (next) {
  if (this.startedAt && this.endedAt) {
    this.totalDuration = this.endedAt - this.startedAt;
  }

  if (this.actionCount > 0) {
    this.performance.successRate = (this.successCount / this.actionCount) * 100;
    this.performance.avgActionTime = this.totalDuration / this.actionCount;
  }

  next();
});

// Compound indexes
sessionSchema.index({ userId: 1, status: 1, createdAt: -1 });
sessionSchema.index({ userId: 1, proxyId: 1, startedAt: -1 });

module.exports = mongoose.model('Session', sessionSchema);
