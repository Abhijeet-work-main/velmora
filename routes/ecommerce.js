const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');

router.get('/', asyncHandler(async (req, res) => {
  const apiKey = process.env.AMAZON_API_KEY;
  const rapidApiHost = process.env.RAPIDAPI_HOST || 'real-time-amazon-data.p.rapidapi.com';

  if (!apiKey) {
    return res.status(500).json({ success: false, error: 'Missing API key configuration' });
  }

  const query = req.query.query || 'laptop';
  const url = `https://${rapidApiHost}/search?query=${encodeURIComponent(query)}&country=US&page=1&sort_by=RELEVANCE`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': rapidApiHost,
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const result = await response.json();
    res.json({
      success: true,
      data: result.data || result,
      query: query,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('E-commerce scraping error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}));

module.exports = router; 