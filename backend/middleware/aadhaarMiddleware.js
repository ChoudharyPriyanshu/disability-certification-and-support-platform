const User = require('../models/User');

/**
 * Middleware to check if user has verified Aadhaar
 * Use this before allowing application submission
 */
exports.requireAadhaarVerification = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Check if Aadhaar is verified
        if (!user.aadhaar || !user.aadhaar.verified) {
            return res.status(403).json({
                success: false,
                error: 'Aadhaar verification required before submitting application',
                code: 'AADHAAR_NOT_VERIFIED'
            });
        }

        next();
    } catch (error) {
        console.error('Aadhaar verification check error:', error);
        res.status(500).json({
            success: false,
            error: 'Verification check failed'
        });
    }
};
