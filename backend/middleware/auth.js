const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');

/**
 * Protect routes — verify JWT and attach user to request
 */
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized — no token provided',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Look up user in the appropriate collection based on role
        let user;
        switch (decoded.role) {
            case 'ADMIN':
                user = await Admin.findById(decoded.id).select('-password');
                break;
            case 'DOCTOR':
                user = await Doctor.findById(decoded.id).select('-password');
                break;
            default:
                user = await User.findById(decoded.id).select('-password');
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized — user not found',
            });
        }

        req.user = user;
        req.user.role = decoded.role;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized — invalid token',
        });
    }
};

/**
 * Authorize by role — restrict access to specific roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user.role}' is not authorized to access this route`,
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
