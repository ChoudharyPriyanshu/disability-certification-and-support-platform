const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
    {
        application: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        certificateNumber: {
            type: String,
            unique: true,
            required: true,
        },
        disabilityType: {
            type: String,
            required: true,
        },
        disabilityPercentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        issuedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            required: true,
        },
        issuedDate: {
            type: Date,
            default: Date.now,
        },
        validUntil: {
            type: Date,
        },
        qrCodeData: {
            type: String,
        },
        pdfUrl: {
            type: String,
        },
        certificateHash: {
            type: String,
            unique: true,
        },
        blockchainTxHash: {
            type: String,
            default: null,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Certificate', certificateSchema);
