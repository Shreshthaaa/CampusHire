const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');

// @desc    Apply to an opportunity
// @route   POST /api/applications
// @access  Private/Student
const applyToOpportunity = async (req, res) => {
    try {
        const { opportunityId } = req.body;

        if (!opportunityId) {
            return res.status(400).json({ message: 'Opportunity ID is required' });
        }

        const opportunity = await Opportunity.findById(opportunityId);

        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }

        if (!opportunity.isActive) {
            return res.status(400).json({ message: 'This opportunity is no longer active' });
        }
        if (new Date() > opportunity.deadline) {
            return res.status(400).json({ message: 'Application deadline has passed' });
        }

        const user = await User.findById(req.user._id);

        if (opportunity.eligibility.minCGR && user.cgr < opportunity.eligibility.minCGR) {
            return res.status(400).json({
                message: `Minimum CGR requirement is ${opportunity.eligibility.minCGR}`
            });
        }

        if (opportunity.eligibility.branches && opportunity.eligibility.branches.length > 0) {
            if (!opportunity.eligibility.branches.includes(user.branch)) {
                return res.status(400).json({
                    message: `This opportunity is only for ${opportunity.eligibility.branches.join(', ')} branches`
                });
            }
        }

        if (opportunity.eligibility.batches && opportunity.eligibility.batches.length > 0) {
            if (!opportunity.eligibility.batches.includes(user.batch)) {
                return res.status(400).json({
                    message: `This opportunity is only for ${opportunity.eligibility.batches.join(', ')} batches`
                });
            }
        }

        const existingApplication = await Application.findOne({
            userId: req.user._id,
            opportunityId
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied to this opportunity' });
        }

        const application = await Application.create({
            userId: req.user._id,
            opportunityId
        });

        const populatedApplication = await Application.findById(application._id)
            .populate('opportunityId', 'companyName role description deadline')
            .populate('userId', 'name email');

        res.status(201).json({
            message: 'Application submitted successfully',
            application: populatedApplication
        });
    } catch (error) {
        console.error('Apply to opportunity error:', error);
        res.status(500).json({ message: 'Failed to submit application', error: error.message });
    }
};

// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private/Student
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ userId: req.user._id })
            .populate('opportunityId', 'companyName role description deadline isActive')
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error('Get my applications error:', error);
        res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status || !['Applied', 'Shortlisted', 'Rejected'].includes(status)) {
            return res.status(400).json({
                message: 'Valid status is required (Applied, Shortlisted, or Rejected)'
            });
        }

        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = status;
        await application.save();

        const updatedApplication = await Application.findById(application._id)
            .populate('userId', 'name email branch batch cgr')
            .populate('opportunityId', 'companyName role');

        res.json({
            message: 'Application status updated successfully',
            application: updatedApplication
        });
    } catch (error) {
        console.error('Update application status error:', error);
        res.status(500).json({ message: 'Failed to update application status', error: error.message });
    }
};

module.exports = {
    applyToOpportunity,
    getMyApplications,
    updateApplicationStatus
};
