console.log("ecommerce route loaded");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { asyncHandler } = require('../middleware/errorHandler');




// Example usage in headers:
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': apikey,
    'X-RapidAPI-Host': rapidApiHost,
  }
};

// GET /api/scrape/ecommerce - Scrape e-commerce product data
const API_URL ="https://real-time-amazon-data.p.rapidapi.com/search?query=Phone&page=1&country=US&sort_by=RELEVANCE&product_condition=ALL&is_prime=false&deals_and_discounts=NONE"

router.get('/', asyncHandler(async (req, res) => {
  try {
    const response = await fetch(API_URL, options);
    const result = await response.json();
    console.log(result);
    res.json({
      success: true,
      data: result.data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch e-commerce data', error: error.message });

  }
}));

module.exports = router; 