const express = require('express');
const router = express.Router();
const {
    getOpportunities,
    getOpportunityById,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    getApplicants
} = require('../controllers/opportunityController');
const { protect, requireAdmin } = require('../middleware/auth');

// Public/Protected routes (all users)
router.get('/', protect, getOpportunities);
router.get('/:id', protect, getOpportunityById);

// Admin only routes
router.post('/', protect, requireAdmin, createOpportunity);
router.put('/:id', protect, requireAdmin, updateOpportunity);
router.delete('/:id', protect, requireAdmin, deleteOpportunity);
router.get('/:id/applicants', protect, requireAdmin, getApplicants);

module.exports = router;
