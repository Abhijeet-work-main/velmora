const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
const RSSParser = require('rss-parser');
const { format } = require('date-fns');
const logger = require('../utils/logger');
const { db } = require('../utils/database');

// RSS Parser instance
const rssParser = new RSSParser({
  customFields: {
    feed: ['language', 'ttl'],
    item: ['pubDate', 'creator', 'content:encoded']
  }
});

// News sources configuration
const newsSources = {
  bbc: {
    name: 'BBC News',
    url: 'https://www.bbc.com/news',
    rss: 'https://feeds.bbci.co.uk/news/rss.xml',
    selectors: {
      article: 'article.gs-c-promo',
      title: 'h3.gs-c-promo-heading__title',
      link: 'a.gs-c-promo-heading__link',
      description: 'p.gs-c-promo-summary',
      image: 'img.gs-c-promo-image',
      date: 'time'
    },
    category: 'general'
  },
  cnn: {
    name: 'CNN',
    url: 'https://edition.cnn.com/',
    rss: 'http://rss.cnn.com/rss/edition.rss',
    selectors: {
      article: '.container__item',
      title: '.container__headline-text',
      link: '.container__link',
      description: '.container__description',
      image: '.container__image img',
      date: '.container__date'
    },
    category: 'general'
  },
  reuters: {
    name: 'Reuters',
    url: 'https://www.reuters.com/',
    rss: 'https://www.reutersagency.com/feed/?best-topics=business-finance&post_type=best',
    selectors: {
      article: 'article.story-card',
      title: 'h2.story-card__headline',
      link: 'a.story-card__link',
      description: 'p.story-card__summary',
      image: 'img.story-card__image',
      date: 'time'
    },
    category: 'business'
  },
  guardian: {
    name: 'The Guardian',
    url: 'https://www.theguardian.com/international',
    rss: 'https://www.theguardian.com/world/rss',
    selectors: {
      article: '.fc-item',
      title: '.fc-item__title',
      link: '.fc-item__link',
      description: '.fc-item__standfirst',
      image: '.fc-item__image-container img',
      date: '.fc-item__timestamp'
    },
    category: 'general'
  },
  techcrunch: {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/',
    rss: 'https://feeds.feedburner.com/TechCrunch',
    selectors: {
      article: '.post-block',
      title: '.post-block__title',
      link: '.post-block__title__link',
      description: '.post-block__content',
      image: '.post-block__media img',
      date: '.post-block__time'
    },
    category: 'technology'
  },
  hackernews: {
    name: 'Hacker News',
    url: 'https://news.ycombinator.com/',
    api: 'https://hacker-news.firebaseio.com/v0/',
    selectors: {
      article: '.athing',
      title: '.titleline a',
      link: '.titleline a',
      score: '.score',
      comments: '.subtext a:last-child'
    },
    category: 'technology'
  },
  bloomberg: {
    name: 'Bloomberg',
    url: 'https://www.bloomberg.com/',
    rss: 'https://feeds.bloomberg.com/markets/news.rss',
    selectors: {
      article: '.story-package-module__story',
      title: '.story-package-module__story-headline',
      link: '.story-package-module__story-headline a',
      description: '.story-package-module__story-summary',
      image: '.story-package-module__story-figure img',
      date: '.story-package-module__story-byline time'
    },
    category: 'business'
  }
};

// Browser instance management
let browser = null;
let lastBrowserCheck = 0;
const BROWSER_RESTART_INTERVAL = 30 * 60 * 1000; // 30 minutes

// Get or create browser instance
async function getBrowser() {
  const now = Date.now();
  
  if (!browser || now - lastBrowserCheck > BROWSER_RESTART_INTERVAL) {
    if (browser) {
      try {
        await browser.close();
      } catch (error) {
        logger.warn('Error closing browser:', error);
      }
    }
    
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-extensions',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    });
    
    lastBrowserCheck = now;
    logger.info('Browser instance created/restarted');
  }
  
  return browser;
}

// Close browser on exit
process.on('exit', async () => {
  if (browser) {
    await browser.close();
  }
});

// Scrape news from RSS feeds
async function scrapeFromRSS(source, options = {}) {
  const startTime = Date.now();
  
  try {
    const feed = await rssParser.parseURL(source.rss);
    
    const articles = feed.items.slice(0, options.limit || 20).map(item => ({
      title: item.title,
      description: item.contentSnippet || item.summary,
      url: item.link,
      urlToImage: item.enclosure?.url || null,
      publishedAt: item.pubDate || item.isoDate,
      source: {
        id: source.name.toLowerCase().replace(/\s+/g, '-'),
        name: source.name
      },
      author: item.creator || item.author || null,
      content: item.content || item.description,
      category: source.category
    }));
    
    logger.logScrapingOperation('RSS', source.rss, true, Date.now() - startTime);
    return articles;
    
  } catch (error) {
    logger.logScrapingOperation('RSS', source.rss, false, Date.now() - startTime, error);
    throw error;
  }
}

// Scrape news using Puppeteer
async function scrapeWithPuppeteer(source, options = {}) {
  const startTime = Date.now();
  let page = null;
  
  try {
    const browserInstance = await getBrowser();
    page = await browserInstance.newPage();
    
    // Set viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Block unnecessary resources
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const resourceType = request.resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });
    
    // Navigate to page
    await page.goto(source.url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for content to load
    await page.waitForSelector(source.selectors.article, { timeout: 10000 });
    
    // Extract articles
    const articles = await page.evaluate((selectors, sourceName, category) => {
      const articles = [];
      const articleElements = document.querySelectorAll(selectors.article);
      
      articleElements.forEach(element => {
        try {
          const titleElement = element.querySelector(selectors.title);
          const linkElement = element.querySelector(selectors.link);
          const descriptionElement = element.querySelector(selectors.description);
          const imageElement = element.querySelector(selectors.image);
          const dateElement = element.querySelector(selectors.date);
          
          if (titleElement && linkElement) {
            const title = titleElement.textContent.trim();
            const url = linkElement.href;
            const description = descriptionElement ? descriptionElement.textContent.trim() : '';
            const image = imageElement ? imageElement.src : null;
            const date = dateElement ? dateElement.textContent.trim() : null;
            
            articles.push({
              title,
              description,
              url,
              urlToImage: image,
              publishedAt: date,
              source: {
                id: sourceName.toLowerCase().replace(/\s+/g, '-'),
                name: sourceName
              },
              content: description,
              category
            });
          }
        } catch (error) {
          console.warn('Error extracting article:', error);
        }
      });
      
      return articles;
    }, source.selectors, source.name, source.category);
    
    logger.logScrapingOperation('Puppeteer', source.url, true, Date.now() - startTime);
    return articles.slice(0, options.limit || 20);
    
  } catch (error) {
    logger.logScrapingOperation('Puppeteer', source.url, false, Date.now() - startTime, error);
    throw error;
  } finally {
    if (page) {
      await page.close();
    }
  }
}

// Scrape Hacker News using API
async function scrapeHackerNews(options = {}) {
  const startTime = Date.now();
  
  try {
    const response = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
    const topStories = response.data.slice(0, options.limit || 20);
    
    const articles = await Promise.all(
      topStories.map(async (id) => {
        try {
          const storyResponse = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          const story = storyResponse.data;
          
          return {
            title: story.title,
            description: story.text || '',
            url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
            urlToImage: null,
            publishedAt: new Date(story.time * 1000).toISOString(),
            source: {
              id: 'hackernews',
              name: 'Hacker News'
            },
            author: story.by,
            content: story.text || '',
            category: 'technology',
            score: story.score,
            comments: story.descendants || 0
          };
        } catch (error) {
          logger.warn(`Error fetching HN story ${id}:`, error);
          return null;
        }
      })
    );
    
    const validArticles = articles.filter(article => article !== null);
    logger.logScrapingOperation('API', 'Hacker News', true, Date.now() - startTime);
    return validArticles;
    
  } catch (error) {
    logger.logScrapingOperation('API', 'Hacker News', false, Date.now() - startTime, error);
    throw error;
  }
}

// Main scraping function
async function scrapeNews(options = {}) {
  const {
    sources = ['bbc', 'cnn', 'reuters', 'guardian', 'techcrunch'],
    category = 'general',
    keywords = '',
    limit = 20,
    userId = null
  } = options;
  
  // If keywords are provided, try News API first
  if (keywords && process.env.NEWS_API_KEY) {
    try {
      const newsApiResults = await searchWithNewsAPI(keywords, { limit, category });
      if (newsApiResults.length > 0) {
        return newsApiResults;
      }
    } catch (error) {
      logger.warn('News API search failed, falling back to scraping:', error);
    }
  }
  
  const allArticles = [];
  const scrapingPromises = [];
  
  // Process each source
  for (const sourceName of sources) {
    const source = newsSources[sourceName];
    
    if (!source) {
      logger.warn(`Unknown news source: ${sourceName}`);
      continue;
    }
    
    // Skip if category filter doesn't match
    if (category !== 'general' && source.category !== category) {
      continue;
    }
    
    // Create scraping promise
    const scrapePromise = (async () => {
      try {
        let articles = [];
        
        // Try RSS first, then fallback to Puppeteer
        if (source.rss) {
          try {
            articles = await scrapeFromRSS(source, { limit: Math.ceil(limit / sources.length) });
          } catch (rssError) {
            logger.warn(`RSS scraping failed for ${sourceName}, trying Puppeteer:`, rssError);
            
            if (source.selectors) {
              articles = await scrapeWithPuppeteer(source, { limit: Math.ceil(limit / sources.length) });
            }
          }
        } else if (sourceName === 'hackernews') {
          articles = await scrapeHackerNews({ limit: Math.ceil(limit / sources.length) });
        } else if (source.selectors) {
          articles = await scrapeWithPuppeteer(source, { limit: Math.ceil(limit / sources.length) });
        }
        
        return articles;
        
      } catch (error) {
        logger.error(`Error scraping ${sourceName}:`, error);
        return [];
      }
    })();
    
    scrapingPromises.push(scrapePromise);
  }
  
  // Wait for all scraping to complete
  const results = await Promise.all(scrapingPromises);
  
  // Combine and process results
  results.forEach(articles => {
    allArticles.push(...articles);
  });
  
  // Remove duplicates and sort by date
  const uniqueArticles = removeDuplicates(allArticles);
  const sortedArticles = uniqueArticles.sort((a, b) => 
    new Date(b.publishedAt) - new Date(a.publishedAt)
  );
  
  // Apply final limit
  const finalArticles = sortedArticles.slice(0, limit);
  
  // Log to database
  if (userId) {
    try {
      await db.logScrapingHistory({
        user_id: userId,
        source_type: 'news',
        sources: sources.join(','),
        category,
        articles_count: finalArticles.length,
        success: true,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      logger.warn('Failed to log scraping history:', error);
    }
  }
  
  return finalArticles;
}

// Remove duplicate articles
function removeDuplicates(articles) {
  const seen = new Set();
  return articles.filter(article => {
    const key = `${article.title}-${article.source.name}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Custom news scraping
async function scrapeCustomNews(urls, selectors, options = {}) {
  const results = [];
  
  for (const url of urls) {
    const startTime = Date.now();
    let page = null;
    
    try {
      const browserInstance = await getBrowser();
      page = await browserInstance.newPage();
      
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      // Extract data using provided selectors
      const extractedData = await page.evaluate((selectors) => {
        const data = {};
        
        for (const [key, selector] of Object.entries(selectors)) {
          try {
            const element = document.querySelector(selector);
            if (element) {
              data[key] = element.textContent.trim();
            }
          } catch (error) {
            console.warn(`Error extracting ${key}:`, error);
          }
        }
        
        return data;
      }, selectors);
      
      results.push({
        url,
        success: true,
        data: extractedData,
        scrapedAt: new Date().toISOString(),
        duration: Date.now() - startTime
      });
      
      logger.logScrapingOperation('Custom', url, true, Date.now() - startTime);
      
    } catch (error) {
      results.push({
        url,
        success: false,
        error: error.message,
        scrapedAt: new Date().toISOString(),
        duration: Date.now() - startTime
      });
      
      logger.logScrapingOperation('Custom', url, false, Date.now() - startTime, error);
    } finally {
      if (page) {
        await page.close();
      }
    }
  }
  
  return results;
}

// Search using News API
async function searchWithNewsAPI(query, options = {}) {
  const { limit = 20, category = 'general' } = options;
  
  try {
    const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${process.env.NEWS_API_KEY}&language=en&sortBy=publishedAt&pageSize=${limit}`;
    
    const response = await axios.get(newsApiUrl);
    
    if (response.data.status === 'ok' && response.data.articles) {
      return response.data.articles.map(article => ({
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        source: {
          id: article.source.id,
          name: article.source.name
        },
        author: article.author,
        category: category
      }));
    }
    
    return [];
  } catch (error) {
    logger.error('News API search failed:', error);
    throw error;
  }
}

// Search news using external API
async function searchNews(options = {}) {
  const {
    query,
    sortBy = 'publishedAt',
    from,
    to,
    domains,
    language = 'en',
    limit = 20
  } = options;
  
  try {
    // Try News API first
    if (process.env.NEWS_API_KEY) {
      return await searchWithNewsAPI(query, { limit });
    }
    
    // Fallback to scraping
    const allNews = await scrapeNews({ limit: 100 });
    
    // Filter by query
    const filteredNews = allNews.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description.toLowerCase().includes(query.toLowerCase())
    );
    
    // Apply date filters
    let dateFilteredNews = filteredNews;
    if (from || to) {
      dateFilteredNews = filteredNews.filter(article => {
        const articleDate = new Date(article.publishedAt);
        if (from && articleDate < new Date(from)) return false;
        if (to && articleDate > new Date(to)) return false;
        return true;
      });
    }
    
    // Apply domain filter
    if (domains && domains.length > 0) {
      dateFilteredNews = dateFilteredNews.filter(article => {
        const articleDomain = new URL(article.url).hostname;
        return domains.some(domain => articleDomain.includes(domain));
      });
    }
    
    // Sort results
    const sortedNews = dateFilteredNews.sort((a, b) => {
      switch (sortBy) {
        case 'publishedAt':
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        case 'popularity':
          return (b.score || 0) - (a.score || 0);
        case 'relevancy':
        default:
          // Simple relevancy scoring
          const aScore = (a.title.toLowerCase().includes(query.toLowerCase()) ? 2 : 0) +
                        (a.description.toLowerCase().includes(query.toLowerCase()) ? 1 : 0);
          const bScore = (b.title.toLowerCase().includes(query.toLowerCase()) ? 2 : 0) +
                        (b.description.toLowerCase().includes(query.toLowerCase()) ? 1 : 0);
          return bScore - aScore;
      }
    });
    
    return sortedNews.slice(0, limit);
    
  } catch (error) {
    logger.error('News search failed:', error);
    throw error;
  }
}

// Get trending topics
async function getTrendingTopics(options = {}) {
  const { limit = 10, category = 'general' } = options;
  
  try {
    const news = await scrapeNews({ sources: ['hackernews', 'techcrunch'], limit: 100 });
    
    // Extract keywords from titles
    const keywords = {};
    news.forEach(article => {
      const words = article.title.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3);
      
      words.forEach(word => {
        keywords[word] = (keywords[word] || 0) + 1;
      });
    });
    
    // Get top keywords
    const trending = Object.entries(keywords)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([word, count]) => ({
        keyword: word,
        count,
        category
      }));
    
    return trending;
    
  } catch (error) {
    logger.error('Trending topics failed:', error);
    throw error;
  }
}

// Get available sources
function getAvailableSources() {
  return Object.entries(newsSources).map(([id, source]) => ({
    id,
    name: source.name,
    url: source.url,
    category: source.category,
    hasRSS: !!source.rss,
    hasAPI: !!source.api
  }));
}

// Cleanup function
async function cleanup() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

module.exports = {
  scrapeNews,
  scrapeCustomNews,
  searchNews,
  getTrendingTopics,
  getAvailableSources,
  cleanup
}; 