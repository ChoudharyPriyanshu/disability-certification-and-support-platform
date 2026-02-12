const AadhaarOTP = require('../models/AadhaarOTP');
const User = require('../models/User');
const crypto = require('crypto');

/**
 * Request Aadhaar OTP
 * SECURITY: Rate limited, generates 6-digit OTP, 5-minute expiration
 */
exports.requestAadhaarOTP = async (req, res) => {
    try {
        const { aadhaarNumber } = req.body;

        // Validate Aadhaar format (12 digits)
        if (!aadhaarNumber || !/^\d{12}$/.test(aadhaarNumber)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Aadhaar number format'
            });
        }

        // Get user from JWT
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Check if already verified
        if (user.aadhaar && user.aadhaar.verified) {
            return res.status(400).json({
                success: false,
                error: 'Aadhaar already verified for this account'
            });
        }

        // Rate limiting: Check recent OTP requests from this IP
        const recentOTPs = await AadhaarOTP.countDocuments({
            requestIp: req.ip,
            createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } // Last hour
        });

        if (recentOTPs >= 5) {
            return res.status(429).json({
                success: false,
                error: 'Too many OTP requests. Please try again later.'
            });
        }

        // Delete any existing unverified OTPs for this user
        await AadhaarOTP.deleteMany({ user: user._id, verified: false });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Hash the Aadhaar number (never store plaintext)
        const hashedAadhaar = crypto.createHash('sha256').update(aadhaarNumber).digest('hex');

        // Create OTP record
        const otpRecord = new AadhaarOTP({
            user: user._id,
            aadhaarLastFour: aadhaarNumber.slice(-4),
            otpHash: crypto.createHash('sha256').update(otp.toString()).digest('hex'),
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
            requestIp: req.ip
        });

        await otpRecord.save();

        // TODO: In production, send OTP via SMS/Email
        // For development, return OTP in response (REMOVE IN PRODUCTION)
        console.log(`[DEV ONLY] OTP for Aadhaar ending in ${aadhaarNumber.slice(- 4)}: ${otp}`);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            data: {
                aadhaarLastFour: aadhaarNumber.slice(-4),
                expiresIn: 300, // seconds
                // DEV ONLY - Remove in production
                devOTP: process.env.NODE_ENV === 'development' ? otp : undefined
            }
        });

    } catch (error) {
        console.error('Aadhaar OTP request error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send OTP'
        });
    }
};

/**
 * Verify Aadhaar OTP
 * SECURITY: Max 3 attempts, OTP consumed after verification
 */
exports.verifyAadhaarOTP = async (req, res) => {
    try {
        const { aadhaarNumber, otp } = req.body;

        // Validate inputs
        if (!aadhaarNumber || !/^\d{12}$/.test(aadhaarNumber)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Aadhaar number format'
            });
        }

        if (!otp || !/^\d{6}$/.test(otp.toString())) {
            return res.status(400).json({
                success: false,
                error: 'Invalid OTP format'
            });
        }

        // Get user
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Find OTP record
        const otpRecord = await AadhaarOTP.findOne({
            user: user._id,
            aadhaarLastFour: aadhaarNumber.slice(-4),
            verified: false
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(404).json({
                success: false,
                error: 'No valid OTP found. Please request a new OTP.'
            });
        }

        // Check if expired
        if (otpRecord.isExpired()) {
            await otpRecord.deleteOne();
            return res.status(400).json({
                success: false,
                error: 'OTP has expired. Please request a new one.'
            });
        }

        // Check attempts
        if (otpRecord.attempts >= 3) {
            await otpRecord.deleteOne();
            return res.status(400).json({
                success: false,
                error: 'Maximum verification attempts exceeded. Please request a new OTP.'
            });
        }

        // Verify OTP
        const isValid = otpRecord.verifyOTP(otp);

        if (!isValid) {
            await otpRecord.incrementAttempts();
            return res.status(400).json({
                success: false,
                error: `Invalid OTP. ${3 - otpRecord.attempts - 1} attempts remaining.`
            });
        }

        // OTP verified successfully
        // Hash the Aadhaar for storage
        const hashedAadhaar = crypto.createHash('sha256').update(aadhaarNumber).digest('hex');

        // Update user record
        user.aadhaar = {
            lastFourDigits: aadhaarNumber.slice(-4),
            hashedReference: hashedAadhaar,
            verified: true,
            verifiedAt: new Date()
        };

        await user.save();

        // Mark OTP as verified and delete
        await otpRecord.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Aadhaar verified successfully',
            data: {
                verified: true,
                aadhaarLastFour: aadhaarNumber.slice(-4)
            }
        });

    } catch (error) {
        console.error('Aadhaar OTP verification error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to verify OTP'
        });
    }
};

/**
 * Check Aadhaar verification status
 */
exports.checkAadhaarStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.json({
            success: true,
            data: {
                verified: user.aadhaar?.verified || false,
                aadhaarLastFour: user.aadhaar?.lastFourDigits,
                verifiedAt: user.aadhaar?.verifiedAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to check status'
        });
    }
};
