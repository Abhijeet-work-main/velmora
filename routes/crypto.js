const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const axios = require('axios');

// GET /api/scrape/crypto - Get cryptocurrency data
router.get('/', asyncHandler(async (req, res) => {
  const { symbol } = req.query;
  
  // If specific symbol requested
  if (symbol) {
    try {
      // CoinGecko API (free tier)
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${getCoinId(symbol)}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`);
      
      const coinId = getCoinId(symbol);
      const coinData = response.data[coinId];
      
      if (coinData) {
        const cryptoData = {
          symbol: symbol.toUpperCase(),
          name: getCoinName(symbol),
          price: coinData.usd,
          change: coinData.usd_24h_change || 0,
          changePercent: coinData.usd_24h_change || 0,
          marketCap: coinData.usd_market_cap || 0,
          volume24h: coinData.usd_24h_vol || 0,
          id: coinId
        };
        
        return res.json({
          success: true,
          data: cryptoData,
          timestamp: new Date().toISOString(),
          source: 'coingecko'
        });
      } else {
        return res.json({
          success: false,
          message: `Cryptocurrency "${symbol}" not found`
        });
      }
    } catch (error) {
      console.error('Crypto API error:', error.message);
      
      // Fallback to mock data
      const mockCrypto = {
        symbol: symbol.toUpperCase(),
        name: getCoinName(symbol),
        price: (Math.random() * 50000 + 1000).toFixed(2),
        change: (Math.random() * 20 - 10).toFixed(2),
        changePercent: (Math.random() * 20 - 10).toFixed(2),
        marketCap: Math.floor(Math.random() * 1000000000000),
        volume24h: Math.floor(Math.random() * 50000000000)
      };
      
      return res.json({
        success: true,
        data: mockCrypto,
        timestamp: new Date().toISOString(),
        source: 'mock'
      });
    }
  }
  
  // Default: Return popular cryptocurrencies
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
    
    const cryptoData = response.data.map(coin => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change: coin.price_change_24h,
      changePercent: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
      id: coin.id
    }));
    
    res.json({
      success: true,
      data: cryptoData,
      total: cryptoData.length,
      timestamp: new Date().toISOString(),
      source: 'coingecko'
    });
  } catch (error) {
    console.error('Crypto API error:', error.message);
    
    // Fallback to demo data
    const demoCrypto = [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 42350.75,
        change: 1250.50,
        changePercent: 3.04,
        marketCap: 829500000000,
        volume24h: 25000000000
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        price: 2485.32,
        change: -45.18,
        changePercent: -1.79,
        marketCap: 298700000000,
        volume24h: 15000000000
      },
      {
        symbol: 'BNB',
        name: 'Binance Coin',
        price: 315.67,
        change: 8.92,
        changePercent: 2.91,
        marketCap: 47200000000,
        volume24h: 2000000000
      },
      {
        symbol: 'SOL',
        name: 'Solana',
        price: 98.45,
        change: 5.23,
        changePercent: 5.61,
        marketCap: 43500000000,
        volume24h: 1800000000
      },
      {
        symbol: 'XRP',
        name: 'Ripple',
        price: 0.62,
        change: 0.05,
        changePercent: 8.76,
        marketCap: 33800000000,
        volume24h: 1200000000
      }
    ];
    
    res.json({
      success: true,
      data: demoCrypto,
      total: demoCrypto.length,
      timestamp: new Date().toISOString(),
      source: 'mock'
    });
  }
}));

// Helper function to map crypto symbols to CoinGecko IDs
function getCoinId(symbol) {
  const coinMap = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'USDT': 'tether',
    'BNB': 'binancecoin',
    'SOL': 'solana',
    'XRP': 'ripple',
    'USDC': 'usd-coin',
    'STETH': 'staked-ether',
    'ADA': 'cardano',
    'AVAX': 'avalanche-2',
    'DOGE': 'dogecoin',
    'TRX': 'tron',
    'LINK': 'chainlink',
    'TON': 'the-open-network',
    'SHIB': 'shiba-inu',
    'DOT': 'polkadot',
    'MATIC': 'matic-network',
    'UNI': 'uniswap',
    'LTC': 'litecoin',
    'BCH': 'bitcoin-cash',
    'LEO': 'leo-token',
    'NEAR': 'near',
    'ATOM': 'cosmos',
    'XLM': 'stellar',
    'XMR': 'monero',
    'ETC': 'ethereum-classic',
    'APT': 'aptos',
    'HBAR': 'hedera-hashgraph',
    'ARB': 'arbitrum',
    'FIL': 'filecoin',
    'VET': 'vechain',
    'ICP': 'internet-computer',
    'LDO': 'lido-dao',
    'CRO': 'crypto-com-chain',
    'MKR': 'maker',
    'ALGO': 'algorand',
    'QNT': 'quant-network',
    'AAVE': 'aave',
    'GRT': 'the-graph',
    'SAND': 'the-sandbox'
  };
  
  return coinMap[symbol.toUpperCase()] || symbol.toLowerCase();
}

// Helper function to get coin names
function getCoinName(symbol) {
  const names = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'USDT': 'Tether',
    'BNB': 'Binance Coin',
    'SOL': 'Solana',
    'XRP': 'Ripple',
    'USDC': 'USD Coin',
    'STETH': 'Staked Ether',
    'ADA': 'Cardano',
    'AVAX': 'Avalanche',
    'DOGE': 'Dogecoin',
    'TRX': 'TRON',
    'LINK': 'Chainlink',
    'TON': 'Toncoin',
    'SHIB': 'Shiba Inu',
    'DOT': 'Polkadot',
    'MATIC': 'Polygon',
    'UNI': 'Uniswap',
    'LTC': 'Litecoin',
    'BCH': 'Bitcoin Cash',
    'LEO': 'LEO Token',
    'NEAR': 'NEAR Protocol',
    'ATOM': 'Cosmos',
    'XLM': 'Stellar',
    'XMR': 'Monero',
    'ETC': 'Ethereum Classic',
    'APT': 'Aptos',
    'HBAR': 'Hedera',
    'ARB': 'Arbitrum',
    'FIL': 'Filecoin',
    'VET': 'VeChain',
    'ICP': 'Internet Computer',
    'LDO': 'Lido DAO',
    'CRO': 'Cronos',
    'MKR': 'Maker',
    'ALGO': 'Algorand',
    'QNT': 'Quant',
    'AAVE': 'Aave',
    'GRT': 'The Graph',
    'SAND': 'The Sandbox'
  };
  
  return names[symbol.toUpperCase()] || `${symbol.toUpperCase()} Token`;
}

module.exports = router; 