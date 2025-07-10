const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/scrape/ecommerce - Scrape e-commerce product data
router.get('/', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'E-commerce scraping endpoint',
    data: [],
    timestamp: new Date().toISOString()
  });
}));

module.exports = router; 