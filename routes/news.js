console.log("news route loaded");
const express = require('express');
const { body, query, validationResult } = require('express-validator');
const router = express.Router();

// Import utilities and services
const { asyncHandler } = require('../middleware/errorHandler');
const { optionalAuth } = require('../middleware/auth');
const { db } = require('../utils/database');
const logger = require('../utils/logger');
const newsScraperService = require('../services/newsScraper');

// Apply optional authentication to all routes
router.use(optionalAuth);

// GET /api/scrape/news - Get latest news from multiple sources
router.get('/', 
  [
    query('sources')
      .optional()
      .isString()
      .withMessage('Sources should be a comma-separated string'),
    query('category')
      .optional()
      .isIn(['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'])
      .withMessage('Invalid category'),
    query('country')
      .optional()
      .isLength({ min: 2, max: 2 })
      .withMessage('Country should be 2-letter code'),
    query('language')
      .optional()
      .isLength({ min: 2, max: 2 })
      .withMessage('Language should be 2-letter code'),
    query('keywords')
      .optional()
      .isString()
      .withMessage('Keywords should be a string'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit should be between 1 and 100'),
    query('fresh')
      .optional()
      .isBoolean()
      .withMessage('Fresh should be boolean'),
    query('cached')
      .optional()
      .isBoolean()
      .withMessage('Cached should be boolean')
  ],
  asyncHandler(async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      sources = 'bbc,cnn,reuters,guardian,techcrunch',
      category = 'general',
      country = 'us',
      language = 'en',
      keywords = '',
      limit = 20,
      fresh = false,
      cached = true
    } = req.query;

    try {
      // Check cache first unless fresh data is requested
      if (!fresh && cached) {
        const cachedNews = await db.getScrapedData({
          source_type: 'news',
          category,
          limit,
          since: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
        });

        if (cachedNews && cachedNews.length > 0) {
          logger.info(`Serving cached news: ${cachedNews.length} articles`);
          return res.json({
            success: true,
            data: cachedNews,
            total: cachedNews.length,
            source: 'cache',
            timestamp: new Date().toISOString()
          });
        }
      }

      // Scrape fresh news
      const scrapingOptions = {
        sources: sources.split(','),
        category,
        country,
        language,
        keywords,
        limit: parseInt(limit),
        userId: req.user?.id
      };

      const newsData = await newsScraperService.scrapeNews(scrapingOptions);
      
      // Save to database
      const savedData = [];
      for (const article of newsData) {
        try {
          const saved = await db.saveScrapedData({
            source_type: 'news',
            source_url: article.url,
            title: article.title,
            content: article.description,
            category,
            data: article,
            scraped_at: new Date().toISOString(),
            user_id: req.user?.id
          });
          savedData.push(saved);
        } catch (error) {
          logger.warn(`Failed to save article: ${article.title}`, error);
        }
      }

      // Emit real-time update via Socket.IO
      const io = req.app.get('io');
      io.emit('news_update', {
        type: 'news',
        data: newsData,
        category,
        timestamp: new Date().toISOString()
      });

      logger.info(`News scraped successfully: ${newsData.length} articles`);
      
      res.json({
        success: true,
        data: newsData,
        total: newsData.length,
        source: 'fresh',
        category,
        timestamp: new Date().toISOString(),
        cached: savedData.length
      });

    } catch (error) {
      logger.error('News scraping failed:', error);
      
      // Try to serve cached data as fallback
      if (cached) {
        try {
          const fallbackNews = await db.getScrapedData({
            source_type: 'news',
            category,
            limit,
            since: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
          });

          if (fallbackNews && fallbackNews.length > 0) {
            logger.info(`Serving fallback cached news: ${fallbackNews.length} articles`);
            return res.json({
              success: true,
              data: fallbackNews,
              total: fallbackNews.length,
              source: 'fallback_cache',
              warning: 'Fresh data unavailable, serving cached content',
              timestamp: new Date().toISOString()
            });
          }
        } catch (cacheError) {
          logger.error('Cache fallback failed:', cacheError);
        }
      }

      res.status(500).json({
        success: false,
        error: 'News scraping failed',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  })
);

// GET /api/scrape/news/sources - Get available news sources
router.get('/sources', asyncHandler(async (req, res) => {
  const sources = newsScraperService.getAvailableSources();
  
  res.json({
    success: true,
    data: sources,
    total: sources.length,
    timestamp: new Date().toISOString()
  });
}));

// GET /api/scrape/news/categories - Get available categories
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = [
    { id: 'general', name: 'General', description: 'General news and current events' },
    { id: 'business', name: 'Business', description: 'Business and finance news' },
    { id: 'entertainment', name: 'Entertainment', description: 'Entertainment and celebrity news' },
    { id: 'health', name: 'Health', description: 'Health and medical news' },
    { id: 'science', name: 'Science', description: 'Science and research news' },
    { id: 'sports', name: 'Sports', description: 'Sports news and updates' },
    { id: 'technology', name: 'Technology', description: 'Technology and innovation news' }
  ];

  res.json({
    success: true,
    data: categories,
    total: categories.length,
    timestamp: new Date().toISOString()
  });
}));

// POST /api/scrape/news/custom - Custom news scraping with specific URLs
router.post('/custom',
  [
    body('urls')
      .isArray({ min: 1, max: 10 })
      .withMessage('URLs should be an array with 1-10 items'),
    body('urls.*')
      .isURL()
      .withMessage('Each URL should be valid'),
    body('selectors')
      .isObject()
      .withMessage('Selectors should be an object'),
    body('selectors.title')
      .isString()
      .withMessage('Title selector is required'),
    body('selectors.content')
      .optional()
      .isString()
      .withMessage('Content selector should be a string'),
    body('selectors.date')
      .optional()
      .isString()
      .withMessage('Date selector should be a string'),
    body('selectors.author')
      .optional()
      .isString()
      .withMessage('Author selector should be a string')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { urls, selectors, options = {} } = req.body;

    try {
      const results = await newsScraperService.scrapeCustomNews(urls, selectors, options);
      
      // Save successful results to database
      const savedData = [];
      for (const result of results) {
        if (result.success) {
          try {
            const saved = await db.saveScrapedData({
              source_type: 'news_custom',
              source_url: result.url,
              title: result.data.title,
              content: result.data.content,
              category: 'custom',
              data: result.data,
              scraped_at: new Date().toISOString(),
              user_id: req.user?.id
            });
            savedData.push(saved);
          } catch (error) {
            logger.warn(`Failed to save custom article: ${result.url}`, error);
          }
        }
      }

      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      logger.info(`Custom news scraping completed: ${successful.length} successful, ${failed.length} failed`);

      res.json({
        success: true,
        data: results,
        summary: {
          total: results.length,
          successful: successful.length,
          failed: failed.length,
          saved: savedData.length
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Custom news scraping failed:', error);
      res.status(500).json({
        success: false,
        error: 'Custom news scraping failed',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  })
);

// GET /api/scrape/news/search - Search news articles
router.get('/search',
  [
    query('q')
      .isString()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search query is required and should be 1-100 characters'),
    query('sortBy')
      .optional()
      .isIn(['relevancy', 'popularity', 'publishedAt'])
      .withMessage('Sort by should be relevancy, popularity, or publishedAt'),
    query('from')
      .optional()
      .isISO8601()
      .withMessage('From date should be ISO8601 format'),
    query('to')
      .optional()
      .isISO8601()
      .withMessage('To date should be ISO8601 format'),
    query('domains')
      .optional()
      .isString()
      .withMessage('Domains should be a comma-separated string'),
    query('language')
      .optional()
      .isLength({ min: 2, max: 2 })
      .withMessage('Language should be 2-letter code'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit should be between 1 and 100')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      q,
      sortBy = 'publishedAt',
      from,
      to,
      domains,
      language = 'en',
      limit = 20
    } = req.query;

    try {
      const searchOptions = {
        query: q,
        sortBy,
        from,
        to,
        domains: domains ? domains.split(',') : null,
        language,
        limit: parseInt(limit),
        userId: req.user?.id
      };

      const searchResults = await newsScraperService.searchNews(searchOptions);
      
      logger.info(`News search completed: ${searchResults.length} results for "${q}"`);

      res.json({
        success: true,
        data: searchResults,
        query: q,
        total: searchResults.length,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('News search failed:', error);
      res.status(500).json({
        success: false,
        error: 'News search failed',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  })
);

// GET /api/scrape/news/trending - Get trending news topics
router.get('/trending', asyncHandler(async (req, res) => {
  const { limit = 10, category = 'general' } = req.query;

  try {
    const trendingTopics = await newsScraperService.getTrendingTopics({
      limit: parseInt(limit),
      category,
      userId: req.user?.id
    });

    res.json({
      success: true,
      data: trendingTopics,
      category,
      total: trendingTopics.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Trending topics failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get trending topics',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}));

// GET /api/scrape/news/history - Get user's news scraping history
router.get('/history', asyncHandler(async (req, res) => {
  const { limit = 50, category, from, to } = req.query;

  try {
    const filters = {
      source_type: 'news',
      limit: parseInt(limit)
    };

    if (category) filters.category = category;
    if (from) filters.from = from;
    if (to) filters.to = to;
    if (req.user) filters.user_id = req.user.id;

    const history = await db.getScrapingHistory(filters);

    res.json({
      success: true,
      data: history,
      total: history.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('News history failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get news history',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}));

// DELETE /api/scrape/news/cache - Clear news cache
router.delete('/cache', asyncHandler(async (req, res) => {
  const { category, older_than } = req.query;

  try {
    const olderThan = older_than ? new Date(older_than) : new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const deleted = await db.deleteOldScrapedData(olderThan);

    logger.info(`News cache cleared: ${deleted?.length || 0} records`);

    res.json({
      success: true,
      message: 'News cache cleared successfully',
      deleted: deleted?.length || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Cache clearing failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}));

module.exports = router; 