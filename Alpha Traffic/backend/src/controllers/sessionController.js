const { Session, Proxy } = require('../models');

/**
 * Create new session
 */
const createSession = async (req, res) => {
  try {
    const { name, proxyId, sessionType, config, notes } = req.body;

    const session = new Session({
      userId: req.user.id,
      name,
      proxyId: proxyId || null,
      sessionType: sessionType || 'manual',
      config: config || {},
      notes: notes || ''
    });

    await session.save();

    res.status(201).json({
      message: 'Session created',
      session
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      error: 'Failed to create session',
      message: error.message
    });
  }
};

/**
 * Get user sessions
 */
const getSessions = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;

    let query = { userId: req.user.id };

    if (status) query.status = status;

    const sessions = await Session.find(query)
      .populate('proxyId', 'name host port protocol')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Session.countDocuments(query);

    res.status(200).json({
      sessions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      error: 'Failed to fetch sessions',
      message: error.message
    });
  }
};

/**
 * Get single session
 */
const getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOne({
      _id: sessionId,
      userId: req.user.id
    }).populate('proxyId');

    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    res.status(200).json({
      session
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      error: 'Failed to fetch session',
      message: error.message
    });
  }
};

/**
 * Start session
 */
const startSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    let session = await Session.findOne({
      _id: sessionId,
      userId: req.user.id
    });

    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    if (session.status === 'active') {
      return res.status(400).json({
        error: 'Session already active'
      });
    }

    session.status = 'active';
    session.startedAt = new Date();
    session.actionCount = 0;
    session.successCount = 0;
    session.failureCount = 0;

    await session.save();

    res.status(200).json({
      message: 'Session started',
      session
    });
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({
      error: 'Failed to start session',
      message: error.message
    });
  }
};

/**
 * End session
 */
const endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    let session = await Session.findOne({
      _id: sessionId,
      userId: req.user.id
    });

    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    session.status = 'completed';
    session.endedAt = new Date();

    await session.save();

    res.status(200).json({
      message: 'Session ended',
      session
    });
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({
      error: 'Failed to end session',
      message: error.message
    });
  }
};

/**
 * Pause session
 */
const pauseSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    let session = await Session.findOne({
      _id: sessionId,
      userId: req.user.id
    });

    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    if (session.status !== 'active') {
      return res.status(400).json({
        error: 'Only active sessions can be paused'
      });
    }

    session.status = 'paused';
    session.pausedAt = new Date();

    await session.save();

    res.status(200).json({
      message: 'Session paused',
      session
    });
  } catch (error) {
    console.error('Pause session error:', error);
    res.status(500).json({
      error: 'Failed to pause session',
      message: error.message
    });
  }
};

/**
 * Resume session
 */
const resumeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    let session = await Session.findOne({
      _id: sessionId,
      userId: req.user.id
    });

    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    if (session.status !== 'paused') {
      return res.status(400).json({
        error: 'Only paused sessions can be resumed'
      });
    }

    session.status = 'active';
    session.resumedAt = new Date();

    await session.save();

    res.status(200).json({
      message: 'Session resumed',
      session
    });
  } catch (error) {
    console.error('Resume session error:', error);
    res.status(500).json({
      error: 'Failed to resume session',
      message: error.message
    });
  }
};

/**
 * Add action to session
 */
const addAction = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { type, result, status } = req.body;

    let session = await Session.findOne({
      _id: sessionId,
      userId: req.user.id
    });

    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    const action = {
      id: `action_${Date.now()}`,
      type,
      timestamp: new Date(),
      status: status || 'pending',
      result: result || {}
    };

    session.actions.push(action);
    session.actionCount += 1;

    if (status === 'success') {
      session.successCount += 1;
    } else if (status === 'failed') {
      session.failureCount += 1;
    }

    await session.save();

    res.status(201).json({
      message: 'Action added',
      action,
      session
    });
  } catch (error) {
    console.error('Add action error:', error);
    res.status(500).json({
      error: 'Failed to add action',
      message: error.message
    });
  }
};

/**
 * Update session
 */
const updateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { name, config, notes } = req.body;

    let session = await Session.findOne({
      _id: sessionId,
      userId: req.user.id
    });

    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    if (name !== undefined) session.name = name;
    if (config !== undefined) session.config = { ...session.config, ...config };
    if (notes !== undefined) session.notes = notes;

    await session.save();

    res.status(200).json({
      message: 'Session updated',
      session
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      error: 'Failed to update session',
      message: error.message
    });
  }
};

/**
 * Delete session
 */
const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOneAndDelete({
      _id: sessionId,
      userId: req.user.id
    });

    if (!session) {
      return res.status(404).json({
        error: 'Session not found'
      });
    }

    res.status(200).json({
      message: 'Session deleted'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      error: 'Failed to delete session',
      message: error.message
    });
  }
};

module.exports = {
  createSession,
  getSessions,
  getSession,
  startSession,
  endSession,
  pauseSession,
  resumeSession,
  addAction,
  updateSession,
  deleteSession
};
