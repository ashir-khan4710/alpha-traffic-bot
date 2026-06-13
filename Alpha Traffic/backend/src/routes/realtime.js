const express = require('express');
const realtimeController = require('../controllers/realtimeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * Real-time Routes
 * These endpoints provide real-time data for the dashboard
 */

// Dashboard statistics
router.get('/dashboard/stats', protect, realtimeController.getDashboardStats);

// Session real-time updates
router.get('/sessions/:sessionId/updates', protect, realtimeController.getSessionUpdates);

// Recent logs
router.get('/logs/recent', protect, realtimeController.getRecentLogs);

// Proxy metrics
router.get('/proxies/metrics', protect, realtimeController.getProxyMetrics);

// Broadcast metrics
router.post('/metrics/broadcast', protect, realtimeController.broadcastMetrics);

module.exports = router;
