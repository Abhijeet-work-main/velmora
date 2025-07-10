const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/user/profile - Get user profile
router.get('/profile', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'User profile endpoint',
    data: req.user || null,
    timestamp: new Date().toISOString()
  });
}));

// GET /api/user/saved - Get saved items
router.get('/saved', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: [],
    timestamp: new Date().toISOString()
  });
}));

module.exports = router; 