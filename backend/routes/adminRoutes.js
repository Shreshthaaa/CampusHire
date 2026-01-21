const express = require('express');
const router = express.Router();
const { getStats, getAnalytics } = require('../controllers/adminController');
const { protect, requireAdmin } = require('../middleware/auth');
router.get('/stats', protect, requireAdmin, getStats);
router.get('/analytics', protect, requireAdmin, getAnalytics);

module.exports = router;
