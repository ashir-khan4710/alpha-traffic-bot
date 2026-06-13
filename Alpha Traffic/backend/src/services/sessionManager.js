const { Session, Log } = require('../models');

class SessionManager {
  /**
   * Create and start a session
   */
  static async createAndStartSession(userId, sessionData) {
    try {
      const session = new Session({
        userId,
        name: sessionData.name,
        proxyId: sessionData.proxyId || null,
        sessionType: sessionData.sessionType || 'manual',
        config: sessionData.config || {},
        notes: sessionData.notes || '',
        status: 'active',
        startedAt: new Date()
      });

      await session.save();

      // Log session start
      await this.logSessionEvent(userId, session._id, 'session_start', 'Session started', {
        sessionType: session.sessionType,
        proxyId: session.proxyId
      });

      return session;
    } catch (error) {
      throw new Error(`Failed to create session: ${error.message}`);
    }
  }

  /**
   * End a session with final statistics
   */
  static async endSession(userId, sessionId) {
    try {
      let session = await Session.findOne({
        _id: sessionId,
        userId
      });

      if (!session) {
        throw new Error('Session not found');
      }

      session.status = 'completed';
      session.endedAt = new Date();

      // Calculate duration
      if (session.startedAt) {
        session.totalDuration = session.endedAt - session.startedAt;
      }

      // Calculate performance metrics
      if (session.actionCount > 0) {
        session.performance.successRate = (session.successCount / session.actionCount) * 100;
        session.performance.avgActionTime = session.totalDuration / session.actionCount;
      }

      await session.save();

      // Log session end
      await this.logSessionEvent(userId, sessionId, 'session_end', 'Session completed', {
        totalDuration: session.totalDuration,
        totalActions: session.actionCount,
        successCount: session.successCount,
        failureCount: session.failureCount,
        successRate: session.performance.successRate
      });

      return session;
    } catch (error) {
      throw new Error(`Failed to end session: ${error.message}`);
    }
  }

  /**
   * Record an action in session
   */
  static async recordAction(userId, sessionId, actionData) {
    try {
      let session = await Session.findOne({
        _id: sessionId,
        userId
      });

      if (!session) {
        throw new Error('Session not found');
      }

      const action = {
        id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: actionData.type,
        timestamp: new Date(),
        status: actionData.status || 'success',
        result: actionData.result || {}
      };

      session.actions.push(action);
      session.actionCount += 1;

      if (actionData.status === 'success') {
        session.successCount += 1;
      } else if (actionData.status === 'failed') {
        session.failureCount += 1;
      }

      await session.save();

      // Log action
      await this.logSessionEvent(userId, sessionId, 'action_executed', `${actionData.type} action executed`, {
        actionId: action.id,
        actionType: actionData.type,
        status: actionData.status
      });

      return action;
    } catch (error) {
      throw new Error(`Failed to record action: ${error.message}`);
    }
  }

  /**
   * Pause session
   */
  static async pauseSession(userId, sessionId) {
    try {
      let session = await Session.findOne({
        _id: sessionId,
        userId
      });

      if (!session) {
        throw new Error('Session not found');
      }

      session.status = 'paused';
      session.pausedAt = new Date();
      await session.save();

      await this.logSessionEvent(userId, sessionId, 'session_paused', 'Session paused', {});

      return session;
    } catch (error) {
      throw new Error(`Failed to pause session: ${error.message}`);
    }
  }

  /**
   * Resume session
   */
  static async resumeSession(userId, sessionId) {
    try {
      let session = await Session.findOne({
        _id: sessionId,
        userId
      });

      if (!session) {
        throw new Error('Session not found');
      }

      session.status = 'active';
      session.resumedAt = new Date();
      await session.save();

      await this.logSessionEvent(userId, sessionId, 'session_resumed', 'Session resumed', {});

      return session;
    } catch (error) {
      throw new Error(`Failed to resume session: ${error.message}`);
    }
  }

  /**
   * Get session statistics
   */
  static async getSessionStats(userId, sessionId) {
    try {
      const session = await Session.findOne({
        _id: sessionId,
        userId
      });

      if (!session) {
        throw new Error('Session not found');
      }

      return {
        totalActions: session.actionCount,
        successCount: session.successCount,
        failureCount: session.failureCount,
        successRate: session.performance.successRate || 0,
        avgActionTime: session.performance.avgActionTime || 0,
        totalDuration: session.totalDuration || 0,
        status: session.status,
        startedAt: session.startedAt,
        endedAt: session.endedAt
      };
    } catch (error) {
      throw new Error(`Failed to get session stats: ${error.message}`);
    }
  }

  /**
   * Log session event
   */
  static async logSessionEvent(userId, sessionId, type, message, metadata = {}) {
    try {
      const log = new Log({
        userId,
        sessionId,
        type,
        level: 'info',
        message,
        metadata
      });

      await log.save();
      return log;
    } catch (error) {
      console.error('Failed to log session event:', error);
    }
  }

  /**
   * Get active sessions count for user
   */
  static async getActiveSessionsCount(userId) {
    try {
      return await Session.countDocuments({
        userId,
        status: 'active'
      });
    } catch (error) {
      throw new Error(`Failed to count active sessions: ${error.message}`);
    }
  }
}

module.exports = SessionManager;
