const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    application: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    certificateNumber: {
        type: String,
        unique: true,
        required: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    validUntil: {
        type: Date,
        required: true
    },
    disabilityType: {
        type: String,
        required: true
    },
    disabilityPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    certificateHash: {
        type: String,
        required: true,
        unique: true
    },
    blockchain: {
        transactionHash: String,
        blockNumber: Number,
        timestamp: Date,
        verified: {
            type: Boolean,
            default: false
        }
    },
    qrCodeData: {
        type: String,
        required: true
    },
    issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Generate certificate number before saving
certificateSchema.pre('save', async function (next) {
    if (this.isNew) {
        // Generate format: UDID-YYYY-XXXXXXXXXX
        const year = new Date().getFullYear();
        const count = await this.constructor.countDocuments();
        this.certificateNumber = `UDID-${year}-${String(count + 1).padStart(10, '0')}`;

        // Set validity (5 years from issue date)
        if (!this.validUntil) {
            this.validUntil = new Date(this.issueDate);
            this.validUntil.setFullYear(this.validUntil.getFullYear() + 5);
        }
    }
    next();
});

module.exports = mongoose.model('Certificate', certificateSchema);
