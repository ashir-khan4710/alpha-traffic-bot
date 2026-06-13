const express = require('express');
const sessionController = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * Session Routes
 */

// Protected routes
router.post('/', protect, sessionController.createSession);
router.get('/', protect, sessionController.getSessions);
router.get('/:sessionId', protect, sessionController.getSession);
router.post('/:sessionId/start', protect, sessionController.startSession);
router.post('/:sessionId/end', protect, sessionController.endSession);
router.post('/:sessionId/pause', protect, sessionController.pauseSession);
router.post('/:sessionId/resume', protect, sessionController.resumeSession);
router.post('/:sessionId/actions', protect, sessionController.addAction);
router.put('/:sessionId', protect, sessionController.updateSession);
router.delete('/:sessionId', protect, sessionController.deleteSession);

module.exports = router;
