const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    eligibility: {
        minCGR: {
            type: Number,
            default: 0,
            min: 0,
            max: 10
        },
        branches: {
            type: [String],
            default: []
        },
        batches: {
            type: [String],
            default: []
        }
    },
    location: {
        type: String,
        trim: true
    },
    salary: {
        type: String,
        trim: true
    },
    requirements: {
        type: String,
        trim: true
    },
    deadline: {
        type: Date,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for faster queries
opportunitySchema.index({ isActive: 1, deadline: 1 });
opportunitySchema.index({ createdBy: 1 });

// Virtual to check if opportunity is expired
opportunitySchema.virtual('isExpired').get(function () {
    return new Date() > this.deadline;
});

// Virtual for status string
opportunitySchema.virtual('status').get(function () {
    const isExpired = new Date() > this.deadline;
    return (this.isActive && !isExpired) ? 'Open' : 'Closed';
});

const Opportunity = mongoose.model('Opportunity', opportunitySchema);

module.exports = Opportunity;
