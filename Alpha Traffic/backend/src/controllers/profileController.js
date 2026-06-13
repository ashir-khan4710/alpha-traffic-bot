const { Profile, User } = require('../models');

/**
 * Get user profile
 */
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id })
      .populate('userId', 'email username firstName lastName profilePicture');

    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found'
      });
    }

    res.status(200).json({
      profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to fetch profile',
      message: error.message
    });
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
  try {
    const {
      bio,
      company,
      location,
      website,
      preferences,
      sessionLimit,
      proxyLimit
    } = req.body;

    let profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found'
      });
    }

    // Update only provided fields
    if (bio !== undefined) profile.bio = bio;
    if (company !== undefined) profile.company = company;
    if (location !== undefined) profile.location = location;
    if (website !== undefined) profile.website = website;
    if (preferences !== undefined) {
      profile.preferences = { ...profile.preferences, ...preferences };
    }
    if (sessionLimit !== undefined) profile.sessionLimit = sessionLimit;
    if (proxyLimit !== undefined) profile.proxyLimit = proxyLimit;

    await profile.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: error.message
    });
  }
};

/**
 * Get all profiles (admin only)
 */
const getAllProfiles = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) {
      query.accountStatus = status;
    }

    const profiles = await Profile.find(query)
      .populate('userId', 'email username firstName lastName')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Profile.countDocuments(query);

    res.status(200).json({
      profiles,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all profiles error:', error);
    res.status(500).json({
      error: 'Failed to fetch profiles',
      message: error.message
    });
  }
};

/**
 * Update profile preferences
 */
const updatePreferences = async (req, res) => {
  try {
    const { theme, emailNotifications, pushNotifications, dataRetention } = req.body;

    let profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found'
      });
    }

    if (theme !== undefined) profile.preferences.theme = theme;
    if (emailNotifications !== undefined) profile.preferences.emailNotifications = emailNotifications;
    if (pushNotifications !== undefined) profile.preferences.pushNotifications = pushNotifications;
    if (dataRetention !== undefined) profile.preferences.dataRetention = dataRetention;

    await profile.save();

    res.status(200).json({
      message: 'Preferences updated',
      preferences: profile.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      error: 'Failed to update preferences',
      message: error.message
    });
  }
};

/**
 * Update account status (admin only)
 */
const updateAccountStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { accountStatus, subscriptionExpiry } = req.body;

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found'
      });
    }

    profile.accountStatus = accountStatus;
    if (subscriptionExpiry) {
      profile.subscriptionExpiry = new Date(subscriptionExpiry);
    }

    await profile.save();

    res.status(200).json({
      message: 'Account status updated',
      profile
    });
  } catch (error) {
    console.error('Update account status error:', error);
    res.status(500).json({
      error: 'Failed to update account status',
      message: error.message
    });
  }
};

/**
 * Delete profile (admin only)
 */
const deleteProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await Profile.findOneAndDelete({ userId });

    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found'
      });
    }

    res.status(200).json({
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({
      error: 'Failed to delete profile',
      message: error.message
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllProfiles,
  updatePreferences,
  updateAccountStatus,
  deleteProfile
};
