const { Session, Log, Proxy } = require('../models');
const { emitToUser, emitSessionEvent, emitMetricsUpdate } = require('../utils/eventEmitter');

/**
 * Get real-time dashboard statistics
 */
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const activeSessions = await Session.countDocuments({
      userId,
      status: 'active'
    });

    const totalSessions = await Session.countDocuments({ userId });

    const totalProxies = await Proxy.countDocuments({ userId });

    const verifiedProxies = await Proxy.countDocuments({
      userId,
      status: 'verified'
    });

    // Calculate overall success rate from completed sessions
    const completedSessions = await Session.find({
      userId,
      status: 'completed'
    }).select('actionCount successCount');

    let totalActions = 0;
    let totalSuccessful = 0;

    completedSessions.forEach(session => {
      totalActions += session.actionCount;
      totalSuccessful += session.successCount;
    });

    const successRate = totalActions > 0 ? (totalSuccessful / totalActions * 100).toFixed(2) : 0;

    const stats = {
      activeSessions,
      totalSessions,
      totalProxies,
      verifiedProxies,
      successRate,
      timestamp: new Date()
    };

    // Emit to user via Socket.io
    emitToUser(req, userId, 'dashboard:stats', stats);

    res.status(200).json({ stats });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard stats',
      message: error.message
    });
  }
};

/**
 * Get session real-time updates
 */
const getSessionUpdates = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const session = await Session.findOne({
      _id: sessionId,
      userId
    });

    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    const update = {
      sessionId,
      status: session.status,
      actionCount: session.actionCount,
      successCount: session.successCount,
      failureCount: session.failureCount,
      successRate: session.performance.successRate,
      avgActionTime: session.performance.avgActionTime,
      totalDuration: session.totalDuration,
      actions: session.actions.slice(-10) // Last 10 actions
    };

    // Emit to user via Socket.io
    emitSessionEvent(req, userId, sessionId, 'session:update', update);

    res.status(200).json({ update });
  } catch (error) {
    console.error('Get session updates error:', error);
    res.status(500).json({
      error: 'Failed to fetch session updates',
      message: error.message
    });
  }
};

/**
 * Get recent logs for live stream
 */
const getRecentLogs = async (req, res) => {
  try {
    const { sessionId } = req.query;
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;

    let query = { userId };
    if (sessionId) {
      query.sessionId = sessionId;
    }

    const logs = await Log.find(query)
      .select('-__v')
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      logs: logs.reverse()
    });
  } catch (error) {
    console.error('Get recent logs error:', error);
    res.status(500).json({
      error: 'Failed to fetch logs',
      message: error.message
    });
  }
};

/**
 * Get proxy metrics
 */
const getProxyMetrics = async (req, res) => {
  try {
    const userId = req.user.id;

    const proxies = await Proxy.find({ userId })
      .select('name status isActive performance lastVerified failureCount')
      .sort({ 'performance.successRate': -1 })
      .limit(10);

    const metrics = {
      proxyCount: proxies.length,
      proxies: proxies.map(p => ({
        id: p._id,
        name: p.name,
        status: p.status,
        isActive: p.isActive,
        successRate: p.performance.successRate,
        avgResponseTime: p.performance.avgResponseTime,
        totalRequests: p.performance.totalRequests,
        failureCount: p.failureCount,
        lastVerified: p.lastVerified
      }))
    };

    emitToUser(req, userId, 'proxy:metrics', metrics);

    res.status(200).json({ metrics });
  } catch (error) {
    console.error('Get proxy metrics error:', error);
    res.status(500).json({
      error: 'Failed to fetch proxy metrics',
      message: error.message
    });
  }
};

/**
 * Trigger metrics update broadcast
 */
const broadcastMetrics = async (req, res) => {
  try {
    const userId = req.user.id;

    const activeSessions = await Session.countDocuments({
      userId,
      status: 'active'
    });

    const activeLogs = await Log.countDocuments({
      userId,
      createdAt: { $gte: new Date(Date.now() - 60000) } // Last minute
    });

    const metricsData = {
      activeSessions,
      activeLogs,
      cpuUsage: Math.floor(Math.random() * 100),
      memoryUsage: Math.floor(Math.random() * 100),
      timestamp: new Date()
    };

    emitMetricsUpdate(req, userId, metricsData);

    res.status(200).json({
      message: 'Metrics broadcasted',
      metrics: metricsData
    });
  } catch (error) {
    console.error('Broadcast metrics error:', error);
    res.status(500).json({
      error: 'Failed to broadcast metrics',
      message: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getSessionUpdates,
  getRecentLogs,
  getProxyMetrics,
  broadcastMetrics
};
