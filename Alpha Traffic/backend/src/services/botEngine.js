const { Session, Log } = require('../models');
const SessionManager = require('./sessionManager');
const ProxyManager = require('./proxyManager');

/**
 * BotEngine - Simulates bot automation (no harmful actions)
 * This is a SAFE SIMULATION ONLY - it does not perform any actual automation
 */
class BotEngine {
  /**
   * Execute session simulation
   * @param {string} userId - User ID
   * @param {object} sessionData - Session configuration
   * @returns {object} Session with simulated results
   */
  static async executeSimulatedSession(userId, sessionData) {
    try {
      // Create and start session
      const session = await SessionManager.createAndStartSession(userId, sessionData);

      console.log(`[BotEngine] Starting simulated session: ${session._id}`);

      // Get proxy if specified
      let proxy = null;
      if (sessionData.proxyId) {
        proxy = await ProxyManager.selectBestProxy(userId);
      }

      // Simulate actions
      const actionCount = sessionData.actions?.length || this.getRandomActionCount();
      
      for (let i = 0; i < actionCount; i++) {
        const actionType = this.getRandomActionType();
        const actionResult = this.simulateAction(actionType);

        await SessionManager.recordAction(userId, session._id, {
          type: actionType,
          status: actionResult.status,
          result: actionResult
        });

        // Simulate processing delay
        await this.delay(this.getRandomDelay());
      }

      // End session
      const completedSession = await SessionManager.endSession(userId, session._id);

      console.log(`[BotEngine] Completed simulated session: ${session._id}`);

      return {
        session: completedSession,
        summary: {
          totalActions: completedSession.actionCount,
          successful: completedSession.successCount,
          failed: completedSession.failureCount,
          successRate: completedSession.performance.successRate,
          avgActionTime: completedSession.performance.avgActionTime,
          totalDuration: completedSession.totalDuration
        }
      };
    } catch (error) {
      throw new Error(`Failed to execute simulated session: ${error.message}`);
    }
  }

  /**
   * Simulate a single action (safe simulation)
   */
  static simulateAction(actionType) {
    const random = Math.random();
    const status = random > 0.15 ? 'success' : 'failed'; // 85% success rate

    const result = {
      actionType,
      status,
      timestamp: new Date(),
      executionTime: Math.floor(Math.random() * 1000) + 50,
      responseCode: status === 'success' ? 200 : 400,
      details: this.generateActionDetails(actionType, status)
    };

    return result;
  }

  /**
   * Generate simulated action details
   */
  static generateActionDetails(actionType, status) {
    const templates = {
      click: {
        success: { element: 'button#submit', clickCount: 1 },
        failed: { element: 'button#submit', error: 'Element not found' }
      },
      input: {
        success: { field: 'input[name="email"]', value: '***@example.com', inputDelay: 150 },
        failed: { field: 'input[name="email"]', error: 'Field disabled' }
      },
      navigate: {
        success: { url: 'https://example.com/page', statusCode: 200, loadTime: 523 },
        failed: { url: 'https://example.com/page', statusCode: 503, error: 'Service unavailable' }
      },
      extract: {
        success: { selector: '.data-item', extractedItems: Math.floor(Math.random() * 50) + 1 },
        failed: { selector: '.data-item', error: 'No items found' }
      },
      wait: {
        success: { duration: 2000, condition: 'element visible', satisfied: true },
        failed: { duration: 5000, condition: 'element visible', satisfied: false, timedOut: true }
      }
    };

    return templates[actionType]?.[status] || { actionType, status };
  }

  /**
   * Get random action type
   */
  static getRandomActionType() {
    const types = ['click', 'input', 'navigate', 'extract', 'wait'];
    return types[Math.floor(Math.random() * types.length)];
  }

  /**
   * Get random action count
   */
  static getRandomActionCount() {
    return Math.floor(Math.random() * 15) + 3; // 3-18 actions
  }

  /**
   * Get random delay (in ms)
   */
  static getRandomDelay() {
    return Math.floor(Math.random() * 500) + 100; // 100-600ms
  }

  /**
   * Delay utility
   */
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Schedule automated session (simulation)
   */
  static async scheduleAutomatedSession(userId, scheduleData) {
    try {
      const session = new Session({
        userId,
        name: scheduleData.name,
        proxyId: scheduleData.proxyId || null,
        sessionType: 'scheduled',
        status: 'pending',
        config: scheduleData.config || {},
        notes: `Scheduled for ${scheduleData.scheduledTime}`
      });

      await session.save();

      await this.logBotEvent(userId, session._id, 'session_scheduled', 'Session scheduled for automation', {
        scheduledTime: scheduleData.scheduledTime,
        frequency: scheduleData.frequency
      });

      return session;
    } catch (error) {
      throw new Error(`Failed to schedule session: ${error.message}`);
    }
  }

  /**
   * Get bot statistics
   */
  static async getBotStatistics(userId) {
    try {
      const totalSessions = await Session.countDocuments({ userId });
      const completedSessions = await Session.countDocuments({ userId, status: 'completed' });
      const activeSessions = await Session.countDocuments({ userId, status: 'active' });

      const sessions = await Session.find({ userId, status: 'completed' }).limit(100);
      
      let totalActions = 0;
      let totalSuccessful = 0;
      let totalDuration = 0;

      sessions.forEach(session => {
        totalActions += session.actionCount;
        totalSuccessful += session.successCount;
        totalDuration += session.totalDuration;
      });

      return {
        totalSessions,
        completedSessions,
        activeSessions,
        totalActions,
        totalSuccessful,
        overallSuccessRate: completedSessions > 0 ? (totalSuccessful / totalActions * 100).toFixed(2) : 0,
        avgSessionDuration: completedSessions > 0 ? Math.round(totalDuration / completedSessions) : 0
      };
    } catch (error) {
      throw new Error(`Failed to get bot statistics: ${error.message}`);
    }
  }

  /**
   * Log bot event
   */
  static async logBotEvent(userId, sessionId, type, message, metadata = {}) {
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
      console.error('Failed to log bot event:', error);
    }
  }
}

module.exports = BotEngine;
