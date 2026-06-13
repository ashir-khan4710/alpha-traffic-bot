const socketIO = require('socket.io');
const { verifyToken } = require('../utils/jwt');

/**
 * Initialize Socket.io
 */
const initializeSocket = (server, config) => {
  const io = socketIO(server, {
    cors: config.cors,
    transports: ['websocket', 'polling']
  });

  // Middleware to verify token on connection
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = verifyToken(token);
      socket.userId = decoded.id;
      socket.userEmail = decoded.email;
      next();
    } catch (error) {
      next(new Error('Invalid or expired token'));
    }
  });

  // Connection event
  io.on('connection', (socket) => {
    console.log(`[Socket.io] User connected: ${socket.userId} (${socket.id})`);

    // Join user room
    socket.join(`user:${socket.userId}`);

    // Send connection confirmation
    socket.emit('connected', {
      message: 'Connected to real-time server',
      userId: socket.userId,
      timestamp: new Date()
    });

    // ==================== SESSION EVENTS ====================

    /**
     * Session started
     */
    socket.on('session:start', (data) => {
      console.log(`[Session] Started: ${data.sessionId}`);

      io.to(`user:${socket.userId}`).emit('session:started', {
        sessionId: data.sessionId,
        name: data.sessionName,
        status: 'active',
        startedAt: new Date(),
        timestamp: new Date()
      });
    });

    /**
     * Session ended
     */
    socket.on('session:end', (data) => {
      console.log(`[Session] Ended: ${data.sessionId}`);

      io.to(`user:${socket.userId}`).emit('session:ended', {
        sessionId: data.sessionId,
        status: 'completed',
        endedAt: new Date(),
        summary: data.summary,
        timestamp: new Date()
      });
    });

    /**
     * Session action executed
     */
    socket.on('session:action', (data) => {
      console.log(`[Session] Action: ${data.actionType} - ${data.actionId}`);

      io.to(`user:${socket.userId}`).emit('session:action_executed', {
        sessionId: data.sessionId,
        actionId: data.actionId,
        actionType: data.actionType,
        status: data.status,
        result: data.result,
        timestamp: new Date()
      });
    });

    /**
     * Session paused
     */
    socket.on('session:pause', (data) => {
      console.log(`[Session] Paused: ${data.sessionId}`);

      io.to(`user:${socket.userId}`).emit('session:paused', {
        sessionId: data.sessionId,
        status: 'paused',
        timestamp: new Date()
      });
    });

    /**
     * Session resumed
     */
    socket.on('session:resume', (data) => {
      console.log(`[Session] Resumed: ${data.sessionId}`);

      io.to(`user:${socket.userId}`).emit('session:resumed', {
        sessionId: data.sessionId,
        status: 'active',
        timestamp: new Date()
      });
    });

    // ==================== LOG EVENTS ====================

    /**
     * Log entry created
     */
    socket.on('log:create', (data) => {
      const logData = {
        logId: data.logId,
        type: data.type,
        level: data.level,
        message: data.message,
        sessionId: data.sessionId,
        timestamp: new Date()
      };

      io.to(`user:${socket.userId}`).emit('log:new', logData);
    });

    /**
     * Live log stream
     */
    socket.on('logs:subscribe', (data) => {
      const logRoom = `logs:${data.sessionId || socket.userId}`;
      socket.join(logRoom);

      socket.emit('logs:subscribed', {
        message: 'Subscribed to log stream',
        room: logRoom,
        timestamp: new Date()
      });
    });

    socket.on('logs:unsubscribe', (data) => {
      const logRoom = `logs:${data.sessionId || socket.userId}`;
      socket.leave(logRoom);

      socket.emit('logs:unsubscribed', {
        message: 'Unsubscribed from log stream',
        room: logRoom,
        timestamp: new Date()
      });
    });

    // ==================== PROXY EVENTS ====================

    /**
     * Proxy verification started
     */
    socket.on('proxy:verify_start', (data) => {
      console.log(`[Proxy] Verification started: ${data.proxyId}`);

      io.to(`user:${socket.userId}`).emit('proxy:verification_started', {
        proxyId: data.proxyId,
        proxyName: data.proxyName,
        timestamp: new Date()
      });
    });

    /**
     * Proxy verification completed
     */
    socket.on('proxy:verify_complete', (data) => {
      console.log(`[Proxy] Verification completed: ${data.proxyId} - ${data.verified ? 'VERIFIED' : 'FAILED'}`);

      io.to(`user:${socket.userId}`).emit('proxy:verification_completed', {
        proxyId: data.proxyId,
        proxyName: data.proxyName,
        verified: data.verified,
        responseTime: data.responseTime,
        healthScore: data.healthScore,
        timestamp: new Date()
      });
    });

    /**
     * Proxy status changed
     */
    socket.on('proxy:status_change', (data) => {
      io.to(`user:${socket.userId}`).emit('proxy:status_changed', {
        proxyId: data.proxyId,
        status: data.status,
        isActive: data.isActive,
        timestamp: new Date()
      });
    });

    // ==================== DASHBOARD EVENTS ====================

    /**
     * Request dashboard stats update
     */
    socket.on('dashboard:stats_request', () => {
      // This will be handled by a service to fetch fresh stats
      socket.emit('dashboard:stats_requested', {
        timestamp: new Date()
      });
    });

    /**
     * Broadcast stats to user
     */
    socket.on('dashboard:stats_update', (data) => {
      io.to(`user:${socket.userId}`).emit('dashboard:stats', {
        activeSessions: data.activeSessions,
        totalSessions: data.totalSessions,
        totalProxies: data.totalProxies,
        verifiedProxies: data.verifiedProxies,
        successRate: data.successRate,
        timestamp: new Date()
      });
    });

    /**
     * Subscribe to real-time metrics
     */
    socket.on('metrics:subscribe', () => {
      socket.join(`metrics:${socket.userId}`);

      socket.emit('metrics:subscribed', {
        message: 'Subscribed to real-time metrics',
        timestamp: new Date()
      });
    });

    socket.on('metrics:unsubscribe', () => {
      socket.leave(`metrics:${socket.userId}`);

      socket.emit('metrics:unsubscribed', {
        message: 'Unsubscribed from real-time metrics',
        timestamp: new Date()
      });
    });

    // ==================== ERROR & DISCONNECT ====================

    /**
     * Handle errors
     */
    socket.on('error', (error) => {
      console.error(`[Socket.io Error] ${socket.userId}:`, error);

      socket.emit('error', {
        message: 'An error occurred',
        timestamp: new Date()
      });
    });

    /**
     * Disconnection
     */
    socket.on('disconnect', () => {
      console.log(`[Socket.io] User disconnected: ${socket.userId}`);
    });

    /**
     * Ping/Pong for keepalive
     */
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: new Date() });
    });
  });

  return io;
};

/**
 * Emit live log to user
 */
const emitLiveLog = (io, userId, logData) => {
  io.to(`user:${userId}`).emit('log:live', {
    ...logData,
    timestamp: new Date()
  });
};

/**
 * Emit session update to user
 */
const emitSessionUpdate = (io, userId, sessionId, updateData) => {
  io.to(`user:${userId}`).emit('session:update', {
    sessionId,
    ...updateData,
    timestamp: new Date()
  });
};

/**
 * Emit metrics update to user
 */
const emitMetricsUpdate = (io, userId, metricsData) => {
  io.to(`metrics:${userId}`).emit('metrics:update', {
    ...metricsData,
    timestamp: new Date()
  });
};

/**
 * Broadcast to all connected users (admin notification)
 */
const broadcastAdminNotification = (io, notification) => {
  io.emit('admin:notification', {
    ...notification,
    timestamp: new Date()
  });
};

module.exports = {
  initializeSocket,
  emitLiveLog,
  emitSessionUpdate,
  emitMetricsUpdate,
  broadcastAdminNotification
};
