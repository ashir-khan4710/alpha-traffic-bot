const express = require('express');
const proxyController = require('../controllers/proxyController');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * Proxy Routes
 */

// Protected routes
router.post('/', protect, proxyController.createProxy);
router.get('/', protect, proxyController.getProxies);
router.get('/:proxyId', protect, proxyController.getProxy);
router.put('/:proxyId', protect, proxyController.updateProxy);
router.delete('/:proxyId', protect, proxyController.deleteProxy);
router.post('/:proxyId/verify', protect, proxyController.verifyProxy);
router.post('/bulk/status', protect, proxyController.bulkUpdateStatus);

module.exports = router;
