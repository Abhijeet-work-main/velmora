const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Import utilities
const { asyncHandler } = require('../middleware/errorHandler');
const { generateToken, verifyToken } = require('../middleware/auth');
const { db } = require('../utils/database');
const logger = require('../utils/logger');

// POST /api/auth/register - Register new user
router.post('/register', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already exists',
        message: 'A user with this email address already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: 'user',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const user = await db.createUser(userData);

    // Generate JWT token
    const token = generateToken(user);

    // Create user preferences
    await db.saveUserPreferences(user.id, {
      theme: 'dark',
      notifications: true,
      auto_refresh: true,
      default_sources: ['bbc', 'reuters', 'techcrunch'],
      default_categories: ['general', 'technology']
    });

    logger.info(`User registered successfully: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at
        },
        token
      }
    });

  } catch (error) {
    logger.error('User registration failed:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      message: 'An error occurred during registration'
    });
  }
}));

// POST /api/auth/login - User login
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Account deactivated',
        message: 'Your account has been deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Update last login
    await db.updateUser(user.id, {
      last_login: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    logger.info(`User logged in successfully: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
          last_login: user.last_login
        },
        token
      }
    });

  } catch (error) {
    logger.error('User login failed:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: 'An error occurred during login'
    });
  }
}));

// POST /api/auth/logout - User logout
router.post('/logout', asyncHandler(async (req, res) => {
  // In a more complex system, you might want to blacklist the token
  // For now, we'll just send a success response
  res.json({
    success: true,
    message: 'Logout successful'
  });
}));

// GET /api/auth/verify - Verify JWT token
router.get('/verify', asyncHandler(async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token required',
      message: 'Access token is required'
    });
  }

  try {
    const decoded = verifyToken(token);
    const user = await db.getUserById(decoded.userId);

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'Token is invalid or user is inactive'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
          last_login: user.last_login
        }
      }
    });

  } catch (error) {
    logger.error('Token verification failed:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid token',
      message: 'Token verification failed'
    });
  }
}));

// POST /api/auth/refresh - Refresh JWT token
router.post('/refresh', asyncHandler(async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token required',
      message: 'Access token is required'
    });
  }

  try {
    const decoded = verifyToken(token);
    const user = await db.getUserById(decoded.userId);

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'Token is invalid or user is inactive'
      });
    }

    // Generate new token
    const newToken = generateToken(user);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken
      }
    });

  } catch (error) {
    logger.error('Token refresh failed:', error);
    res.status(401).json({
      success: false,
      error: 'Token refresh failed',
      message: 'Unable to refresh token'
    });
  }
}));

// POST /api/auth/forgot-password - Password reset request
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { email } = req.body;

  try {
    const user = await db.getUserByEmail(email);
    
    // Always return success for security (don't reveal if email exists)
    res.json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent'
    });

    if (user) {
      // Generate password reset token
      const resetToken = generateToken({ userId: user.id, type: 'password_reset' });
      
      // In a real application, you would:
      // 1. Store the reset token in the database with expiration
      // 2. Send an email with the reset link
      // 3. Implement the password reset endpoint
      
      logger.info(`Password reset requested for: ${email}`);
    }

  } catch (error) {
    logger.error('Password reset request failed:', error);
    res.json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent'
    });
  }
}));

// POST /api/auth/change-password - Change user password
router.post('/change-password', [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      message: 'Access token is required'
    });
  }

  try {
    const decoded = verifyToken(token);
    const user = await db.getUserById(decoded.userId);

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'Token is invalid or user is inactive'
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid current password',
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await db.updateUser(user.id, {
      password: hashedNewPassword,
      updated_at: new Date().toISOString()
    });

    logger.info(`Password changed successfully for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    logger.error('Password change failed:', error);
    res.status(500).json({
      success: false,
      error: 'Password change failed',
      message: 'An error occurred while changing password'
    });
  }
}));

module.exports = router; 