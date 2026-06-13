const express = require('express');
const profileController = require('../controllers/profileController');
const { protect, checkRole } = require('../middleware/auth');

const router = express.Router();

/**
 * Profile Routes
 */

// Protected user routes
router.get('/', protect, profileController.getProfile);
router.put('/', protect, profileController.updateProfile);
router.put('/preferences', protect, profileController.updatePreferences);

// Admin routes
router.get('/all', protect, checkRole('admin'), profileController.getAllProfiles);
router.put('/:userId/status', protect, checkRole('admin'), profileController.updateAccountStatus);
router.delete('/:userId', protect, checkRole('admin'), profileController.deleteProfile);

module.exports = router;
