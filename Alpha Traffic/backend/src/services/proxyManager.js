const { Proxy, Log } = require('../models');

class ProxyManager {
  /**
   * Verify proxy connectivity (simulated)
   */
  static async verifyProxy(userId, proxyId) {
    try {
      let proxy = await Proxy.findOne({
        _id: proxyId,
        userId
      });

      if (!proxy) {
        throw new Error('Proxy not found');
      }

      // Simulate proxy verification
      const simulationResult = this.simulateProxyTest();
      
      proxy.lastVerified = new Date();
      proxy.status = simulationResult.verified ? 'verified' : 'failed';
      
      if (simulationResult.verified) {
        proxy.failureCount = 0;
        // Update performance metrics
        proxy.performance.successRate = Math.min(100, proxy.performance.successRate + 5);
        proxy.performance.avgResponseTime = simulationResult.responseTime;
      } else {
        proxy.failureCount += 1;
        proxy.performance.successRate = Math.max(0, proxy.performance.successRate - 10);
      }

      proxy.performance.totalRequests += 1;
      await proxy.save();

      // Log verification
      await this.logProxyEvent(userId, proxyId, 'proxy_verified', 
        `Proxy ${simulationResult.verified ? 'verified' : 'failed'}`, {
        responseTime: simulationResult.responseTime,
        statusCode: simulationResult.statusCode
      });

      return {
        proxy: proxy.toJSON(),
        verified: simulationResult.verified,
        responseTime: simulationResult.responseTime,
        statusCode: simulationResult.statusCode
      };
    } catch (error) {
      throw new Error(`Failed to verify proxy: ${error.message}`);
    }
  }

  /**
   * Simulate proxy test
   */
  static simulateProxyTest() {
    const verified = Math.random() > 0.25; // 75% success rate
    const responseTime = Math.floor(Math.random() * 2000) + 100; // 100-2100ms
    const statusCode = verified ? 200 : 503;

    return {
      verified,
      responseTime,
      statusCode
    };
  }

  /**
   * Get proxy health status
   */
  static async getProxyHealth(userId, proxyId) {
    try {
      const proxy = await Proxy.findOne({
        _id: proxyId,
        userId
      });

      if (!proxy) {
        throw new Error('Proxy not found');
      }

      const healthScore = this.calculateHealthScore(proxy);

      return {
        proxyId: proxy._id,
        name: proxy.name,
        status: proxy.status,
        healthScore,
        successRate: proxy.performance.successRate,
        avgResponseTime: proxy.performance.avgResponseTime,
        totalRequests: proxy.performance.totalRequests,
        failureCount: proxy.failureCount,
        lastVerified: proxy.lastVerified,
        recommendation: this.getHealthRecommendation(healthScore)
      };
    } catch (error) {
      throw new Error(`Failed to get proxy health: ${error.message}`);
    }
  }

  /**
   * Calculate proxy health score (0-100)
   */
  static calculateHealthScore(proxy) {
    let score = 100;

    // Factor in success rate (40%)
    score -= (100 - proxy.performance.successRate) * 0.4;

    // Factor in response time (30%)
    const avgResponseTime = proxy.performance.avgResponseTime;
    if (avgResponseTime > 5000) {
      score -= 30;
    } else if (avgResponseTime > 2000) {
      score -= 15;
    } else if (avgResponseTime < 500) {
      score += 5;
    }

    // Factor in failure count (30%)
    const penaltyPerFailure = 3;
    score -= Math.min(30, proxy.failureCount * penaltyPerFailure);

    return Math.max(0, Math.round(score));
  }

  /**
   * Get health recommendation
   */
  static getHealthRecommendation(healthScore) {
    if (healthScore >= 80) return 'Excellent - Ready for production';
    if (healthScore >= 60) return 'Good - Monitor for issues';
    if (healthScore >= 40) return 'Fair - Consider rotation';
    return 'Poor - Replace immediately';
  }

  /**
   * Get available proxies for user
   */
  static async getAvailableProxies(userId, limit = 10) {
    try {
      return await Proxy.find({
        userId,
        isActive: true,
        status: 'verified'
      })
        .select('-password')
        .limit(limit)
        .sort({ 'performance.successRate': -1 });
    } catch (error) {
      throw new Error(`Failed to get available proxies: ${error.message}`);
    }
  }

  /**
   * Select best proxy for rotation
   */
  static async selectBestProxy(userId) {
    try {
      const proxy = await Proxy.findOne({
        userId,
        isActive: true,
        status: 'verified'
      })
        .select('-password')
        .sort({ 'performance.successRate': -1 });

      if (!proxy) {
        throw new Error('No verified proxies available');
      }

      return proxy;
    } catch (error) {
      throw new Error(`Failed to select best proxy: ${error.message}`);
    }
  }

  /**
   * Log proxy event
   */
  static async logProxyEvent(userId, proxyId, type, message, metadata = {}) {
    try {
      const log = new Log({
        userId,
        proxyId,
        type,
        level: 'info',
        message,
        metadata
      });

      await log.save();
      return log;
    } catch (error) {
      console.error('Failed to log proxy event:', error);
    }
  }
}

module.exports = ProxyManager;
