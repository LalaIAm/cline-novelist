const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const speakeasy = require('speakeasy');
const passport = require('passport');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: userExists.email === email 
          ? 'Email already in use' 
          : 'Username already in use'
      });
    }

    // Create the user
    const user = await User.create({
      email,
      username,
      password,
      authProvider: 'local',
    });

    // Generate verification token
    const verificationToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // TODO: Send verification email
    // For now, we'll just return the token for testing
    
    // Generate JWT
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // If user is using social auth and hasn't set a password
    if (user.authProvider !== 'local' && !user.password) {
      return res.status(401).json({
        success: false,
        error: 'Please login using your social account or set a password'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if MFA is required
    if (user.security && user.security.mfaEnabled) {
      // Generate a temporary token for MFA verification
      const tempToken = jwt.sign(
        { id: user._id, requiresMfa: true },
        process.env.JWT_SECRET,
        { expiresIn: '10m' }
      );

      return res.status(200).json({
        success: true,
        requiresMfa: true,
        token: tempToken,
        mfaMethod: user.security.mfaMethod
      });
    }

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login'
    });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  // If using cookies for auth
  if (req.cookies.token) {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
  }

  res.status(200).json({
    success: true,
    data: {}
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error retrieving user data'
    });
  }
};

// @desc    Update user details
// @route   PUT /api/auth/update-details
// @access  Private
exports.updateDetails = async (req, res) => {
  try {
    const fieldsToUpdate = {
      profile: req.body.profile,
      settings: req.body.settings
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    // If the user is trying to update email or username, handle separately
    if (req.body.email || req.body.username) {
      // Check if email or username is already taken
      const existingUser = await User.findOne({
        $or: [
          { email: req.body.email, _id: { $ne: req.user.id } },
          { username: req.body.username, _id: { $ne: req.user.id } }
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: existingUser.email === req.body.email 
            ? 'Email already in use' 
            : 'Username already in use'
        });
      }

      if (req.body.email) {
        fieldsToUpdate.email = req.body.email;
        // Require email verification if email changes
        fieldsToUpdate.isEmailVerified = false;
        // TODO: Send verification email
      }

      if (req.body.username) {
        fieldsToUpdate.username = req.body.username;
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update details error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating user details'
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Find user with password
    const user = await User.findById(req.user.id).select('+password');

    // If user is using social auth and hasn't set a password
    if (user.authProvider !== 'local' && !user.password) {
      user.password = newPassword;
      user.authProvider = 'local'; // Allow both social and password login
      await user.save();
      return sendTokenResponse(user, 200, res);
    }

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating password'
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No user with that email'
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // TODO: Send email with reset token
    // For now, just return the token for testing

    res.status(200).json({
      success: true,
      data: {
        resetToken,
        message: 'Password reset token generated'
      }
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    
    // Clear tokens if error
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      success: false,
      error: 'Server error processing password reset'
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error resetting password'
    });
  }
};

// @desc    Verify Email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    // Get hashed token
    const emailVerificationToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: emailVerificationToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Set email as verified
    user.isEmailVerified = true;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error verifying email'
    });
  }
};

// @desc    Send verification email
// @route   POST /api/auth/send-verification
// @access  Private
exports.sendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        error: 'Email already verified'
      });
    }

    // Generate verification token
    const verificationToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // TODO: Send verification email
    // For now, we'll just return the token for testing

    res.status(200).json({
      success: true,
      data: {
        token: verificationToken,
        message: 'Verification email sent'
      }
    });
  } catch (error) {
    console.error('Send verification email error:', error);
    
    // Clear tokens if error
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      success: false,
      error: 'Server error sending verification email'
    });
  }
};

// @desc    Enable MFA
// @route   POST /api/auth/enable-mfa
// @access  Private
exports.enableMfa = async (req, res) => {
  try {
    const { mfaMethod } = req.body;

    if (!['app', 'email', 'sms'].includes(mfaMethod)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid MFA method'
      });
    }

    const user = await User.findById(req.user.id);

    // Generate secret
    const secret = speakeasy.generateSecret({
      length: 20,
      name: `Novylist:${user.email}`
    });

    // Store the secret
    user.security = {
      ...user.security,
      mfaEnabled: false, // Will be enabled after verification
      mfaMethod,
      mfaSecret: secret.base32
    };

    await user.save();

    // Return the secret for app setup
    if (mfaMethod === 'app') {
      return res.status(200).json({
        success: true,
        data: {
          secret: secret.base32,
          otpauth_url: secret.otpauth_url
        }
      });
    }

    // TODO: Send verification code via email or SMS
    // For testing, create a test token
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32'
    });

    res.status(200).json({
      success: true,
      data: {
        message: `MFA setup initiated. Verification code sent via ${mfaMethod}`,
        testToken: token // Remove in production
      }
    });
  } catch (error) {
    console.error('Enable MFA error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error enabling MFA'
    });
  }
};

// @desc    Verify MFA setup
// @route   POST /api/auth/verify-mfa-setup
// @access  Private
exports.verifyMfaSetup = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.id).select('+security.mfaSecret');

    if (!user.security || !user.security.mfaSecret) {
      return res.status(400).json({
        success: false,
        error: 'MFA not set up'
      });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.security.mfaSecret,
      encoding: 'base32',
      token,
      window: 1 // Allow 30 seconds of clock drift
    });

    if (!verified) {
      return res.status(401).json({
        success: false,
        error: 'Invalid MFA code'
      });
    }

    // Enable MFA
    user.security.mfaEnabled = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'MFA enabled successfully'
    });
  } catch (error) {
    console.error('Verify MFA setup error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error verifying MFA setup'
    });
  }
};

// @desc    Verify MFA during login
// @route   POST /api/auth/verify-mfa
// @access  Public
exports.verifyMfa = async (req, res) => {
  try {
    const { token, tempToken } = req.body;

    if (!token || !tempToken) {
      return res.status(400).json({
        success: false,
        error: 'Please provide token and tempToken'
      });
    }

    // Verify the temporary token
    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session'
      });
    }

    if (!decoded.requiresMfa) {
      return res.status(401).json({
        success: false,
        error: 'MFA not required for this session'
      });
    }

    // Get user
    const user = await User.findById(decoded.id).select('+security.mfaSecret');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify MFA token
    const verified = speakeasy.totp.verify({
      secret: user.security.mfaSecret,
      encoding: 'base32',
      token,
      window: 1 // Allow 30 seconds of clock drift
    });

    if (!verified) {
      return res.status(401).json({
        success: false,
        error: 'Invalid MFA code'
      });
    }

    // MFA is verified, send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Verify MFA error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error verifying MFA'
    });
  }
};

// @desc    Disable MFA
// @route   POST /api/auth/disable-mfa
// @access  Private
exports.disableMfa = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    // Confirm password for security
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Password is incorrect'
      });
    }

    // Disable MFA
    user.security.mfaEnabled = false;
    user.security.mfaSecret = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'MFA disabled successfully'
    });
  } catch (error) {
    console.error('Disable MFA error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error disabling MFA'
    });
  }
};

// @desc    Google OAuth login
// @route   GET /api/auth/google
// @access  Public
exports.googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
    
    // Generate token
    const token = user.getSignedJwtToken();
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${token}`);
  })(req, res, next);
};

// @desc    LinkedIn OAuth login
// @route   GET /api/auth/linkedin
// @access  Public
exports.linkedinLogin = passport.authenticate('linkedin');

// @desc    LinkedIn OAuth callback
// @route   GET /api/auth/linkedin/callback
// @access  Public
exports.linkedinCallback = (req, res, next) => {
  passport.authenticate('linkedin', { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
    
    // Generate token
    const token = user.getSignedJwtToken();
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${token}`);
  })(req, res, next);
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  // Use secure cookies in production
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};
