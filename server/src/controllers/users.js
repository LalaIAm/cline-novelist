const User = require('../models/User');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        profile: user.profile
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateUserProfile = async (req, res) => {
  try {
    // Get fields to update
    const fieldsToUpdate = {
      profile: req.body.profile
    };

    // Prevent updating of username/email via this route
    delete fieldsToUpdate.email;
    delete fieldsToUpdate.username;

    // Update user
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * @desc    Get user settings
 * @route   GET /api/users/settings
 * @access  Private
 */
exports.getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        settings: user.settings
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * @desc    Update user settings
 * @route   PUT /api/users/settings
 * @access  Private
 */
exports.updateUserSettings = async (req, res) => {
  try {
    // Get fields to update
    const fieldsToUpdate = {
      settings: req.body.settings
    };

    // Update user
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users
 * @access  Private
 */
exports.deleteUser = async (req, res) => {
  try {
    // Verify password if provided
    if (req.body.password) {
      const user = await User.findById(req.user.id).select('+password');
      const isMatch = await user.matchPassword(req.body.password);
      
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid password'
        });
      }
    }

    // Delete user
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
