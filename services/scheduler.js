const cron = require('node-cron');
const { db } = require('../utils/database');
const logger = require('../utils/logger');
const newsScraperService = require('./newsScraper');

// Scheduler configuration
const SCHEDULER_ENABLED = process.env.ENABLE_SCHEDULER === 'true';
const CLEANUP_INTERVAL_HOURS = parseInt(process.env.CLEANUP_INTERVAL_HOURS) || 24;
const DATA_RETENTION_DAYS = parseInt(process.env.DATA_RETENTION_DAYS) || 30;

// Active jobs tracking
const activeJobs = new Map();

// Initialize scheduler
function initializeScheduler() {
  if (!SCHEDULER_ENABLED) {
    logger.info('Scheduler is disabled');
    return;
  }

  logger.info('Initializing scheduler...');
  
  // Start default scheduled jobs
  scheduleNewsUpdates();
  scheduleDataCleanup();
  scheduleHealthChecks();
  
  logger.info('Scheduler initialized successfully');
}

// Schedule regular news updates
function scheduleNewsUpdates() {
  // Run news scraping every 30 minutes
  const newsJob = cron.schedule('*/30 * * * *', async () => {
    logger.info('Running scheduled news scraping...');
    
    try {
      const newsOptions = {
        sources: ['bbc', 'cnn', 'reuters', 'guardian', 'techcrunch'],
        category: 'general',
        limit: 50
      };
      
      const articles = await newsScraperService.scrapeNews(newsOptions);
      
      // Save articles to database
      let savedCount = 0;
      for (const article of articles) {
        try {
          await db.saveScrapedData({
            source_type: 'news',
            source_url: article.url,
            title: article.title,
            content: article.description,
            category: 'general',
            data: article,
            scraped_at: new Date().toISOString(),
            user_id: null // System job
          });
          savedCount++;
        } catch (error) {
          logger.warn(`Failed to save scheduled article: ${article.title}`, error);
        }
      }
      
      logger.info(`Scheduled news scraping completed: ${savedCount} articles saved`);
      
      // Log job history
      await db.logScrapingHistory({
        user_id: null,
        source_type: 'news',
        sources: newsOptions.sources.join(','),
        category: newsOptions.category,
        articles_count: savedCount,
        success: true,
        job_type: 'scheduled',
        created_at: new Date().toISOString()
      });
      
    } catch (error) {
      logger.error('Scheduled news scraping failed:', error);
      
      // Log failed job
      await db.logScrapingHistory({
        user_id: null,
        source_type: 'news',
        sources: 'multiple',
        category: 'general',
        articles_count: 0,
        success: false,
        error_message: error.message,
        job_type: 'scheduled',
        created_at: new Date().toISOString()
      });
    }
  }, {
    scheduled: true,
    timezone: 'UTC'
  });
  
  activeJobs.set('news-updates', newsJob);
  logger.info('News updates scheduled every 30 minutes');
}

// Schedule data cleanup
function scheduleDataCleanup() {
  // Run cleanup daily at 2 AM UTC
  const cleanupJob = cron.schedule('0 2 * * *', async () => {
    logger.info('Running scheduled data cleanup...');
    
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - DATA_RETENTION_DAYS);
      
      // Clean old scraped data
      const deletedScrapedData = await db.deleteOldScrapedData(cutoffDate);
      
      // Clean old scraping history
      const deletedHistory = await db.query(`
        DELETE FROM scraping_history 
        WHERE created_at < $1
      `, [cutoffDate.toISOString()]);
      
      logger.info(`Data cleanup completed: ${deletedScrapedData?.length || 0} scraped records, ${deletedHistory?.rowCount || 0} history records deleted`);
      
    } catch (error) {
      logger.error('Scheduled data cleanup failed:', error);
    }
  }, {
    scheduled: true,
    timezone: 'UTC'
  });
  
  activeJobs.set('data-cleanup', cleanupJob);
  logger.info(`Data cleanup scheduled daily at 2 AM UTC (retention: ${DATA_RETENTION_DAYS} days)`);
}

// Schedule health checks
function scheduleHealthChecks() {
  // Run health checks every 5 minutes
  const healthJob = cron.schedule('*/5 * * * *', async () => {
    try {
      // Check database health
      const dbHealth = await db.healthCheck();
      
      // Check browser health (for scraping)
      const browserHealth = await checkBrowserHealth();
      
      // Log health status
      const healthStatus = {
        database: dbHealth.status,
        browser: browserHealth.status,
        timestamp: new Date().toISOString()
      };
      
      if (dbHealth.status !== 'healthy' || browserHealth.status !== 'healthy') {
        logger.warn('Health check failed:', healthStatus);
      }
      
    } catch (error) {
      logger.error('Health check failed:', error);
    }
  }, {
    scheduled: true,
    timezone: 'UTC'
  });
  
  activeJobs.set('health-checks', healthJob);
  logger.info('Health checks scheduled every 5 minutes');
}

// Check browser health
async function checkBrowserHealth() {
  try {
    // This would check if Puppeteer browser is responsive
    // For now, we'll just return healthy
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() };
  }
}

// Create custom scheduled job
async function createScheduledJob(jobConfig) {
  const {
    name,
    schedule,
    type,
    config,
    userId,
    active = true
  } = jobConfig;
  
  try {
    // Validate cron expression
    if (!cron.validate(schedule)) {
      throw new Error('Invalid cron expression');
    }
    
    // Save job to database
    const job = await db.createScheduledJob({
      name,
      schedule,
      type,
      config: JSON.stringify(config),
      user_id: userId,
      active,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    // Start the job if active
    if (active) {
      await startScheduledJob(job);
    }
    
    logger.info(`Scheduled job created: ${name}`);
    return job;
    
  } catch (error) {
    logger.error('Failed to create scheduled job:', error);
    throw error;
  }
}

// Start a scheduled job
async function startScheduledJob(job) {
  try {
    const jobConfig = JSON.parse(job.config);
    
    const cronJob = cron.schedule(job.schedule, async () => {
      logger.info(`Running scheduled job: ${job.name}`);
      
      try {
        let result;
        
        switch (job.type) {
          case 'news':
            result = await runNewsScrapingJob(jobConfig);
            break;
          case 'custom':
            result = await runCustomScrapingJob(jobConfig);
            break;
          default:
            throw new Error(`Unknown job type: ${job.type}`);
        }
        
        // Log successful job execution
        await db.logScrapingHistory({
          user_id: job.user_id,
          source_type: job.type,
          sources: jobConfig.sources?.join(',') || 'custom',
          category: jobConfig.category || 'custom',
          articles_count: result.count || 0,
          success: true,
          job_type: 'scheduled',
          job_id: job.id,
          created_at: new Date().toISOString()
        });
        
        logger.info(`Scheduled job completed: ${job.name} (${result.count} items)`);
        
      } catch (error) {
        logger.error(`Scheduled job failed: ${job.name}`, error);
        
        // Log failed job execution
        await db.logScrapingHistory({
          user_id: job.user_id,
          source_type: job.type,
          sources: 'unknown',
          category: 'unknown',
          articles_count: 0,
          success: false,
          error_message: error.message,
          job_type: 'scheduled',
          job_id: job.id,
          created_at: new Date().toISOString()
        });
      }
    }, {
      scheduled: true,
      timezone: 'UTC'
    });
    
    activeJobs.set(`custom-${job.id}`, cronJob);
    logger.info(`Started scheduled job: ${job.name}`);
    
  } catch (error) {
    logger.error(`Failed to start scheduled job: ${job.name}`, error);
    throw error;
  }
}

// Run news scraping job
async function runNewsScrapingJob(config) {
  const articles = await newsScraperService.scrapeNews(config);
  
  // Save articles to database
  let savedCount = 0;
  for (const article of articles) {
    try {
      await db.saveScrapedData({
        source_type: 'news',
        source_url: article.url,
        title: article.title,
        content: article.description,
        category: config.category || 'general',
        data: article,
        scraped_at: new Date().toISOString(),
        user_id: config.userId || null
      });
      savedCount++;
    } catch (error) {
      logger.warn(`Failed to save article: ${article.title}`, error);
    }
  }
  
  return { count: savedCount, articles };
}

// Run custom scraping job
async function runCustomScrapingJob(config) {
  const { urls, selectors } = config;
  
  // This would use the custom scraper service
  // For now, we'll just return a placeholder
  return { count: 0, results: [] };
}

// Stop a scheduled job
async function stopScheduledJob(jobId) {
  try {
    const jobKey = `custom-${jobId}`;
    const cronJob = activeJobs.get(jobKey);
    
    if (cronJob) {
      cronJob.stop();
      activeJobs.delete(jobKey);
      logger.info(`Stopped scheduled job: ${jobId}`);
    }
    
    // Update job status in database
    await db.updateScheduledJob(jobId, {
      active: false,
      updated_at: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error(`Failed to stop scheduled job: ${jobId}`, error);
    throw error;
  }
}

// Get active jobs
function getActiveJobs() {
  return Array.from(activeJobs.keys());
}

// Get job statistics
async function getJobStatistics() {
  try {
    const stats = await db.query(`
      SELECT 
        COUNT(*) as total_jobs,
        COUNT(CASE WHEN active = true THEN 1 END) as active_jobs,
        COUNT(CASE WHEN success = true THEN 1 END) as successful_executions,
        COUNT(CASE WHEN success = false THEN 1 END) as failed_executions
      FROM scheduled_jobs
      LEFT JOIN scraping_history ON scheduled_jobs.id = scraping_history.job_id
      WHERE created_at > NOW() - INTERVAL '7 days'
    `);
    
    return stats.rows[0];
  } catch (error) {
    logger.error('Failed to get job statistics:', error);
    return {
      total_jobs: 0,
      active_jobs: 0,
      successful_executions: 0,
      failed_executions: 0
    };
  }
}

// Load existing jobs from database
async function loadExistingJobs() {
  try {
    const jobs = await db.getScheduledJobs();
    
    for (const job of jobs) {
      if (job.active) {
        await startScheduledJob(job);
      }
    }
    
    logger.info(`Loaded ${jobs.length} existing scheduled jobs`);
    
  } catch (error) {
    logger.error('Failed to load existing jobs:', error);
  }
}

// Graceful shutdown
function shutdownScheduler() {
  logger.info('Shutting down scheduler...');
  
  activeJobs.forEach((job, key) => {
    try {
      job.stop();
      logger.info(`Stopped job: ${key}`);
    } catch (error) {
      logger.warn(`Failed to stop job ${key}:`, error);
    }
  });
  
  activeJobs.clear();
  logger.info('Scheduler shutdown completed');
}

// Initialize scheduler on module load (only if enabled)
if (SCHEDULER_ENABLED) {
  initializeScheduler();
  // Load existing jobs
  loadExistingJobs();
}

// Handle process shutdown
process.on('SIGTERM', shutdownScheduler);
process.on('SIGINT', shutdownScheduler);

module.exports = {
  createScheduledJob,
  startScheduledJob,
  stopScheduledJob,
  getActiveJobs,
  getJobStatistics,
  shutdownScheduler
}; 