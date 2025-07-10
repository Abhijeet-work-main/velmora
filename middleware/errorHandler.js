const logger = require('../utils/logger');

// Custom error class
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error types
const ErrorTypes = {
  VALIDATION_ERROR: 'ValidationError',
  AUTHENTICATION_ERROR: 'AuthenticationError',
  AUTHORIZATION_ERROR: 'AuthorizationError',
  NOT_FOUND_ERROR: 'NotFoundError',
  SCRAPING_ERROR: 'ScrapingError',
  DATABASE_ERROR: 'DatabaseError',
  RATE_LIMIT_ERROR: 'RateLimitError',
  EXTERNAL_API_ERROR: 'ExternalApiError'
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`Error ${err.name}: ${err.message}`, {
    error: err,
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      params: req.params,
      query: req.query,
      ip: req.ip
    },
    user: req.user ? { id: req.user.id, email: req.user.email } : null
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Invalid resource ID';
    error = new AppError(message, 400);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired. Please log in again';
    error = new AppError(message, 401);
  }

  // Puppeteer errors
  if (err.name === 'TimeoutError') {
    const message = 'Request timeout. The website took too long to respond';
    error = new AppError(message, 408);
  }

  // Network errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    const message = 'Unable to connect to the target website';
    error = new AppError(message, 503);
  }

  // Rate limiting errors
  if (err.status === 429) {
    const message = 'Too many requests. Please try again later';
    error = new AppError(message, 429);
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  const isOperational = error.isOperational || false;

  // Response object
  const response = {
    success: false,
    error: {
      message,
      type: err.name || 'UnknownError',
      statusCode
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };

  // Add error details in development
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
    response.error.details = err;
  }

  // Add request ID if available
  if (req.requestId) {
    response.requestId = req.requestId;
  }

  // Send error response
  res.status(statusCode).json(response);
};

// 404 handler
const notFoundHandler = (req, res) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  res.status(404).json({
    success: false,
    error: {
      message: error.message,
      type: 'NotFoundError',
      statusCode: 404
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  });
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Validation error handler
const validationErrorHandler = (errors) => {
  const message = errors.array().map(error => ({
    field: error.param,
    message: error.msg,
    value: error.value
  }));
  
  return new AppError('Validation failed', 400, true);
};

// Scraping error handler
const scrapingErrorHandler = (error, url) => {
  logger.error(`Scraping failed for ${url}:`, error);
  
  let message = 'Scraping failed';
  let statusCode = 500;
  
  if (error.message.includes('timeout')) {
    message = 'Website took too long to respond';
    statusCode = 408;
  } else if (error.message.includes('404')) {
    message = 'Page not found';
    statusCode = 404;
  } else if (error.message.includes('403') || error.message.includes('blocked')) {
    message = 'Access denied by website';
    statusCode = 403;
  } else if (error.message.includes('ECONNREFUSED')) {
    message = 'Unable to connect to website';
    statusCode = 503;
  }
  
  return new AppError(message, statusCode);
};

// Database error handler
const databaseErrorHandler = (error) => {
  logger.error('Database error:', error);
  
  let message = 'Database operation failed';
  let statusCode = 500;
  
  if (error.code === 'PGRST116') {
    message = 'Record not found';
    statusCode = 404;
  } else if (error.code === '23505') {
    message = 'Duplicate record';
    statusCode = 409;
  } else if (error.code === '23503') {
    message = 'Referenced record not found';
    statusCode = 400;
  }
  
  return new AppError(message, statusCode);
};

// External API error handler
const externalApiErrorHandler = (error, service) => {
  logger.error(`External API error for ${service}:`, error);
  
  let message = `${service} service unavailable`;
  let statusCode = 503;
  
  if (error.response?.status === 401) {
    message = `Invalid API key for ${service}`;
    statusCode = 401;
  } else if (error.response?.status === 403) {
    message = `Access denied by ${service}`;
    statusCode = 403;
  } else if (error.response?.status === 404) {
    message = `Resource not found in ${service}`;
    statusCode = 404;
  } else if (error.response?.status === 429) {
    message = `Rate limit exceeded for ${service}`;
    statusCode = 429;
  }
  
  return new AppError(message, statusCode);
};

// Request ID middleware
const requestIdMiddleware = (req, res, next) => {
  req.requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader('X-Request-ID', req.requestId);
  next();
};

module.exports = {
  AppError,
  ErrorTypes,
  errorHandler,
  notFoundHandler,
  asyncHandler,
  validationErrorHandler,
  scrapingErrorHandler,
  databaseErrorHandler,
  externalApiErrorHandler,
  requestIdMiddleware
}; 