const mongoose = require('mongoose');

const proxySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    name: {
      type: String,
      required: [true, 'Proxy name is required'],
      maxlength: [100, 'Proxy name cannot exceed 100 characters']
    },
    protocol: {
      type: String,
      enum: ['http', 'https', 'socks5'],
      required: [true, 'Protocol is required']
    },
    host: {
      type: String,
      required: [true, 'Host is required'],
      index: true
    },
    port: {
      type: Number,
      required: [true, 'Port is required'],
      min: 1,
      max: 65535
    },
    username: {
      type: String,
      default: null
    },
    password: {
      type: String,
      default: null,
      select: false
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    status: {
      type: String,
      enum: ['verified', 'pending', 'failed', 'inactive'],
      default: 'pending',
      index: true
    },
    lastVerified: {
      type: Date,
      default: null
    },
    failureCount: {
      type: Number,
      default: 0
    },
    tags: [
      {
        type: String,
        default: []
      }
    ],
    location: {
      country: String,
      city: String,
      timezone: String
    },
    performance: {
      successRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      avgResponseTime: {
        type: Number,
        default: 0 // milliseconds
      },
      totalRequests: {
        type: Number,
        default: 0
      }
    }
  },
  {
    timestamps: true
  }
);

// Compound index for user proxies
proxySchema.index({ userId: 1, isActive: 1, status: 1 });

// Hide password on JSON
proxySchema.methods.toJSON = function () {
  const obj = this.toObject();
  if (obj.password) {
    delete obj.password;
  }
  return obj;
};

module.exports = mongoose.model('Proxy', proxySchema);
