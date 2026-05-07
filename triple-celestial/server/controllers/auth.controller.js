const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Helper to generate JWT
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register user
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate fields
    if (!name || !email || !password || !role) {
      return errorResponse(res, 400, 'Please provide all required fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return errorResponse(res, 400, 'Email already registered');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Welcome log
    console.log(`[Notification] Welcome ${name}! Account created as ${role}.`);

    const token = generateToken(user._id);

    // Remove password from response
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return successResponse(res, 201, 'User registered successfully', {
      token,
      user: userData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return errorResponse(res, 400, 'Please provide email and password');
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    // Check if active
    if (!user.isActive) {
      return errorResponse(res, 401, 'Account deactivated');
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Create token
    const token = generateToken(user._id);

    const userInfo = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
    };

    return successResponse(res, 200, 'Login successful', {
      token,
      user: userInfo,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
exports.logout = (req, res) => {
  return successResponse(res, 200, 'Logged out successfully');
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
exports.getMe = async (req, res) => {
  // Population of role-specific profiles would happen here in future steps
  return successResponse(res, 200, 'User data fetched', req.user);
};

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change password
 * @access  Private
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(res, 400, 'Please provide both current and new passwords');
    }

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return errorResponse(res, 400, 'Incorrect current password');
    }

    user.password = newPassword;
    await user.save();

    return successResponse(res, 200, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};
