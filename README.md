# 🚀 Velmora - Advanced Web Scraping Platform

A **comprehensive, production-ready web scraping platform** with real-time data aggregation, multi-source support, and advanced automation features.

## ✨ Features

### 🎯 **Core Functionality**
- **Multi-Source News Scraping** - BBC, CNN, Reuters, The Guardian, TechCrunch, Hacker News
- **Real-Time Data Processing** - WebSocket connections for live updates
- **Custom Web Scraping** - Flexible CSS selector-based scraping
- **Automated Scheduling** - Cron-based job scheduling and data cleanup
- **Advanced Authentication** - JWT-based user management with role-based access

### 🛠️ **Technical Features**
- **Puppeteer Integration** - Headless browser automation for dynamic content
- **RSS Feed Support** - Fallback to RSS when direct scraping fails
- **Database Integration** - Supabase for data persistence and user management
- **Real-Time Updates** - Socket.IO for live data streaming
- **Comprehensive Logging** - Winston-based logging with multiple levels
- **Rate Limiting** - Built-in protection against abuse
- **Error Handling** - Graceful error recovery and user feedback

### 🔧 **Advanced Features**
- **Bulk Scraping** - Process multiple URLs simultaneously
- **Data Caching** - Smart caching with configurable TTL
- **Search Functionality** - Full-text search across scraped content
- **Trending Topics** - Automatic keyword extraction and trending analysis
- **Performance Monitoring** - Built-in metrics and health checks
- **Deployment Ready** - Vercel, Netlify, and Docker support

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Supabase account (free tier available)
- Optional: Redis for caching

### 1. Clone & Install
```bash
git clone https://github.com/velmora/scraper.git
cd scraper
npm install
```

### 2. Environment Setup
```bash
# Copy example configuration
cp config.example.env .env

# Edit .env with your credentials
# Required: SUPABASE_URL, SUPABASE_ANON_KEY, JWT_SECRET
```

### 3. Database Setup
Create tables in Supabase:
```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Scraped data table
CREATE TABLE scraped_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_type TEXT NOT NULL,
  source_url TEXT NOT NULL,
  title TEXT,
  content TEXT,
  category TEXT,
  data JSONB,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id)
);

-- User preferences table
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) UNIQUE,
  theme TEXT DEFAULT 'dark',
  notifications BOOLEAN DEFAULT true,
  auto_refresh BOOLEAN DEFAULT true,
  default_sources TEXT[] DEFAULT '{"bbc","reuters","techcrunch"}',
  default_categories TEXT[] DEFAULT '{"general","technology"}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scheduled jobs table
CREATE TABLE scheduled_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  schedule TEXT NOT NULL,
  type TEXT NOT NULL,
  config JSONB NOT NULL,
  user_id UUID REFERENCES users(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scraping history table
CREATE TABLE scraping_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  source_type TEXT NOT NULL,
  sources TEXT,
  category TEXT,
  articles_count INTEGER DEFAULT 0,
  success BOOLEAN DEFAULT false,
  error_message TEXT,
  job_type TEXT DEFAULT 'manual',
  job_id UUID REFERENCES scheduled_jobs(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved items table
CREATE TABLE saved_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  item_type TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Run the Application
```bash
# Development mode
npm run dev

# Production mode
npm start

# Run custom scraper
npm run scrape

# Run scheduler
npm run schedule
```

### 5. Access the Platform
- **Frontend**: `http://localhost:3000`
- **API Documentation**: `http://localhost:3000/api/docs`
- **Health Check**: `http://localhost:3000/health`

## 📖 API Documentation

### Authentication Endpoints
```bash
# Register new user
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}

# Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

# Verify token
GET /api/auth/verify
Headers: { "Authorization": "Bearer <token>" }
```

### News Scraping Endpoints
```bash
# Scrape news from multiple sources
GET /api/scrape/news?sources=bbc,cnn&category=technology&limit=20

# Search news articles
GET /api/scrape/news/search?q=artificial+intelligence&limit=10

# Get trending topics
GET /api/scrape/news/trending?limit=5

# Custom news scraping
POST /api/scrape/news/custom
{
  "urls": ["https://example.com/news"],
  "selectors": {
    "title": "h1",
    "content": ".article-content",
    "author": ".author-name"
  }
}
```

### Custom Scraping Endpoints
```bash
# Custom scraper
POST /api/scrape/custom
{
  "url": "https://example.com",
  "selectors": {
    "title": "h1",
    "price": ".price",
    "description": ".description"
  }
}

# Bulk scraping
POST /api/scrape/bulk
{
  "urls": ["https://site1.com", "https://site2.com"],
  "selectors": {
    "title": "h1",
    "content": ".content"
  }
}
```

## 🔧 Configuration

### Environment Variables
```env
# Server Configuration
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com

# Database (Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Authentication
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=24h

# External APIs
NEWS_API_KEY=your-news-api-key
OPENWEATHER_API_KEY=your-weather-key
ALPHA_VANTAGE_API_KEY=your-stock-key

# Features
ENABLE_SCHEDULER=true
ENABLE_CACHING=true
LOG_LEVEL=info
```

### Browser Configuration
```javascript
// Puppeteer settings in services/newsScraper.js
const browserOptions = {
  headless: 'new',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu'
  ]
};
```

## 🎨 Frontend Features

### Dashboard
- **Real-time metrics** - Total scraped items, success rates, active jobs
- **Performance charts** - Visual data representation
- **Recent activity** - Live feed of scraping operations
- **Health monitoring** - System status indicators

### News Scraper
- **Multi-source selection** - Choose from 7+ news sources
- **Category filtering** - Technology, Business, Sports, etc.
- **Keyword search** - Find specific topics
- **Real-time updates** - Live news feed via WebSocket

### Custom Scraper
- **Visual interface** - Easy-to-use scraping configuration
- **CSS selector support** - Flexible element targeting
- **Bulk operations** - Process multiple URLs
- **Result preview** - Immediate feedback on scraped data

## 🛠️ Development

### Project Structure
```
velmora/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── vercel.json            # Deployment configuration
├── middleware/            # Authentication, error handling
├── routes/                # API endpoints
├── services/              # Business logic
├── utils/                 # Utilities and helpers
├── public/                # Frontend assets
└── logs/                  # Application logs
```

### Adding New Scrapers
1. Create service in `services/`
2. Add route in `routes/`
3. Update frontend in `public/index.html`
4. Add tests and documentation

### Custom Scraper Example
```javascript
// services/customScraper.js
const scrapeWebsite = async (url, selectors) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(url);
  
  const data = await page.evaluate((selectors) => {
    const result = {};
    for (const [key, selector] of Object.entries(selectors)) {
      const element = document.querySelector(selector);
      result[key] = element ? element.textContent.trim() : null;
    }
    return result;
  }, selectors);
  
  await browser.close();
  return data;
};
```

## 🚀 Deployment

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add JWT_SECRET
```

### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .
EXPOSE 3000

CMD ["npm", "start"]
```

### Self-Hosting
```bash
# Using PM2
npm install -g pm2
pm2 start server.js --name "velmora-scraper"
pm2 startup
pm2 save

# Using systemd
sudo systemctl create velmora-scraper.service
sudo systemctl enable velmora-scraper
sudo systemctl start velmora-scraper
```

## 📊 Monitoring & Analytics

### Built-in Metrics
- **Scraping performance** - Success rates, response times
- **User activity** - Login frequency, feature usage
- **System health** - Database connections, memory usage
- **Error tracking** - Comprehensive error logging

### Health Check Endpoint
```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

## 🔐 Security

### Authentication Flow
1. User registration with password hashing (bcrypt)
2. JWT token generation with expiration
3. Token validation on protected routes
4. Role-based access control

### Security Headers
- Content Security Policy (CSP)
- CORS protection
- Helmet.js security middleware
- Rate limiting on all endpoints

### Best Practices
- Environment variable protection
- Input validation and sanitization
- Error message sanitization
- Secure session management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Development Setup
```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **GitHub Issues** - Bug reports and feature requests
- **Documentation** - Comprehensive API and setup guides
- **Discord** - Community support and discussions

### Common Issues
- **Database connection errors** - Check Supabase credentials
- **Puppeteer issues** - Verify Chrome/Chromium installation
- **Rate limiting** - Adjust limits in configuration
- **Memory issues** - Increase server resources

## 🎯 Roadmap

### Upcoming Features
- [ ] **Advanced Analytics** - Comprehensive reporting dashboard
- [ ] **Data Export** - CSV, JSON, PDF export options
- [ ] **Webhook Integration** - Real-time notifications
- [ ] **AI-Powered Insights** - Automated content analysis
- [ ] **Mobile App** - React Native mobile application
- [ ] **API Marketplace** - Third-party integrations

### Performance Improvements
- [ ] **Redis Caching** - Enhanced caching layer
- [ ] **Database Optimization** - Query performance improvements
- [ ] **Load Balancing** - Multi-instance deployment
- [ ] **CDN Integration** - Global content delivery

---

**Built with ❤️ by the Velmora Team**

*Transform your data gathering with professional-grade web scraping.*