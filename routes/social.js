const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/scrape/social - Scrape social media posts
router.get('/', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Social media scraping endpoint',
    data: [],
    timestamp: new Date().toISOString()
  });
}));

module.exports = router; 