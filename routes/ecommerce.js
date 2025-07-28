console.log("ecommerce route loaded");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
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

// Synonym mapping
const synonymMap = {
  phone: 'Phone',
  mobile: 'Phone',
  smartphone: 'Phone',
  laptop: 'Laptop',
  notebooks: 'Laptop',
  headphones: 'Headphones',
  earbuds: 'Headphones',
  tv: 'Television',
  television: 'Television',
  fridge: 'Refrigerator',
  ac: 'Air Conditioner',
  washing: 'Washing Machine'
};

// Helper: clean and normalize query
function mapQuery(query) {
  query = query.toLowerCase().trim();
  for (let key in synonymMap) {
    if (query.includes(key)) return synonymMap[key];
  }
  return query; // fallback to user input if no match
}

// GET /api/scrape/ecommerce - Scrape e-commerce product data
router.get('/', asyncHandler(async (req, res) => {
  const rawQuery = req.query.query || 'Phone';
  const searchQuery = mapQuery(rawQuery);

  const API_URL = `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&page=1&country=US&sort_by=RELEVANCE&product_condition=ALL&is_prime=false&deals_and_discounts=NONE`;

  try {
    const response = await fetch(API_URL, options);
    const result = await response.json();
    console.log(`🔍 Query: "${rawQuery}" → "${searchQuery}"`);
    res.json({
      success: true,
      data: result.data || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch e-commerce data', error: error.message });
  }
}));

module.exports = router; 