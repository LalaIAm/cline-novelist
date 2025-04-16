const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please add a valid email',
    ],
  },
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot be more than 30 characters'],
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'linkedin'],
    default: 'local',
  },
  socialId: {
    type: String,
    select: false,
  },
  socialProfile: {
    type: mongoose.Schema.Types.Mixed,
    select: false,
  },
  password: {
    type: String,
    required: function() { 
      return this.authProvider === 'local'; 
    },
    minlength: [8, 'Password must be at least 8 characters'],
    validate: {
      validator: function(v) {
        // Skip validation for social auth users
        if (this.authProvider !== 'local') return true;
        
        // Check for at least 1 letter, 1 number, and 1 special character
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(v);
      },
      message: 'Password must contain at least 1 letter, 1 number, and 1 special character'
    },
    select: false,
  },
  profile: {
    name: String,
    bio: String,
    preferences: {
      genre: [String],
      writingStyle: String,
      aiAssistanceLevel: {
        type: String,
        enum: ['minimal', 'moderate', 'extensive'],
        default: 'moderate',
      },
    },
  },
  settings: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    editorPreferences: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    notifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        email: true,
        app: true,
      },
    },
  },
  security: {
    mfaEnabled: {
      type: Boolean,
      default: false,
    },
    mfaMethod: {
      type: String,
      enum: ['app', 'email', 'sms'],
      default: 'email',
    },
    mfaSecret: {
      type: String,
      select: false,
    },
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.updatedAt = Date.now();
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
