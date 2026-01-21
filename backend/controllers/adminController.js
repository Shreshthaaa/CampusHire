const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });

        const totalOpportunities = await Opportunity.countDocuments();

        const activeOpportunities = await Opportunity.countDocuments({
            isActive: true,
            deadline: { $gte: new Date() }
        });

        const totalApplications = await Application.countDocuments();

        const applicationsByStatus = await Application.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const statusCounts = {
            Applied: 0,
            Shortlisted: 0,
            Rejected: 0
        };

        applicationsByStatus.forEach(item => {
            statusCounts[item._id] = item.count;
        });

        res.json({
            totalStudents,
            totalOpportunities,
            activeOpportunities,
            totalApplications,
            applicationsByStatus: statusCounts
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
    }
};

// @desc    Get admin analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
    try {
        const mostAppliedCompanies = await Application.aggregate([
            {
                $lookup: {
                    from: 'opportunities',
                    localField: 'opportunityId',
                    foreignField: '_id',
                    as: 'opportunity'
                }
            },
            { $unwind: '$opportunity' },
            {
                $group: {
                    _id: '$opportunity.companyName',
                    applicationCount: { $sum: 1 }
                }
            },
            { $sort: { applicationCount: -1 } },
            { $limit: 10 }
        ]);

        const applicationsPerOpportunity = await Application.aggregate([
            {
                $lookup: {
                    from: 'opportunities',
                    localField: 'opportunityId',
                    foreignField: '_id',
                    as: 'opportunity'
                }
            },
            { $unwind: '$opportunity' },
            {
                $group: {
                    _id: '$opportunityId',
                    companyName: { $first: '$opportunity.companyName' },
                    role: { $first: '$opportunity.role' },
                    applicationCount: { $sum: 1 }
                }
            },
            { $sort: { applicationCount: -1 } }
        ]);

        const studentsWithApplications = await Application.distinct('userId');
        const totalStudents = await User.countDocuments({ role: 'student' });
        const participationRate = totalStudents > 0
            ? ((studentsWithApplications.length / totalStudents) * 100).toFixed(2)
            : 0;

        res.json({
            mostAppliedCompanies,
            applicationsPerOpportunity,
            participationRate: parseFloat(participationRate),
            activeStudents: studentsWithApplications.length,
            totalStudents
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
    }
};

module.exports = {
    getStats,
    getAnalytics
};
