const express = require('express');
const logController = require('../controllers/logController');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * Log Routes
 */

// Protected routes
router.post('/', protect, logController.createLog);
router.get('/', protect, logController.getLogs);
router.get('/statistics', protect, logController.getStatistics);
router.get('/:logId', protect, logController.getLog);
router.get('/session/:sessionId', protect, logController.getSessionLogs);
router.post('/cleanup/old', protect, logController.deleteOldLogs);
router.delete('/session/:sessionId', protect, logController.clearSessionLogs);

module.exports = router;
