const puppeteer = require('puppeteer');
const logger = require('../utils/logger');

// Custom scraper function
async function scrapeCustom(url, selectors, options = {}) {
  let browser = null;
  let page = null;
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
    
    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Extract data using provided selectors
    const data = await page.evaluate((selectors) => {
      const result = {};
      
      for (const [key, selector] of Object.entries(selectors)) {
        try {
          if (key === 'headings') {
            // Get all headings
            const headings = Array.from(document.querySelectorAll(selector))
              .map(el => el.textContent.trim())
              .filter(text => text.length > 0);
            result[key] = headings.join('\n');
          } else if (key === 'links') {
            // Get all links
            const links = Array.from(document.querySelectorAll(selector))
              .map(el => el.textContent.trim())
              .filter(text => text.length > 0);
            result[key] = links.join('\n');
          } else if (key === 'paragraphs') {
            // Get all paragraphs
            const paragraphs = Array.from(document.querySelectorAll(selector))
              .map(el => el.textContent.trim())
              .filter(text => text.length > 0);
            result[key] = paragraphs.join('\n');
          } else {
            // Single element selectors
            const element = document.querySelector(selector);
            if (element) {
              result[key] = element.textContent.trim();
            }
          }
        } catch (error) {
          console.warn(`Error extracting ${key}:`, error);
          result[key] = null;
        }
      }
      
      return result;
    }, selectors);
    
    return data;
    
  } catch (error) {
    logger.error(`Custom scraping failed for ${url}:`, error);
    throw error;
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
}

module.exports = scrapeCustom; 