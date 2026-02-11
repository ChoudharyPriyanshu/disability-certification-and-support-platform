const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Financial Assistance',
            'Education',
            'Employment',
            'Healthcare',
            'Social Security',
            'Housing',
            'Transportation',
            'Other'
        ]
    },
    eligibility: {
        minDisabilityPercentage: {
            type: Number,
            min: 0,
            max: 100
        },
        ageLimit: {
            min: Number,
            max: Number
        },
        incomeLimit: Number,
        applicableDisabilities: [String],
        otherCriteria: String
    },
    benefits: {
        type: String,
        required: true,
        maxlength: 1000
    },
    applicationProcess: {
        type: String,
        required: true,
        maxlength: 1500
    },
    requiredDocuments: [String],
    contactInfo: {
        department: String,
        phone: String,
        email: String,
        website: String,
        address: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    state: {
        type: String,
        default: 'All India'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('GovernmentScheme', schemeSchema);
