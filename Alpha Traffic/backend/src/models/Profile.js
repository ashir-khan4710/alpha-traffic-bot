const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
      unique: true
    },
    bio: {
      type: String,
      default: '',
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    company: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    website: {
      type: String,
      default: ''
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'auto'
      },
      emailNotifications: {
        type: Boolean,
        default: true
      },
      pushNotifications: {
        type: Boolean,
        default: true
      },
      dataRetention: {
        type: Number,
        default: 90, // days
        min: 7,
        max: 365
      }
    },
    sessionLimit: {
      type: Number,
      default: 5,
      min: 1,
      max: 50
    },
    proxyLimit: {
      type: Number,
      default: 10,
      min: 1,
      max: 1000
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'trial', 'premium'],
      default: 'active',
      index: true
    },
    subscriptionExpiry: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for queries
profileSchema.index({ userId: 1, accountStatus: 1 });

module.exports = mongoose.model('Profile', profileSchema);
