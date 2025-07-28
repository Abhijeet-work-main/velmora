const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for simplicity
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Test route
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-search.html'));
});

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

// Helper function to get realistic stock data (current market values)
function getRealisticStockData(symbol) {
  const realisticStocks = {
    'AAPL': {
      price: 195.89,
      change: 2.34,
      changePercent: 1.21,
      volume: 45230000,
      marketCap: 3020000000000,
      dayLow: 194.12,
      dayHigh: 197.45,
      yearLow: 164.08,
      yearHigh: 199.62,
      pe: 29.85,
      eps: 6.57
    },
    'GOOGL': {
      price: 151.75,
      change: -1.23,
      changePercent: -0.80,
      volume: 28450000,
      marketCap: 1870000000000,
      dayLow: 150.89,
      dayHigh: 153.12,
      yearLow: 129.40,
      yearHigh: 191.75,
      pe: 25.67,
      eps: 5.91
    },
    'MSFT': {
      price: 414.23,
      change: 3.78,
      changePercent: 0.92,
      volume: 18920000,
      marketCap: 3080000000000,
      dayLow: 412.56,
      dayHigh: 416.89,
      yearLow: 362.90,
      yearHigh: 468.35,
      pe: 32.14,
      eps: 12.89
    },
    'TSLA': {
      price: 411.05,
      change: 15.67,
      changePercent: 3.96,
      volume: 67890000,
      marketCap: 1310000000000,
      dayLow: 405.23,
      dayHigh: 415.78,
      yearLow: 138.80,
      yearHigh: 488.54,
      pe: 89.23,
      eps: 4.61
    },
    'AMZN': {
      price: 218.34,
      change: -2.12,
      changePercent: -0.96,
      volume: 34560000,
      marketCap: 2290000000000,
      dayLow: 217.45,
      dayHigh: 221.67,
      yearLow: 139.52,
      yearHigh: 231.20,
      pe: 42.78,
      eps: 5.10
    }
  };

  const stockData = realisticStocks[symbol] || {
    price: (Math.random() * 300 + 50).toFixed(2),
    change: (Math.random() * 20 - 10).toFixed(2),
    changePercent: (Math.random() * 5 - 2.5).toFixed(2),
    volume: Math.floor(Math.random() * 50000000),
    marketCap: Math.floor(Math.random() * 1000000000000),
    dayLow: (Math.random() * 300 + 40).toFixed(2),
    dayHigh: (Math.random() * 300 + 60).toFixed(2),
    yearLow: (Math.random() * 200 + 30).toFixed(2),
    yearHigh: (Math.random() * 400 + 80).toFixed(2),
    pe: (Math.random() * 50 + 10).toFixed(2),
    eps: (Math.random() * 15 + 1).toFixed(2)
  };

  return {
    symbol: symbol,
    name: getCompanyName(symbol),
    price: stockData.price.toString(),
    change: stockData.change.toString(),
    changePercent: stockData.changePercent.toString(),
    volume: stockData.volume,
    marketCap: stockData.marketCap,
    dayLow: stockData.dayLow.toString(),
    dayHigh: stockData.dayHigh.toString(),
    yearLow: stockData.yearLow.toString(),
    yearHigh: stockData.yearHigh.toString(),
    pe: stockData.pe.toString(),
    eps: stockData.eps.toString()
  };
}

// Helper function to map crypto symbols to CoinGecko IDs
function getCoinId(symbol) {
  const coinMap = {
    'BTC': 'bitcoin',
    'BITCOIN': 'bitcoin',
    'ETH': 'ethereum',
    'ETHEREUM': 'ethereum',
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
    'BITCOIN': 'Bitcoin',
    'ETH': 'Ethereum',
    'ETHEREUM': 'Ethereum',
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

// Helper function to get realistic crypto data (current market values)
function getRealisticCryptoData(symbol) {
  const realisticCrypto = {
    'BTC': {
      price: 104750.23,
      change: 2350.67,
      changePercent: 2.29,
      marketCap: 2080000000000,
      volume24h: 35400000000
    },
    'BITCOIN': {
      price: 104750.23,
      change: 2350.67,
      changePercent: 2.29,
      marketCap: 2080000000000,
      volume24h: 35400000000
    },
    'ETH': {
      price: 3456.78,
      change: -89.23,
      changePercent: -2.52,
      marketCap: 415600000000,
      volume24h: 18200000000
    },
    'ETHEREUM': {
      price: 3456.78,
      change: -89.23,
      changePercent: -2.52,
      marketCap: 415600000000,
      volume24h: 18200000000
    },
    'BNB': {
      price: 687.45,
      change: 23.67,
      changePercent: 3.56,
      marketCap: 99500000000,
      volume24h: 1800000000
    },
    'SOL': {
      price: 218.93,
      change: 12.45,
      changePercent: 6.03,
      marketCap: 103200000000,
      volume24h: 3200000000
    },
    'XRP': {
      price: 2.34,
      change: 0.18,
      changePercent: 8.33,
      marketCap: 134500000000,
      volume24h: 4100000000
    },
    'ADA': {
      price: 1.08,
      change: 0.05,
      changePercent: 4.85,
      marketCap: 38800000000,
      volume24h: 980000000
    },
    'DOGE': {
      price: 0.34,
      change: 0.02,
      changePercent: 6.25,
      marketCap: 50200000000,
      volume24h: 2300000000
    },
    'AVAX': {
      price: 41.67,
      change: 1.23,
      changePercent: 3.04,
      marketCap: 16800000000,
      volume24h: 780000000
    },
    'LINK': {
      price: 23.89,
      change: -0.67,
      changePercent: -2.73,
      marketCap: 15100000000,
      volume24h: 890000000
    }
  };

  const cryptoData = realisticCrypto[symbol] || {
    price: (Math.random() * 100 + 10).toFixed(2),
    change: (Math.random() * 20 - 10).toFixed(2),
    changePercent: (Math.random() * 20 - 10).toFixed(2),
    marketCap: Math.floor(Math.random() * 100000000000),
    volume24h: Math.floor(Math.random() * 5000000000)
  };

  return {
    symbol: symbol,
    name: getCoinName(symbol),
    price: parseFloat(cryptoData.price),
    change: parseFloat(cryptoData.change),
    changePercent: parseFloat(cryptoData.changePercent),
    marketCap: cryptoData.marketCap,
    volume24h: cryptoData.volume24h,
    id: getCoinId(symbol)
  };
}

// Mock data for demo
const mockNews = [
  {
    id: 1,
    title: "Breaking: Tech Industry Sees Major Innovation",
    content: "The technology sector continues to evolve with groundbreaking innovations...",
    source: "TechNews",
    url: "https://example.com/news/1",
    publishedAt: new Date().toISOString(),
    category: "technology"
  },
  {
    id: 2,
    title: "Market Update: Stocks Show Positive Trend",
    content: "Financial markets are showing promising signs of recovery...",
    source: "FinanceDaily",
    url: "https://example.com/news/2",
    publishedAt: new Date().toISOString(),
    category: "finance"
  }
];

const mockStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 185.92, change: 2.15, changePercent: 1.17 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 132.48, change: -1.22, changePercent: -0.91 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.85, change: 4.23, changePercent: 1.13 }
];

const mockCrypto = [
  { symbol: 'BTC', name: 'Bitcoin', price: 42350.75, change: 1250.50, changePercent: 3.04 },
  { symbol: 'ETH', name: 'Ethereum', price: 2485.32, change: -45.18, changePercent: -1.79 },
  { symbol: 'BNB', name: 'Binance Coin', price: 315.67, change: 8.92, changePercent: 2.91 }
];

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('✅ A user connected via WebSocket', socket.id);
  
  socket.on('disconnect', () => {
    console.log('❌ User disconnected', socket.id);
  });

  socket.on('scrape_request', async (data) => {
    console.log(`▶️ [DEBUG] Received scrape request:`, JSON.stringify(data, null, 2));
    console.log(`▶️ [DEBUG] Socket ID: ${socket.id}`);
    console.log(`▶️ [DEBUG] Environment check - NEWS_API_KEY exists: ${!!process.env.NEWS_API_KEY}`);
    
    try {
      if (data.type === 'news') {
        // Check if API key is available
        if (!process.env.NEWS_API_KEY) {
          console.log('❌ [DEBUG] NEWS_API_KEY is missing!');
          throw new Error('News API key not configured. Please set NEWS_API_KEY environment variable.');
        }
        
        console.log(`🔍 [DEBUG] NEWS_API_KEY found: ${process.env.NEWS_API_KEY.substring(0, 8)}...`);
        
        // Use News API for real news search
        const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(data.query)}&apiKey=${process.env.NEWS_API_KEY}&language=en&sortBy=publishedAt&pageSize=20`;
        
        console.log(`🔍 [DEBUG] Making API request to: ${newsApiUrl.replace(process.env.NEWS_API_KEY, 'API_KEY_HIDDEN')}`);
        const response = await axios.get(newsApiUrl);
        
        console.log(`📡 [DEBUG] API Response status: ${response.status}`);
        console.log(`📡 [DEBUG] API Response data keys: ${Object.keys(response.data)}`);
        
        if (response.data.status === 'ok' && response.data.articles) {
          const articles = response.data.articles.map(article => ({
            title: article.title,
            content: article.description || article.content,
            source: article.source.name,
            url: article.url,
            publishedAt: article.publishedAt,
            urlToImage: article.urlToImage
          }));
          
          console.log(`✅ [DEBUG] Processed ${articles.length} articles, emitting to socket ${socket.id}`);
          
          socket.emit('scrape_update', {
            success: true,
            message: `Found ${articles.length} articles for "${data.query}"`,
            data: articles,
            timestamp: new Date().toISOString()
          });
          console.log(`✅ Sent ${articles.length} real news articles for: ${data.query}`);
        } else {
          console.log(`❌ [DEBUG] API response indicates no articles or error:`, response.data);
          throw new Error('No articles found or API response error');
        }
      } else {
        console.log(`📝 [DEBUG] Non-news request, sending mock data for: ${data.query}`);
        // Fallback for other types
        const mockResult = {
          success: true,
          message: `Scraping for "${data.query}" completed.`,
          data: [
            { title: `Results for '${data.query}'`, content: 'Mock content for non-news searches...', source: 'Demo' }
          ],
          timestamp: new Date().toISOString()
        };
        
        socket.emit('scrape_update', mockResult);
        console.log(`✅ Sent mock results for: ${data.query}`);
      }
    } catch (error) {
      console.error(`❌ [DEBUG] Error in scrape_request handler:`, error);
      console.error(`❌ [DEBUG] Error stack:`, error.stack);
      
      // Provide more helpful error messages
      let errorMessage = error.message;
      if (error.message.includes('API key')) {
        errorMessage = 'API configuration error. Please check environment variables on Render dashboard.';
      } else if (error.response && error.response.status === 401) {
        errorMessage = 'Invalid API key. Please check NEWS_API_KEY in environment variables.';
        console.log(`❌ [DEBUG] API returned 401 - Invalid API key`);
      } else if (error.response && error.response.status === 429) {
        errorMessage = 'API rate limit reached. Please try again later.';
        console.log(`❌ [DEBUG] API returned 429 - Rate limit exceeded`);
      }
      
      console.log(`📤 [DEBUG] Emitting error response to socket ${socket.id}: ${errorMessage}`);
      
      socket.emit('scrape_update', {
        success: false,
        message: `Error searching for "${data.query}": ${errorMessage}`,
        data: [],
        timestamp: new Date().toISOString()
      });
    }
  });
  
  socket.on('custom_scrape_request', async (data) => {
    console.log(`▶️ Received custom scrape request for URL: ${data.url}`);
    
    try {
      // Check if Puppeteer is available (for local development)
      let usePuppeteer = false;
      try {
        require.resolve('puppeteer');
        usePuppeteer = process.env.NODE_ENV !== 'production'; // Only use locally
      } catch (e) {
        usePuppeteer = false;
      }

      if (usePuppeteer) {
        // Use Puppeteer for local development
        const puppeteer = require('puppeteer');
        
        const browser = await puppeteer.launch({
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.goto(data.url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Extract content automatically
        const result = await page.evaluate(() => {
          const title = document.title || document.querySelector('h1')?.textContent || 'No title found';
          
          const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
            .map(h => h.textContent.trim())
            .filter(text => text.length > 0)
            .slice(0, 10);
          
          const links = Array.from(document.querySelectorAll('a[href]'))
            .map(a => ({
              text: a.textContent.trim(),
              href: a.href
            }))
            .filter(link => link.text.length > 0)
            .slice(0, 10);
          
          const paragraphs = Array.from(document.querySelectorAll('p'))
            .map(p => p.textContent.trim())
            .filter(text => text.length > 0)
            .slice(0, 5);
          
          return { title, headings, links, paragraphs };
        });
        
        await browser.close();
        
        socket.emit('custom_scrape_update', {
          success: true,
          message: `Successfully scraped content from ${data.url}`,
          data: result,
          url: data.url,
          timestamp: new Date().toISOString()
        });
        
        console.log(`✅ Successfully scraped: ${data.url}`);
      } else {
        // Fallback for production (Render) - use simple HTTP request
        const response = await axios.get(data.url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        const cheerio = require('cheerio');
        const $ = cheerio.load(response.data);
        
        const result = {
          title: $('title').text() || $('h1').first().text() || 'No title found',
          headings: $('h1, h2, h3, h4, h5, h6').map((i, el) => $(el).text().trim()).get().filter(text => text.length > 0).slice(0, 10),
          links: $('a[href]').map((i, el) => ({
            text: $(el).text().trim(),
            href: $(el).attr('href')
          })).get().filter(link => link.text.length > 0).slice(0, 10),
          paragraphs: $('p').map((i, el) => $(el).text().trim()).get().filter(text => text.length > 0).slice(0, 5)
        };
        
        socket.emit('custom_scrape_update', {
          success: true,
          message: `Successfully scraped content from ${data.url} (HTTP method)`,
          data: result,
          url: data.url,
          timestamp: new Date().toISOString()
        });
        
        console.log(`✅ Successfully scraped: ${data.url} (HTTP method)`);
      }
      
    } catch (error) {
      console.error(`❌ Error scraping "${data.url}":`, error.message);
      
      socket.emit('custom_scrape_update', {
        success: false,
        message: `Error scraping ${data.url}: ${error.message}`,
        data: null,
        url: data.url,
        timestamp: new Date().toISOString()
      });
    }
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api/news', (req, res) => {
  const { category, search, limit = 10 } = req.query;
  let filteredNews = [...mockNews];
  
  if (category) {
    filteredNews = filteredNews.filter(article => article.category === category);
  }
  
  if (search) {
    filteredNews = filteredNews.filter(article => 
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.content.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json({
    success: true,
    data: filteredNews.slice(0, parseInt(limit)),
    total: filteredNews.length,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/scrape/stocks', async (req, res) => {
  const { symbol } = req.query;
  
  // If specific symbol requested
  if (symbol) {
    console.log(`🔍 Stock search for: ${symbol.toUpperCase()}`);
    
    try {
      const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY || '0WUJUVGG9P5J9R9L';
      
      console.log(`🔑 Using Alpha Vantage API key: ${ALPHA_VANTAGE_KEY.substring(0, 8)}...`);
      
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol.toUpperCase(),
          apikey: ALPHA_VANTAGE_KEY
        },
        timeout: 15000
      });
      
      console.log(`📈 Alpha Vantage response for ${symbol}:`, JSON.stringify(response.data, null, 2));
      
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
          yearLow: parseFloat(quote['04. low']).toFixed(2),
          yearHigh: parseFloat(quote['03. high']).toFixed(2),
          marketCap: 0,
          pe: 0,
          eps: 0
        };
        
        console.log(`✅ Returning single stock data for ${symbol}:`, stockData);
        
        return res.json({
          success: true,
          data: stockData,
          timestamp: new Date().toISOString(),
          source: 'alphavantage'
        });
      } else {
        console.log('❌ No valid quote data from Alpha Vantage, using realistic mock data');
      }
    } catch (error) {
      console.error('❌ Stock API error:', error.message);
    }

    // Fallback to realistic mock data for specific symbol
    const stockData = getRealisticStockData(symbol.toUpperCase());
    
    console.log(`🎯 Returning realistic mock data for ${symbol}:`, stockData);
    
    return res.json({
      success: true,
      data: stockData,
      timestamp: new Date().toISOString(),
      source: 'mock_realistic'
    });
  }
  
  // Default: Return popular stocks array
  try {
    // Using Alpha Vantage API for real stock data
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
    const stockPromises = symbols.map(async (symbol) => {
      try {
        const response = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`);
        const quote = response.data['Global Quote'];
        
        if (quote) {
          return {
            symbol: quote['01. symbol'],
            name: quote['01. symbol'], // Alpha Vantage doesn't provide company name in this endpoint
            price: parseFloat(quote['05. price']),
            change: parseFloat(quote['09. change']),
            changePercent: parseFloat(quote['10. change percent'].replace('%', ''))
          };
        }
        return null;
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error.message);
        return null;
      }
    });
    
    const stockData = (await Promise.all(stockPromises)).filter(stock => stock !== null);
    
    if (stockData.length > 0) {
      res.json({
        success: true,
        data: stockData,
        timestamp: new Date().toISOString()
      });
    } else {
      // Fallback to mock data if API fails
      res.json({
        success: true,
        data: mockStocks,
        message: 'Using mock data - API limit reached',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Stocks API error:', error.message);
    res.json({
      success: true,
      data: mockStocks,
      message: 'Using mock data - API error',
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/scrape/crypto', async (req, res) => {
  const { symbol } = req.query;
  
  // If specific symbol requested
  if (symbol) {
    console.log(`🔍 Crypto search for: ${symbol.toUpperCase()}`);
    
    try {
      const coinId = getCoinId(symbol);
      console.log(`🪙 Coin ID for ${symbol}: ${coinId}`);
      
      const COINGECKO_API_KEY = process.env.COINAPI_KEY || 'CG-bvtn12g3rGFTG5j3WFfoVEQV';
      
      console.log(`🔑 Using CoinGecko API key: ${COINGECKO_API_KEY.substring(0, 8)}...`);
      
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
        params: {
          ids: coinId,
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_market_cap: true,
          include_24hr_vol: true
        },
        headers: {
          'x-cg-demo-api-key': COINGECKO_API_KEY
        },
        timeout: 15000
      });
      
      console.log(`₿ CoinGecko response for ${symbol}:`, JSON.stringify(response.data, null, 2));
      const coinData = response.data[coinId];
      
      if (coinData && coinData.usd) {
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
        
        console.log(`✅ Returning single crypto data for ${symbol}:`, cryptoData);
        
        return res.json({
          success: true,
          data: cryptoData,
          timestamp: new Date().toISOString(),
          source: 'coingecko'
        });
      } else {
        console.log('❌ No valid coin data from CoinGecko, using realistic mock data');
      }
    } catch (error) {
      console.error('❌ Crypto API error:', error.message);
    }

    // Fallback to realistic mock data for specific symbol
    const cryptoData = getRealisticCryptoData(symbol.toUpperCase());
    
    console.log(`🎯 Returning realistic mock data for ${symbol}:`, cryptoData);
    
    return res.json({
      success: true,
      data: cryptoData,
      timestamp: new Date().toISOString(),
      source: 'mock_realistic'
    });
  }
  
  // Default: Return popular crypto array
  try {
    // Using CoinGecko API for real crypto data
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,cardano,solana&vs_currencies=usd&include_24hr_change=true', {
      headers: {
        'x-cg-demo-api-key': process.env.COINAPI_KEY
      }
    });
    
    const cryptoData = [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: response.data.bitcoin.usd,
        change: response.data.bitcoin.usd_24h_change,
        changePercent: response.data.bitcoin.usd_24h_change
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        price: response.data.ethereum.usd,
        change: response.data.ethereum.usd_24h_change,
        changePercent: response.data.ethereum.usd_24h_change
      },
      {
        symbol: 'BNB',
        name: 'Binance Coin',
        price: response.data.binancecoin.usd,
        change: response.data.binancecoin.usd_24h_change,
        changePercent: response.data.binancecoin.usd_24h_change
      },
      {
        symbol: 'ADA',
        name: 'Cardano',
        price: response.data.cardano.usd,
        change: response.data.cardano.usd_24h_change,
        changePercent: response.data.cardano.usd_24h_change
      },
      {
        symbol: 'SOL',
        name: 'Solana',
        price: response.data.solana.usd,
        change: response.data.solana.usd_24h_change,
        changePercent: response.data.solana.usd_24h_change
      }
    ];
    
    res.json({
      success: true,
      data: cryptoData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Crypto API error:', error.message);
    res.json({
      success: true,
      data: mockCrypto,
      message: 'Using mock data - API error',
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/weather', async (req, res) => {
  try {
    const { city = 'New York' } = req.query;
    
    // Using OpenWeather API for real weather data
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`);
    
    const weatherData = {
      location: `${response.data.name}, ${response.data.sys.country}`,
      temperature: Math.round(response.data.main.temp),
      condition: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      windSpeed: Math.round(response.data.wind.speed * 3.6), // Convert m/s to km/h
      icon: response.data.weather[0].icon,
      forecast: [
        { day: 'Today', high: Math.round(response.data.main.temp_max), low: Math.round(response.data.main.temp_min), condition: response.data.weather[0].description }
      ]
    };
    
    res.json({
      success: true,
      data: weatherData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Weather API error:', error.message);
    
    const mockWeather = {
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
      data: mockWeather,
      message: 'Using mock data - API error',
      timestamp: new Date().toISOString()
    });
  }
});

// E-commerce scraping endpoint
app.get('/api/scrape/ecommerce', async (req, res) => {
  try {
    const apikey = process.env.AMAZON_API_KEY;
    const rapidApiHost = process.env.RAPIDAPI_HOST;
    
    if (!apikey || !rapidApiHost) {
      throw new Error('Amazon API credentials not configured');
    }
    
    // Synonym mapping for better search results
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
    
    const rawQuery = req.query.query || 'Phone';
    const searchQuery = mapQuery(rawQuery);
    
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apikey,
        'X-RapidAPI-Host': rapidApiHost,
      }
    };
    
    const API_URL = `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&page=1&country=US&sort_by=RELEVANCE&product_condition=ALL&is_prime=false&deals_and_discounts=NONE`;
    
    const response = await fetch(API_URL, options);
    const result = await response.json();
    
    console.log(`🔍 E-commerce Query: "${rawQuery}" → "${searchQuery}"`);
    
    res.json({
      success: true,
      data: result.data || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('E-commerce API error:', error.message);
    
    // Mock ecommerce data as fallback
    const mockEcommerce = [
      {
        product_title: "iPhone 15 Pro Max",
        product_price: "1199.00",
        asin: "B0C1234567",
        product_photo: "https://example.com/iphone.jpg"
      },
      {
        product_title: "Samsung Galaxy S24",
        product_price: "999.00", 
        asin: "B0C7654321",
        product_photo: "https://example.com/samsung.jpg"
      }
    ];
    
    res.json({
      success: true,
      data: mockEcommerce,
      message: 'Using mock data - API error',
      timestamp: new Date().toISOString()
    });
  }
});

// Custom scraping endpoint
app.post('/api/scrape/custom', (req, res) => {
  const { url, selectors } = req.body;
  
  // Mock response for custom scraping
  res.json({
    success: true,
    message: 'Custom scraping endpoint - demo mode',
    data: {
      url,
      selectors,
      extracted: {
        title: 'Demo Title',
        content: 'Demo content extracted',
        timestamp: new Date().toISOString()
      }
    }
  });
});

// Bulk scraping endpoint
app.post('/api/scrape/bulk', (req, res) => {
  const { urls } = req.body;
  
  res.json({
    success: true,
    message: 'Bulk scraping endpoint - demo mode',
    data: {
      urls,
      results: urls.map(url => ({
        url,
        status: 'completed',
        data: { title: 'Demo Title', content: 'Demo content' }
      }))
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    timestamp: new Date().toISOString()
  });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Velmora Server running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔧 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 API Keys loaded: ${!!process.env.NEWS_API_KEY ? '✅' : '❌'}`);
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
}); 