const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const apikey = process.env.AMAZON_API_KEY;
const rapidApiHost = process.env.RAPIDAPI_HOST;

// Example usage in headers:
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': apikey,
    'X-RapidAPI-Host': rapidApiHost,
  }
};
const response = await fetch('https://your-rapidapi-endpoint', options);
const result = await response.json();
// GET /api/scrape/ecommerce - Scrape e-commerce product data
router.get('/', asyncHandler(async (req, res) => {
  console.log(result);
  res.json({
    success: true,
    data: result.data,
    timestamp: new Date().toISOString()
  });
}));

module.exports = router; 