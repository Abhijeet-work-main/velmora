const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/scheduler/jobs - Get scheduled scraping jobs
router.get('/jobs', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: [],
    timestamp: new Date().toISOString()
  });
}));

// POST /api/scheduler/jobs - Create new scheduled job
router.post('/jobs', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Job creation endpoint',
    timestamp: new Date().toISOString()
  });
}));

module.exports = router; 