const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/weather - Get weather information
router.get('/', asyncHandler(async (req, res) => {
  const demoWeather = {
    location: 'New York, NY',
    temperature: 22,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    forecast: [
      { day: 'Today', high: 24, low: 18, condition: 'Partly Cloudy' },
      { day: 'Tomorrow', high: 26, low: 20, condition: 'Sunny' },
      { day: 'Wednesday', high: 23, low: 17, condition: 'Rainy' }
    ]
  };

  res.json({
    success: true,
    data: demoWeather,
    timestamp: new Date().toISOString()
  });
}));

module.exports = router; 