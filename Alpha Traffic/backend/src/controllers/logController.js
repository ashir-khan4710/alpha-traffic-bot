const { Log } = require('../models');

/**
 * Create log entry
 */
const createLog = async (req, res) => {
  try {
    const { type, level, message, description, metadata, statusCode, duration, sessionId, proxyId } = req.body;

    const log = new Log({
      userId: req.user.id,
      type,
      level: level || 'info',
      message,
      description: description || '',
      metadata: metadata || {},
      statusCode,
      duration,
      sessionId,
      proxyId,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    await log.save();

    res.status(201).json({
      message: 'Log created',
      log
    });
  } catch (error) {
    console.error('Create log error:', error);
    res.status(500).json({
      error: 'Failed to create log',
      message: error.message
    });
  }
};

/**
 * Get user logs
 */
const getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, type, level, sessionId } = req.query;
    const skip = (page - 1) * limit;

    let query = { userId: req.user.id };

    if (type) query.type = type;
    if (level) query.level = level;
    if (sessionId) query.sessionId = sessionId;

    const logs = await Log.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Log.countDocuments(query);

    res.status(200).json({
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({
      error: 'Failed to fetch logs',
      message: error.message
    });
  }
};

/**
 * Get single log
 */
const getLog = async (req, res) => {
  try {
    const { logId } = req.params;

    const log = await Log.findOne({
      _id: logId,
      userId: req.user.id
    });

    if (!log) {
      return res.status(404).json({
        error: 'Log not found'
      });
    }

    res.status(200).json({
      log
    });
  } catch (error) {
    console.error('Get log error:', error);
    res.status(500).json({
      error: 'Failed to fetch log',
      message: error.message
    });
  }
};

/**
 * Get session logs
 */
const getSessionLogs = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const logs = await Log.find({
      userId: req.user.id,
      sessionId
    })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Log.countDocuments({
      userId: req.user.id,
      sessionId
    });

    res.status(200).json({
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get session logs error:', error);
    res.status(500).json({
      error: 'Failed to fetch session logs',
      message: error.message
    });
  }
};

/**
 * Get statistics
 */
const getStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateQuery = { userId: req.user.id };

    if (startDate || endDate) {
      dateQuery.createdAt = {};
      if (startDate) dateQuery.createdAt.$gte = new Date(startDate);
      if (endDate) dateQuery.createdAt.$lte = new Date(endDate);
    }

    const stats = await Log.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgDuration: { $avg: '$duration' }
        }
      }
    ]);

    const levelStats = await Log.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      typeStatistics: stats,
      levelStatistics: levelStats
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
};

/**
 * Delete old logs (cleanup)
 */
const deleteOldLogs = async (req, res) => {
  try {
    const { daysOld = 30 } = req.body;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await Log.deleteMany({
      userId: req.user.id,
      createdAt: { $lt: cutoffDate }
    });

    res.status(200).json({
      message: `Deleted ${result.deletedCount} old logs`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Delete old logs error:', error);
    res.status(500).json({
      error: 'Failed to delete logs',
      message: error.message
    });
  }
};

/**
 * Clear all logs for session (admin action)
 */
const clearSessionLogs = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const result = await Log.deleteMany({
      userId: req.user.id,
      sessionId
    });

    res.status(200).json({
      message: 'Session logs cleared',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Clear session logs error:', error);
    res.status(500).json({
      error: 'Failed to clear session logs',
      message: error.message
    });
  }
};

module.exports = {
  createLog,
  getLogs,
  getLog,
  getSessionLogs,
  getStatistics,
  deleteOldLogs,
  clearSessionLogs
};
