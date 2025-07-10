const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/scrape/crypto - Get cryptocurrency data
router.get('/', asyncHandler(async (req, res) => {
  // Demo crypto data for now
  const demoCrypto = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 42350.75,
      change: 1250.50,
      changePercent: 3.04,
      marketCap: 829500000000
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2485.32,
      change: -45.18,
      changePercent: -1.79,
      marketCap: 298700000000
    },
    {
      symbol: 'BNB',
      name: 'Binance Coin',
      price: 315.67,
      change: 8.92,
      changePercent: 2.91,
      marketCap: 47200000000
    }
  ];

  res.json({
    success: true,
    data: demoCrypto,
    total: demoCrypto.length,
    timestamp: new Date().toISOString()
  });
}));

module.exports = router; 