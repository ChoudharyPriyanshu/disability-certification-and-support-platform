const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Scheme name is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        eligibilityCriteria: {
            type: String,
        },
        benefits: {
            type: String,
            required: [true, 'Benefits information is required'],
        },
        applicationUrl: {
            type: String,
            trim: true,
        },
        ministry: {
            type: String,
            trim: true,
        },
        disabilityTypes: [
            {
                type: String,
                enum: [
                    'Locomotor',
                    'Visual',
                    'Hearing',
                    'Speech & Language',
                    'Intellectual',
                    'Mental Illness',
                    'Multiple Disabilities',
                    'All',
                ],
            },
        ],
        minimumPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Scheme', schemeSchema);
