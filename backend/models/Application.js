const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
    {
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Personal details snapshot
        applicantName: {
            type: String,
            required: true,
        },
        dateOfBirth: Date,
        gender: String,
        address: String,
        phone: String,

        // Disability information
        disabilityType: {
            type: String,
            required: [true, 'Disability type is required'],
            enum: [
                'Locomotor',
                'Visual',
                'Hearing',
                'Speech & Language',
                'Intellectual',
                'Mental Illness',
                'Multiple Disabilities',
                'Other',
            ],
        },
        disabilityDescription: {
            type: String,
            required: [true, 'Disability description is required'],
        },
        congenitalOrAcquired: {
            type: String,
            enum: ['Congenital', 'Acquired'],
        },

        // Documents
        documents: [
            {
                name: { type: String, required: true },
                url: { type: String, required: true },
                type: {
                    type: String,
                    enum: ['medical_report', 'id_proof', 'photo', 'address_proof', 'other'],
                },
                uploadedAt: { type: Date, default: Date.now },
            },
        ],

        // Workflow status
        status: {
            type: String,
            enum: [
                'SUBMITTED',
                'UNDER_REVIEW',
                'DOCTOR_ASSIGNED',
                'ASSESSMENT_SCHEDULED',
                'ASSESSMENT_COMPLETED',
                'APPROVED',
                'REJECTED',
            ],
            default: 'SUBMITTED',
        },

        // Doctor assignment
        assignedDoctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',
        },
        assessmentDate: Date,

        // Doctor evaluation
        doctorEvaluation: {
            disabilityType: String,
            disabilityPercentage: {
                type: Number,
                min: 0,
                max: 100,
            },
            notes: String,
            supportingDocuments: [
                {
                    name: String,
                    url: String,
                    type: {
                        type: String,
                        enum: ['photograph', 'report', 'other'],
                    },
                    uploadedAt: { type: Date, default: Date.now },
                },
            ],
            submittedAt: Date,
        },

        // Admin actions
        adminRemarks: String,
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
        },

        // Status history for timeline tracking
        statusHistory: [
            {
                status: String,
                changedAt: { type: Date, default: Date.now },
                changedBy: mongoose.Schema.Types.ObjectId,
                remarks: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Add status change to history on save (Mongoose 9 async style — no next())
applicationSchema.pre('save', async function () {
    if (this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            changedAt: new Date(),
            changedBy: this._statusChangedBy || null,
            remarks: this._statusRemarks || '',
        });
    }
});

module.exports = mongoose.model('Application', applicationSchema);
