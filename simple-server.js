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
  console.log('✅ A user connected via WebSocket');
  
  socket.on('disconnect', () => {
    console.log('❌ User disconnected');
  });

  socket.on('scrape_request', async (data) => {
    console.log(`▶️ Received scrape request for: ${data.query}`);
    
    try {
      if (data.type === 'news') {
        // Check if API key is available
        if (!process.env.NEWS_API_KEY) {
          throw new Error('News API key not configured. Please set NEWS_API_KEY environment variable.');
        }
        
        // Use News API for real news search
        const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(data.query)}&apiKey=${process.env.NEWS_API_KEY}&language=en&sortBy=publishedAt&pageSize=20`;
        
        console.log(`🔍 Searching News API for: ${data.query}`);
        const response = await axios.get(newsApiUrl);
        
        if (response.data.status === 'ok' && response.data.articles) {
          const articles = response.data.articles.map(article => ({
            title: article.title,
            content: article.description || article.content,
            source: article.source.name,
            url: article.url,
            publishedAt: article.publishedAt,
            urlToImage: article.urlToImage
          }));
          
          socket.emit('scrape_update', {
            success: true,
            message: `Found ${articles.length} articles for "${data.query}"`,
            data: articles,
            timestamp: new Date().toISOString()
          });
          console.log(`✅ Sent ${articles.length} real news articles for: ${data.query}`);
        } else {
          throw new Error('No articles found or API response error');
        }
      } else {
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
      console.error(`❌ Error searching for "${data.query}":`, error.message);
      
      // Provide more helpful error messages
      let errorMessage = error.message;
      if (error.message.includes('API key')) {
        errorMessage = 'API configuration error. Please check environment variables on Render dashboard.';
      } else if (error.response && error.response.status === 401) {
        errorMessage = 'Invalid API key. Please check NEWS_API_KEY in environment variables.';
      } else if (error.response && error.response.status === 429) {
        errorMessage = 'API rate limit reached. Please try again later.';
      }
      
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
server.listen(PORT, () => {
  console.log(`🚀 Velmora Server running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔧 API Health: http://localhost:${PORT}/api/health`);
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