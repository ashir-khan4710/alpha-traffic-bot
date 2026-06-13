/**
 * Socket.io Event Emitter Helper
 * Used by controllers to emit real-time events
 */

const getIO = (req) => {
  return req.app.get('io');
};

/**
 * Emit event to specific user
 */
const emitToUser = (req, userId, eventName, data) => {
  const io = getIO(req);
  if (io) {
    io.to(`user:${userId}`).emit(eventName, {
      ...data,
      timestamp: new Date()
    });
  }
};

/**
 * Emit session event
 */
const emitSessionEvent = (req, userId, sessionId, eventName, data) => {
  const io = getIO(req);
  if (io) {
    io.to(`user:${userId}`).emit(eventName, {
      sessionId,
      ...data,
      timestamp: new Date()
    });
  }
};

/**
 * Emit log event
 */
const emitLogEvent = (req, userId, logData) => {
  const io = getIO(req);
  if (io) {
    io.to(`user:${userId}`).emit('log:live', {
      ...logData,
      timestamp: new Date()
    });

    // Also emit to specific session room if sessionId exists
    if (logData.sessionId) {
      io.to(`logs:${logData.sessionId}`).emit('log:live', {
        ...logData,
        timestamp: new Date()
      });
    }
  }
};

/**
 * Emit proxy event
 */
const emitProxyEvent = (req, userId, proxyId, eventName, data) => {
  const io = getIO(req);
  if (io) {
    io.to(`user:${userId}`).emit(eventName, {
      proxyId,
      ...data,
      timestamp: new Date()
    });
  }
};

/**
 * Emit metrics update
 */
const emitMetricsUpdate = (req, userId, metricsData) => {
  const io = getIO(req);
  if (io) {
    io.to(`metrics:${userId}`).emit('metrics:update', {
      ...metricsData,
      timestamp: new Date()
    });
  }
};

/**
 * Broadcast to all connected users
 */
const broadcastToAll = (req, eventName, data) => {
  const io = getIO(req);
  if (io) {
    io.emit(eventName, {
      ...data,
      timestamp: new Date()
    });
  }
};

module.exports = {
  getIO,
  emitToUser,
  emitSessionEvent,
  emitLogEvent,
  emitProxyEvent,
  emitMetricsUpdate,
  broadcastToAll
};
