const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/scrape/stocks - Get stock market data
router.get('/', asyncHandler(async (req, res) => {
  // Demo stock data for now
  const demoStocks = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 185.92,
      change: 2.15,
      changePercent: 1.17,
      volume: 45820000
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 132.48,
      change: -1.22,
      changePercent: -0.91,
      volume: 28350000
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 378.85,
      change: 4.23,
      changePercent: 1.13,
      volume: 32150000
    }
  ];

  res.json({
    success: true,
    data: demoStocks,
    total: demoStocks.length,
    timestamp: new Date().toISOString()
  });
}));

module.exports = router; 