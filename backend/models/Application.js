const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicationNumber: {
        type: String,
        unique: true,
        required: true
    },
    personalInfo: {
        aadharNumber: {
            type: String,
            required: true,
            match: [/^\d{12}$/, 'Aadhar must be 12 digits']
        },
        guardianName: String,
        guardianRelation: String
    },
    disabilityInfo: {
        type: {
            type: String,
            required: true,
            enum: [
                'Visual Impairment',
                'Hearing Impairment',
                'Locomotor Disability',
                'Mental Illness',
                'Intellectual Disability',
                'Learning Disability',
                'Autism Spectrum Disorder',
                'Multiple Disabilities',
                'Other'
            ]
        },
        percentage: {
            type: Number,
            min: 0,
            max: 100
        },
        description: {
            type: String,
            required: true,
            maxlength: 1000
        },
        since: Date
    },
    documents: {
        medicalCertificate: {
            filename: String,
            path: String,
            uploadedAt: Date
        },
        aadharCard: {
            filename: String,
            path: String,
            uploadedAt: Date
        },
        photograph: {
            filename: String,
            path: String,
            uploadedAt: Date
        },
        additionalDocs: [{
            filename: String,
            path: String,
            uploadedAt: Date
        }]
    },
    status: {
        type: String,
        enum: [
            'SUBMITTED',
            'VERIFIED',
            'DOCTOR_ASSIGNED',
            'ASSESSED',
            'APPROVED',
            'REJECTED',
            'CERTIFICATE_ISSUED'
        ],
        default: 'SUBMITTED'
    },
    assignedDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assessment: {
        doctorNotes: String,
        assessedPercentage: Number,
        assessmentDate: Date,
        recommendations: String
    },
    adminNotes: String,
    rejectionReason: String,
    statusHistory: [{
        status: String,
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        changedAt: {
            type: Date,
            default: Date.now
        },
        notes: String
    }]
}, {
    timestamps: true
});

// Generate application number before saving
applicationSchema.pre('save', async function (next) {
    if (this.isNew) {
        // Generate format: DCA-YYYY-XXXXXX
        const year = new Date().getFullYear();
        const count = await this.constructor.countDocuments();
        this.applicationNumber = `DCA-${year}-${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

// Add status change to history
applicationSchema.methods.updateStatus = function (newStatus, changedBy, notes = '') {
    this.status = newStatus;
    this.statusHistory.push({
        status: newStatus,
        changedBy,
        notes
    });
};

module.exports = mongoose.model('Application', applicationSchema);
