const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes that require authentication
 */
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];
  } 
  // Check for token in cookies (optional)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Not authorized to access this resource' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user with the ID from the token
    req.user = await User.findById(decoded.id);

    // If user not found, return error
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false, 
      error: 'Not authorized to access this resource' 
    });
  }
};

/**
 * Middleware to check if MFA is required
 * Will allow the request to proceed if MFA is not enabled
 * Will require MFA verification if enabled
 */
exports.checkMfa = async (req, res, next) => {
  // If no user attached to the request, return error
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      error: 'User not authenticated' 
    });
  }

  // If user has MFA enabled but not verified in this session
  if (req.user.security && req.user.security.mfaEnabled && !req.session.mfaVerified) {
    return res.status(403).json({
      success: false,
      error: 'MFA verification required',
      requiresMfa: true
    });
  }

  next();
};
