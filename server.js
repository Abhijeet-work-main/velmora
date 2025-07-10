const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

// Import modules
const newsScraperRoutes = require('./routes/news');
const stockScraperRoutes = require('./routes/stocks');
const cryptoScraperRoutes = require('./routes/crypto');
const ecommerceScraperRoutes = require('./routes/ecommerce');
const socialScraperRoutes = require('./routes/social');
const weatherRoutes = require('./routes/weather');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const schedulerRoutes = require('./routes/scheduler');

// Import middleware
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Basic middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://api.coingecko.com", "https://newsapi.org"]
    }
  }
}));

app.use(compression());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 * 1000
  }
});

const scrapingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 scraping requests per minute
  message: {
    error: 'Too many scraping requests, please try again later.',
    retryAfter: 60 * 1000
  }
});

app.use('/api/', limiter);
app.use('/api/scrape/', scrapingLimiter);

// Serve static files
app.use(express.static('public'));

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  socket.on('subscribe_to_updates', (dataType) => {
    socket.join(dataType);
    logger.info(`Client ${socket.id} subscribed to ${dataType} updates`);
  });
  
  socket.on('unsubscribe_from_updates', (dataType) => {
    socket.leave(dataType);
    logger.info(`Client ${socket.id} unsubscribed from ${dataType} updates`);
  });
  
  // Handle scrape requests from frontend
  socket.on('scrape_request', async (data) => {
    logger.info(`Scrape request received: ${JSON.stringify(data)}`);
    
    try {
      const { type, query, category, source } = data;
      
      if (type === 'news') {
        const newsScraperService = require('./services/newsScraper');
        const newsData = await newsScraperService.scrapeNews({
          keywords: query,
          category: category || 'general',
          sources: source ? [source] : ['bbc', 'cnn', 'reuters', 'guardian', 'techcrunch'],
          limit: 20
        });
        
        socket.emit('scrape_update', {
          success: true,
          data: newsData,
          message: `Found ${newsData.length} articles for "${query}"`,
          type: 'news'
        });
      } else {
        socket.emit('scrape_update', {
          success: false,
          message: `Scraping type "${type}" not implemented yet`,
          type: type
        });
      }
    } catch (error) {
      logger.error('Scrape request error:', error);
      socket.emit('scrape_update', {
        success: false,
        message: `Error: ${error.message}`,
        type: data.type
      });
    }
  });
  
  // Handle custom scrape requests
  socket.on('custom_scrape_request', async (data) => {
    logger.info(`Custom scrape request received: ${JSON.stringify(data)}`);
    
    try {
      const { url } = data;
      
      if (!url) {
        socket.emit('custom_scrape_update', {
          success: false,
          message: 'URL is required for custom scraping'
        });
        return;
      }
      
      // Auto-detect content selectors
      const autoSelectors = {
        title: 'h1, title, .title, .headline, .post-title',
        headings: 'h1, h2, h3, h4, h5, h6',
        links: 'a[href]',
        paragraphs: 'p',
        images: 'img[src]'
      };
      
      const scrapeCustom = require('./services/customScraper');
      const result = await scrapeCustom(url, autoSelectors);
      
      // Format the result for better display
      const formattedResult = {
        title: result.title || 'No title found',
        headings: result.headings ? result.headings.split('\n').filter(h => h.trim()) : [],
        links: result.links ? result.links.split('\n').filter(l => l.trim()).map(link => ({
          text: link.trim(),
          href: link.trim().startsWith('http') ? link.trim() : url + link.trim()
        })) : [],
        paragraphs: result.paragraphs ? result.paragraphs.split('\n').filter(p => p.trim()) : []
      };
      
      socket.emit('custom_scrape_update', {
        success: true,
        data: formattedResult,
        message: `Successfully scraped content from ${url}`,
        url: url
      });
      
    } catch (error) {
      logger.error('Custom scrape request error:', error);
      socket.emit('custom_scrape_update', {
        success: false,
        message: `Error scraping ${data.url}: ${error.message}`,
        url: data.url
      });
    }
  });
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Make io available to routes
app.set('io', io);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/scrape/news', newsScraperRoutes);
app.use('/api/scrape/stocks', stockScraperRoutes);
app.use('/api/scrape/crypto', cryptoScraperRoutes);
app.use('/api/scrape/ecommerce', ecommerceScraperRoutes);
app.use('/api/scrape/social', socialScraperRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/scheduler', authMiddleware, schedulerRoutes);

// API Documentation
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Velmora Web Scraper API',
    version: '1.0.0',
    description: 'Advanced multi-functional web scraper with real-time data aggregation',
    endpoints: {
      authentication: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login user',
        'POST /api/auth/logout': 'Logout user',
        'GET /api/auth/verify': 'Verify JWT token'
      },
      scraping: {
        'GET /api/scrape/news': 'Get latest news from multiple sources',
        'GET /api/scrape/stocks': 'Get stock market data',
        'GET /api/scrape/crypto': 'Get cryptocurrency data',
        'GET /api/scrape/ecommerce': 'Scrape e-commerce product data',
        'GET /api/scrape/social': 'Scrape social media posts',
        'POST /api/scrape/custom': 'Custom scraping with CSS selectors'
      },
      data: {
        'GET /api/weather': 'Get weather information',
        'GET /api/scheduler/jobs': 'Get scheduled scraping jobs',
        'POST /api/scheduler/jobs': 'Create new scheduled job'
      },
      user: {
        'GET /api/user/profile': 'Get user profile',
        'PUT /api/user/profile': 'Update user profile',
        'GET /api/user/saved': 'Get saved items',
        'POST /api/user/saved': 'Save item'
      }
    }
  });
});

// Serve main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Custom scraping endpoint
app.post('/api/scrape/custom', async (req, res) => {
  try {
    const { url, selectors, options = {} } = req.body;
    
    if (!url || !selectors) {
      return res.status(400).json({
        error: 'URL and selectors are required',
        example: {
          url: 'https://example.com',
          selectors: {
            title: 'h1',
            price: '.price',
            description: '.description'
          }
        }
      });
    }

    const scrapeCustom = require('./services/customScraper');
    const result = await scrapeCustom(url, selectors, options);
    
    // Emit real-time update
    req.app.get('io').emit('scrape_update', {
      type: 'custom',
      data: result,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      source: url
    });
    
  } catch (error) {
    logger.error('Custom scraping error:', error);
    res.status(500).json({
      error: 'Scraping failed',
      message: error.message
    });
  }
});

// Bulk scraping endpoint
app.post('/api/scrape/bulk', async (req, res) => {
  try {
    const { urls, selectors, options = {} } = req.body;
    
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        error: 'URLs array is required',
        example: {
          urls: ['https://example1.com', 'https://example2.com'],
          selectors: {
            title: 'h1',
            content: '.content'
          }
        }
      });
    }

    const scrapeCustom = require('./services/customScraper');
    const results = [];
    
    for (const url of urls) {
      try {
        const result = await scrapeCustom(url, selectors, options);
        results.push({
          url,
          success: true,
          data: result
        });
      } catch (error) {
        results.push({
          url,
          success: false,
          error: error.message
        });
      }
    }
    
    res.json({
      success: true,
      results,
      total: urls.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Bulk scraping error:', error);
    res.status(500).json({
      error: 'Bulk scraping failed',
      message: error.message
    });
  }
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    url: req.originalUrl,
    availableRoutes: [
      '/api/docs',
      '/api/scrape/news',
      '/api/scrape/stocks',
      '/api/scrape/crypto',
      '/api/scrape/ecommerce',
      '/api/scrape/social',
      '/api/weather',
      '/health'
    ]
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`🚀 Velmora Web Scraper Server running on port ${PORT}`);
  logger.info(`📖 API Documentation available at http://localhost:${PORT}/api/docs`);
  logger.info(`🏥 Health check at http://localhost:${PORT}/health`);
  
  // Start scheduled jobs
  require('./services/scheduler');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

module.exports = app; 