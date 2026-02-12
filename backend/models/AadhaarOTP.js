const mongoose = require('mongoose');
const crypto = require('crypto');

const aadhaarOTPSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    aadhaarLastFour: {
        type: String,
        required: true,
        length: 4
    },
    otpHash: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // Auto-delete expired OTPs
    },
    attempts: {
        type: Number,
        default: 0,
        max: 3
    },
    verified: {
        type: Boolean,
        default: false
    },
    // Rate limiting fields
    requestIp: String,
    requestCount: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

// Hash OTP before saving
aadhaarOTPSchema.methods.hashOTP = function (otp) {
    return crypto.createHash('sha256').update(otp.toString()).digest('hex');
};

// Verify OTP
aadhaarOTPSchema.methods.verifyOTP = function (candidateOTP) {
    const hashedCandidate = crypto.createHash('sha256').update(candidateOTP.toString()).digest('hex');
    return hashedCandidate === this.otpHash;
};

// Check if OTP is expired
aadhaarOTPSchema.methods.isExpired = function () {
    return Date.now() > this.expiresAt;
};

// Increment attempts
aadhaarOTPSchema.methods.incrementAttempts = function () {
    this.attempts += 1;
    return this.save();
};

module.exports = mongoose.model('AadhaarOTP', aadhaarOTPSchema);
