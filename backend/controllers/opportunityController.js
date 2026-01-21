const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');

// @desc    Get all active opportunities
// @route   GET /api/opportunities
// @access  Private
const getOpportunities = async (req, res) => {
    try {
        const opportunities = await Opportunity.find({
            isActive: true,
            deadline: { $gte: new Date() }
        })
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(opportunities);
    } catch (error) {
        console.error('Get opportunities error:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({ message: 'Failed to fetch opportunities', error: error.message });
    }
};

// @desc    Get opportunity by ID
// @route   GET /api/opportunities/:id
// @access  Private
const getOpportunityById = async (req, res) => {
    try {
        if (!req.params.id || req.params.id === 'undefined' || !require('mongoose').Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Opportunity ID' });
        }

        const opportunity = await Opportunity.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }

        const application = await Application.findOne({
            opportunityId: req.params.id,
            userId: req.user._id
        });

        const opportunityData = opportunity.toObject();
        if (application) {
            opportunityData.applicationStatus = application.status;
        }

        res.json(opportunityData);
    } catch (error) {
        console.error('Get opportunity error:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({ message: 'Failed to fetch opportunity', error: error.message });
    }
};

// @desc    Create new opportunity
// @route   POST /api/opportunities
// @access  Private/Admin
const createOpportunity = async (req, res) => {
    try {
        const { companyName, role, description, eligibility, deadline, location, salary, requirements } = req.body;

        if (!companyName || !role || !description || !deadline) {
            return res.status(400).json({
                message: 'Please provide all required fields: companyName, role, description, deadline'
            });
        }

        const opportunity = await Opportunity.create({
            companyName,
            role,
            description,
            eligibility: eligibility || {},
            location,
            salary,
            requirements,
            deadline: (() => {
                const d = new Date(deadline);
                d.setHours(23, 59, 59, 999);
                return d;
            })(),
            createdBy: req.user._id
        });

        const populatedOpportunity = await Opportunity.findById(opportunity._id)
            .populate('createdBy', 'name email');

        res.status(201).json({
            message: 'Opportunity created successfully',
            opportunity: populatedOpportunity
        });
    } catch (error) {
        console.error('Create opportunity error:', error);
        res.status(500).json({ message: 'Failed to create opportunity', error: error.message });
    }
};

// @desc    Update opportunity
// @route   PUT /api/opportunities/:id
// @access  Private/Admin
const updateOpportunity = async (req, res) => {
    try {
        const { companyName, role, description, eligibility, deadline, isActive, location, salary, requirements } = req.body;

        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }

        if (companyName !== undefined) opportunity.companyName = companyName;
        if (role !== undefined) opportunity.role = role;
        if (description !== undefined) opportunity.description = description;
        if (eligibility !== undefined) opportunity.eligibility = eligibility;
        if (deadline !== undefined) {
            const d = new Date(deadline);
            d.setHours(23, 59, 59, 999);
            opportunity.deadline = d;
        }
        if (isActive !== undefined) opportunity.isActive = isActive;
        if (location !== undefined) opportunity.location = location;
        if (salary !== undefined) opportunity.salary = salary;
        if (requirements !== undefined) opportunity.requirements = requirements;

        await opportunity.save();

        const updatedOpportunity = await Opportunity.findById(opportunity._id)
            .populate('createdBy', 'name email');

        res.json({
            message: 'Opportunity updated successfully',
            opportunity: updatedOpportunity
        });
    } catch (error) {
        console.error('Update opportunity error:', error);
        res.status(500).json({ message: 'Failed to update opportunity', error: error.message });
    }
};

// @desc    Delete opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private/Admin
const deleteOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }

        await Application.deleteMany({ opportunityId: req.params.id });

        await opportunity.deleteOne();

        res.json({ message: 'Opportunity and related applications deleted successfully' });
    } catch (error) {
        console.error('Delete opportunity error:', error);
        res.status(500).json({ message: 'Failed to delete opportunity', error: error.message });
    }
};

// @desc    Get applicants for an opportunity
// @route   GET /api/opportunities/:id/applicants
// @access  Private/Admin
const getApplicants = async (req, res) => {
    try {
        const applications = await Application.find({ opportunityId: req.params.id })
            .populate('userId', 'name email branch batch cgr resumeLink profilePicture')
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error('Get applicants error:', error);
        res.status(500).json({ message: 'Failed to fetch applicants', error: error.message });
    }
};

module.exports = {
    getOpportunities,
    getOpportunityById,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    getApplicants
};
