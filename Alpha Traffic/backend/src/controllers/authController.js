const { User, Profile } = require('../models');
const { generateToken, generateRefreshToken, verifyToken } = require('../utils/jwt');

/**
 * Register new user
 */
const register = async (req, res) => {
  try {
    const { email, username, password, firstName, lastName } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        field: existingUser.email === email ? 'email' : 'username'
      });
    }

    // Create user
    const user = new User({
      email,
      username,
      password,
      firstName,
      lastName
    });

    await user.save();

    // Create profile
    await Profile.create({
      userId: user._id
    });

    // Generate tokens
    const token = generateToken(user._id, user.email);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(),
      token,
      refreshToken
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error.message
    });
  }
};

/**
 * Login user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const token = generateToken(user._id, user.email);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      user: user.toJSON(),
      token,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
};

/**
 * Refresh token
 */
const refreshTokenHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Refresh token is required'
      });
    }

    const decoded = verifyToken(refreshToken);

    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        error: 'Invalid refresh token'
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Generate new token
    const newToken = generateToken(user._id, user.email);

    res.status(200).json({
      message: 'Token refreshed',
      token: newToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      error: 'Token refresh failed',
      message: error.message
    });
  }
};

/**
 * Get current user
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.status(200).json({
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      message: error.message
    });
  }
};

/**
 * Logout user
 */
const logout = (req, res) => {
  // In a real implementation, add token to blacklist/invalidate in DB
  res.status(200).json({
    message: 'Logout successful'
  });
};

module.exports = {
  register,
  login,
  refreshTokenHandler,
  getCurrentUser,
  logout
};
