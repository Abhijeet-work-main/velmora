const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const axios = require('axios');

// GET /api/scrape/stocks - Get stock market data
router.get('/', asyncHandler(async (req, res) => {
  const { symbol } = req.query;
  
  // If specific symbol requested
  if (symbol) {
    try {
      if (!process.env.ALPHA_VANTAGE_API_KEY) {
        // Return mock data if no API key
        const mockStock = {
          symbol: symbol.toUpperCase(),
          name: getCompanyName(symbol.toUpperCase()),
          price: (Math.random() * 200 + 50).toFixed(2),
          change: (Math.random() * 10 - 5).toFixed(2),
          changePercent: (Math.random() * 5 - 2.5).toFixed(2),
          volume: Math.floor(Math.random() * 50000000),
          marketCap: Math.floor(Math.random() * 1000000000000),
          dayLow: (Math.random() * 200 + 50).toFixed(2),
          dayHigh: (Math.random() * 200 + 50).toFixed(2),
          yearLow: (Math.random() * 200 + 50).toFixed(2),
          yearHigh: (Math.random() * 200 + 50).toFixed(2),
          pe: (Math.random() * 30 + 5).toFixed(2),
          eps: (Math.random() * 10).toFixed(2)
        };
        
        return res.json({
          success: true,
          data: mockStock,
          timestamp: new Date().toISOString(),
          source: 'mock'
        });
      }

      // Real API call to Alpha Vantage
      const response = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`);
      const quote = response.data['Global Quote'];
      
      if (quote && quote['01. symbol']) {
        const stockData = {
          symbol: quote['01. symbol'],
          name: getCompanyName(quote['01. symbol']),
          price: parseFloat(quote['05. price']).toFixed(2),
          change: parseFloat(quote['09. change']).toFixed(2),
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')).toFixed(2),
          volume: parseInt(quote['06. volume']),
          dayLow: parseFloat(quote['04. low']).toFixed(2),
          dayHigh: parseFloat(quote['03. high']).toFixed(2),
          yearLow: parseFloat(quote['04. low']).toFixed(2), // Approximation
          yearHigh: parseFloat(quote['03. high']).toFixed(2), // Approximation
          marketCap: 0, // Would need additional API call
          pe: 0, // Would need additional API call
          eps: 0 // Would need additional API call
        };
        
        return res.json({
          success: true,
          data: stockData,
          timestamp: new Date().toISOString(),
          source: 'alphavantage'
        });
      } else {
        return res.json({
          success: false,
          message: `Stock symbol "${symbol}" not found`
        });
      }
    } catch (error) {
      console.error('Stock API error:', error.message);
      return res.json({
        success: false,
        message: 'Failed to fetch stock data'
      });
    }
  }
  
  // Default: Return popular stocks
  const popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
  const stockPromises = popularStocks.map(symbol => {
    return new Promise(async (resolve) => {
      try {
        if (!process.env.ALPHA_VANTAGE_API_KEY) {
          resolve({
            symbol: symbol,
            name: getCompanyName(symbol),
            price: (Math.random() * 200 + 50).toFixed(2),
            change: (Math.random() * 10 - 5).toFixed(2),
            changePercent: (Math.random() * 5 - 2.5).toFixed(2),
            volume: Math.floor(Math.random() * 50000000)
          });
          return;
        }
        
        const response = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`);
        const quote = response.data['Global Quote'];
        
        if (quote && quote['01. symbol']) {
          resolve({
            symbol: quote['01. symbol'],
            name: getCompanyName(quote['01. symbol']),
            price: parseFloat(quote['05. price']).toFixed(2),
            change: parseFloat(quote['09. change']).toFixed(2),
            changePercent: parseFloat(quote['10. change percent'].replace('%', '')).toFixed(2),
            volume: parseInt(quote['06. volume'])
          });
        } else {
          resolve(null);
        }
      } catch (error) {
        resolve(null);
      }
    });
  });
  
  const stockData = (await Promise.all(stockPromises)).filter(stock => stock !== null);
  
  res.json({
    success: true,
    data: stockData,
    total: stockData.length,
    timestamp: new Date().toISOString()
  });
}));

// Helper function to get company names
function getCompanyName(symbol) {
  const companies = {
    'AAPL': 'Apple Inc.',
    'GOOGL': 'Alphabet Inc.',
    'MSFT': 'Microsoft Corporation',
    'AMZN': 'Amazon.com Inc.',
    'TSLA': 'Tesla Inc.',
    'META': 'Meta Platforms Inc.',
    'NVDA': 'NVIDIA Corporation',
    'BRK.A': 'Berkshire Hathaway Inc.',
    'JNJ': 'Johnson & Johnson',
    'V': 'Visa Inc.',
    'WMT': 'Walmart Inc.',
    'PG': 'Procter & Gamble Co.',
    'UNH': 'UnitedHealth Group Inc.',
    'MA': 'Mastercard Inc.',
    'HD': 'Home Depot Inc.',
    'DIS': 'Walt Disney Co.',
    'PYPL': 'PayPal Holdings Inc.',
    'BAC': 'Bank of America Corp.',
    'NFLX': 'Netflix Inc.',
    'ADBE': 'Adobe Inc.',
    'CRM': 'Salesforce Inc.',
    'XOM': 'Exxon Mobil Corp.',
    'TMO': 'Thermo Fisher Scientific Inc.',
    'VZ': 'Verizon Communications Inc.',
    'ABBV': 'AbbVie Inc.',
    'KO': 'Coca-Cola Co.',
    'PFE': 'Pfizer Inc.',
    'INTC': 'Intel Corporation',
    'CSCO': 'Cisco Systems Inc.',
    'PEP': 'PepsiCo Inc.'
  };
  
  return companies[symbol.toUpperCase()] || `${symbol.toUpperCase()} Corporation`;
}

module.exports = router; 