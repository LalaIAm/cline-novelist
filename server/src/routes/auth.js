const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
  enableMfa,
  verifyMfaSetup,
  verifyMfa,
  disableMfa,
  googleLogin,
  googleCallback,
  linkedinLogin,
  linkedinCallback
} = require('../controllers/auth');

const { protect } = require('../middleware/auth');

// OAuth routes
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);
router.get('/linkedin', linkedinLogin);
router.get('/linkedin/callback', linkedinCallback);

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/verify-mfa', verifyMfa);

// Protected routes
router.use(protect); // Apply auth middleware to all routes below
router.get('/me', getMe);
router.post('/logout', logout);
router.put('/update-details', updateDetails);
router.put('/update-password', updatePassword);
router.post('/send-verification', sendVerificationEmail);
router.post('/enable-mfa', enableMfa);
router.post('/verify-mfa-setup', verifyMfaSetup);
router.post('/disable-mfa', disableMfa);

module.exports = router;
