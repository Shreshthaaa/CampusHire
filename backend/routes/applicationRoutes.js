const express = require('express');
const router = express.Router();
const {
    applyToOpportunity,
    getMyApplications,
    updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, requireAdmin } = require('../middleware/auth');

// Student routes
router.post('/', protect, applyToOpportunity);
router.get('/my-applications', protect, getMyApplications);

// Admin routes
router.put('/:id/status', protect, requireAdmin, updateApplicationStatus);

module.exports = router;
