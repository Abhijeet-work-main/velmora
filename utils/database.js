const { createClient } = require('@supabase/supabase-js');
const logger = require('./logger');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://demo.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'demo-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'demo-service-key';

// Create Supabase client (with error handling)
let supabase = null;
let supabaseAdmin = null;

try {
  if (supabaseUrl !== 'https://demo.supabase.co') {
    supabase = createClient(supabaseUrl, supabaseKey);
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  }
} catch (error) {
  console.warn('Supabase not configured, using mock database functions');
}

// Database tables schema
const tables = {
  users: 'users',
  scraped_data: 'scraped_data',
  user_preferences: 'user_preferences',
  scheduled_jobs: 'scheduled_jobs',
  scraping_history: 'scraping_history',
  saved_items: 'saved_items',
  api_keys: 'api_keys'
};

// Mock data for demo mode
const mockUsers = [];
const mockScrapedData = [];

// Database utility functions
const db = {
  // User operations
  async createUser(userData) {
    if (!supabase) {
      // Mock implementation
      const user = { 
        id: Date.now().toString(), 
        ...userData, 
        created_at: new Date().toISOString() 
      };
      mockUsers.push(user);
      logger.info(`Mock user created: ${userData.email}`);
      return user;
    }
    
    try {
      const { data, error } = await supabase
        .from(tables.users)
        .insert([userData])
        .select()
        .single();
      
      if (error) throw error;
      logger.info(`User created: ${userData.email}`);
      return data;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  },

  async getUserByEmail(email) {
    if (!supabase) {
      // Mock implementation
      return mockUsers.find(user => user.email === email) || null;
    }
    
    try {
      const { data, error } = await supabase
        .from(tables.users)
        .select('*')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      logger.error('Error getting user by email:', error);
      throw error;
    }
  },

  async getUserById(id) {
    try {
      const { data, error } = await supabase
        .from(tables.users)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error getting user by ID:', error);
      throw error;
    }
  },

  async updateUser(id, updates) {
    try {
      const { data, error } = await supabase
        .from(tables.users)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      logger.info(`User updated: ${id}`);
      return data;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  },

  // Scraped data operations
  async saveScrapedData(data) {
    if (!supabase) {
      // Mock implementation
      const record = { 
        id: Date.now().toString(), 
        ...data, 
        created_at: new Date().toISOString() 
      };
      mockScrapedData.push(record);
      logger.info(`Mock scraped data saved: ${data.source_type} - ${data.source_url}`);
      return record;
    }
    
    try {
      const { data: result, error } = await supabase
        .from(tables.scraped_data)
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      logger.info(`Scraped data saved: ${data.source_type} - ${data.source_url}`);
      return result;
    } catch (error) {
      logger.error('Error saving scraped data:', error);
      throw error;
    }
  },

  async getScrapedData(filters = {}) {
    if (!supabase) {
      // Mock implementation
      let data = [...mockScrapedData];
      
      if (filters.source_type) {
        data = data.filter(item => item.source_type === filters.source_type);
      }
      if (filters.category) {
        data = data.filter(item => item.category === filters.category);
      }
      if (filters.since) {
        const sinceDate = new Date(filters.since);
        data = data.filter(item => new Date(item.created_at) > sinceDate);
      }
      if (filters.limit) {
        data = data.slice(0, filters.limit);
      }
      
      return data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    try {
      let query = supabase
        .from(tables.scraped_data)
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.source_type) {
        query = query.eq('source_type', filters.source_type);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.since) {
        query = query.gte('created_at', filters.since);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error getting scraped data:', error);
      throw error;
    }
  },

  async deleteOldScrapedData(olderThan) {
    try {
      const { data, error } = await supabase
        .from(tables.scraped_data)
        .delete()
        .lt('created_at', olderThan);
      
      if (error) throw error;
      logger.info(`Old scraped data deleted: ${data?.length || 0} records`);
      return data;
    } catch (error) {
      logger.error('Error deleting old scraped data:', error);
      throw error;
    }
  },

  // User preferences
  async getUserPreferences(userId) {
    try {
      const { data, error } = await supabase
        .from(tables.user_preferences)
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      logger.error('Error getting user preferences:', error);
      throw error;
    }
  },

  async saveUserPreferences(userId, preferences) {
    try {
      const { data, error } = await supabase
        .from(tables.user_preferences)
        .upsert([{ user_id: userId, ...preferences }])
        .select()
        .single();
      
      if (error) throw error;
      logger.info(`User preferences saved: ${userId}`);
      return data;
    } catch (error) {
      logger.error('Error saving user preferences:', error);
      throw error;
    }
  },

  // Scheduled jobs
  async createScheduledJob(jobData) {
    try {
      const { data, error } = await supabase
        .from(tables.scheduled_jobs)
        .insert([jobData])
        .select()
        .single();
      
      if (error) throw error;
      logger.info(`Scheduled job created: ${jobData.name}`);
      return data;
    } catch (error) {
      logger.error('Error creating scheduled job:', error);
      throw error;
    }
  },

  async getScheduledJobs(userId = null) {
    try {
      let query = supabase
        .from(tables.scheduled_jobs)
        .select('*')
        .eq('active', true);
      
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error getting scheduled jobs:', error);
      throw error;
    }
  },

  async updateScheduledJob(id, updates) {
    try {
      const { data, error } = await supabase
        .from(tables.scheduled_jobs)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      logger.info(`Scheduled job updated: ${id}`);
      return data;
    } catch (error) {
      logger.error('Error updating scheduled job:', error);
      throw error;
    }
  },

  // Scraping history
  async logScrapingHistory(historyData) {
    try {
      const { data, error } = await supabase
        .from(tables.scraping_history)
        .insert([historyData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error logging scraping history:', error);
      throw error;
    }
  },

  async getScrapingHistory(filters = {}) {
    try {
      let query = supabase
        .from(tables.scraping_history)
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.source_type) {
        query = query.eq('source_type', filters.source_type);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error getting scraping history:', error);
      throw error;
    }
  },

  // Saved items
  async saveItem(userId, item) {
    try {
      const { data, error } = await supabase
        .from(tables.saved_items)
        .insert([{ user_id: userId, ...item }])
        .select()
        .single();
      
      if (error) throw error;
      logger.info(`Item saved for user: ${userId}`);
      return data;
    } catch (error) {
      logger.error('Error saving item:', error);
      throw error;
    }
  },

  async getSavedItems(userId, filters = {}) {
    try {
      let query = supabase
        .from(tables.saved_items)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (filters.item_type) {
        query = query.eq('item_type', filters.item_type);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error getting saved items:', error);
      throw error;
    }
  },

  async deleteSavedItem(userId, itemId) {
    try {
      const { data, error } = await supabase
        .from(tables.saved_items)
        .delete()
        .eq('user_id', userId)
        .eq('id', itemId);
      
      if (error) throw error;
      logger.info(`Saved item deleted: ${itemId}`);
      return data;
    } catch (error) {
      logger.error('Error deleting saved item:', error);
      throw error;
    }
  },

  // API keys management
  async saveApiKey(userId, service, keyData) {
    try {
      const { data, error } = await supabase
        .from(tables.api_keys)
        .upsert([{ user_id: userId, service, ...keyData }])
        .select()
        .single();
      
      if (error) throw error;
      logger.info(`API key saved: ${service} for user ${userId}`);
      return data;
    } catch (error) {
      logger.error('Error saving API key:', error);
      throw error;
    }
  },

  async getApiKeys(userId) {
    try {
      const { data, error } = await supabase
        .from(tables.api_keys)
        .select('service, key_name, created_at')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error getting API keys:', error);
      throw error;
    }
  },

  // Database health check
  async healthCheck() {
    try {
      const { data, error } = await supabase
        .from(tables.users)
        .select('count')
        .limit(1);
      
      if (error) throw error;
      return { status: 'healthy', timestamp: new Date().toISOString() };
    } catch (error) {
      logger.error('Database health check failed:', error);
      return { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() };
    }
  }
};

// Initialize database tables (run once)
async function initializeTables() {
  try {
    logger.info('Initializing database tables...');
    // This would typically be done through Supabase dashboard or migration scripts
    // For now, we'll just log that initialization should be done
    logger.info('Database tables should be created through Supabase dashboard');
    return true;
  } catch (error) {
    logger.error('Error initializing database tables:', error);
    throw error;
  }
}

module.exports = {
  supabase,
  supabaseAdmin,
  db,
  tables,
  initializeTables
}; 