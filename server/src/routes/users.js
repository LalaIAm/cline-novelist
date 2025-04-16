const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  getUserSettings,
  updateUserSettings,
  deleteUser
} = require('../controllers/users');
const { protect, checkMfa } = require('../middleware/auth');

const router = express.Router();

// All routes below this require authentication
router.use(protect);
router.use(checkMfa);

// Profile management
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

// Settings management
router.get('/settings', getUserSettings);
router.put('/settings', updateUserSettings);

// Account management
router.delete('/', deleteUser);

module.exports = router;
