const { Proxy } = require('../models');

/**
 * Create new proxy
 */
const createProxy = async (req, res) => {
  try {
    const { name, protocol, host, port, username, password, tags, location } = req.body;

    // Check for duplicate
    const existing = await Proxy.findOne({
      userId: req.user.id,
      host,
      port,
      protocol
    });

    if (existing) {
      return res.status(409).json({
        error: 'Proxy already exists with this configuration'
      });
    }

    const proxy = new Proxy({
      userId: req.user.id,
      name,
      protocol,
      host,
      port,
      username,
      password,
      tags: tags || [],
      location: location || {}
    });

    await proxy.save();

    res.status(201).json({
      message: 'Proxy created successfully',
      proxy: proxy.toJSON()
    });
  } catch (error) {
    console.error('Create proxy error:', error);
    res.status(500).json({
      error: 'Failed to create proxy',
      message: error.message
    });
  }
};

/**
 * Get user proxies
 */
const getProxies = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, isActive } = req.query;
    const skip = (page - 1) * limit;

    let query = { userId: req.user.id };

    if (status) query.status = status;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const proxies = await Proxy.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Proxy.countDocuments(query);

    res.status(200).json({
      proxies,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get proxies error:', error);
    res.status(500).json({
      error: 'Failed to fetch proxies',
      message: error.message
    });
  }
};

/**
 * Get single proxy
 */
const getProxy = async (req, res) => {
  try {
    const { proxyId } = req.params;

    const proxy = await Proxy.findOne({
      _id: proxyId,
      userId: req.user.id
    }).select('-password');

    if (!proxy) {
      return res.status(404).json({
        error: 'Proxy not found'
      });
    }

    res.status(200).json({
      proxy
    });
  } catch (error) {
    console.error('Get proxy error:', error);
    res.status(500).json({
      error: 'Failed to fetch proxy',
      message: error.message
    });
  }
};

/**
 * Update proxy
 */
const updateProxy = async (req, res) => {
  try {
    const { proxyId } = req.params;
    const { name, protocol, host, port, username, password, tags, location, isActive } = req.body;

    let proxy = await Proxy.findOne({
      _id: proxyId,
      userId: req.user.id
    });

    if (!proxy) {
      return res.status(404).json({
        error: 'Proxy not found'
      });
    }

    // Update fields
    if (name !== undefined) proxy.name = name;
    if (protocol !== undefined) proxy.protocol = protocol;
    if (host !== undefined) proxy.host = host;
    if (port !== undefined) proxy.port = port;
    if (username !== undefined) proxy.username = username;
    if (password !== undefined) proxy.password = password;
    if (tags !== undefined) proxy.tags = tags;
    if (location !== undefined) proxy.location = { ...proxy.location, ...location };
    if (isActive !== undefined) proxy.isActive = isActive;

    await proxy.save();

    res.status(200).json({
      message: 'Proxy updated successfully',
      proxy: proxy.toJSON()
    });
  } catch (error) {
    console.error('Update proxy error:', error);
    res.status(500).json({
      error: 'Failed to update proxy',
      message: error.message
    });
  }
};

/**
 * Delete proxy
 */
const deleteProxy = async (req, res) => {
  try {
    const { proxyId } = req.params;

    const proxy = await Proxy.findOneAndDelete({
      _id: proxyId,
      userId: req.user.id
    });

    if (!proxy) {
      return res.status(404).json({
        error: 'Proxy not found'
      });
    }

    res.status(200).json({
      message: 'Proxy deleted successfully'
    });
  } catch (error) {
    console.error('Delete proxy error:', error);
    res.status(500).json({
      error: 'Failed to delete proxy',
      message: error.message
    });
  }
};

/**
 * Verify proxy connectivity (simulation)
 */
const verifyProxy = async (req, res) => {
  try {
    const { proxyId } = req.params;

    let proxy = await Proxy.findOne({
      _id: proxyId,
      userId: req.user.id
    });

    if (!proxy) {
      return res.status(404).json({
        error: 'Proxy not found'
      });
    }

    // Simulate proxy verification
    const isVerified = Math.random() > 0.3; // 70% success rate
    
    proxy.lastVerified = new Date();
    proxy.status = isVerified ? 'verified' : 'failed';
    
    if (!isVerified) {
      proxy.failureCount += 1;
    } else {
      proxy.failureCount = 0;
    }

    await proxy.save();

    res.status(200).json({
      message: isVerified ? 'Proxy verified' : 'Proxy verification failed',
      proxy: proxy.toJSON(),
      verified: isVerified
    });
  } catch (error) {
    console.error('Verify proxy error:', error);
    res.status(500).json({
      error: 'Failed to verify proxy',
      message: error.message
    });
  }
};

/**
 * Bulk update proxy status
 */
const bulkUpdateStatus = async (req, res) => {
  try {
    const { proxyIds, status } = req.body;

    if (!Array.isArray(proxyIds) || proxyIds.length === 0) {
      return res.status(400).json({
        error: 'proxyIds array is required'
      });
    }

    const result = await Proxy.updateMany(
      {
        _id: { $in: proxyIds },
        userId: req.user.id
      },
      { isActive: status }
    );

    res.status(200).json({
      message: 'Proxies updated',
      updated: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk update status error:', error);
    res.status(500).json({
      error: 'Failed to update proxies',
      message: error.message
    });
  }
};

module.exports = {
  createProxy,
  getProxies,
  getProxy,
  updateProxy,
  deleteProxy,
  verifyProxy,
  bulkUpdateStatus
};
