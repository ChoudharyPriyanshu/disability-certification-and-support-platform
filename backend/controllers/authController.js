const User = require('../models/User');
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const generateToken = require('../utils/generateToken');
const { encrypt } = require('../utils/encryption');

/**
 * @desc    Register PwD user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, phone, aadhaar, address, dateOfBirth, gender } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists',
            });
        }

        // Encrypt Aadhaar if provided
        const encryptedAadhaar = aadhaar ? encrypt(aadhaar) : undefined;

        const user = await User.create({
            name,
            email,
            password,
            phone,
            aadhaar: encryptedAadhaar,
            address,
            dateOfBirth,
            gender,
        });

        const token = generateToken(user._id, 'PWD_USER');

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: 'PWD_USER',
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Register admin (protected — use for seeding or super-admin flow)
 * @route   POST /api/auth/admin/register
 * @access  Public (should be protected in production)
 */
const registerAdmin = async (req, res, next) => {
    try {
        const { name, email, password, institution, designation } = req.body;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'An admin account with this email already exists',
            });
        }

        const admin = await Admin.create({
            name,
            email,
            password,
            institution,
            designation,
        });

        const token = generateToken(admin._id, 'ADMIN');

        res.status(201).json({
            success: true,
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: 'ADMIN',
                institution: admin.institution,
                designation: admin.designation,
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Register doctor (admin-only)
 * @route   POST /api/auth/doctor/register
 * @access  Private (Admin)
 */
const registerDoctor = async (req, res, next) => {
    try {
        const { name, email, password, specialization, licenseNumber, hospital } = req.body;

        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({
                success: false,
                message: 'A doctor account with this email already exists',
            });
        }

        // Encrypt license number
        const encryptedLicense = licenseNumber ? encrypt(licenseNumber) : undefined;

        const doctor = await Doctor.create({
            name,
            email,
            password,
            specialization,
            licenseNumber: encryptedLicense,
            hospital,
        });

        const token = generateToken(doctor._id, 'DOCTOR');

        res.status(201).json({
            success: true,
            data: {
                _id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                role: 'DOCTOR',
                specialization: doctor.specialization,
                hospital: doctor.hospital,
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login (all roles)
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        let user;
        let userRole;

        // Look up user in the appropriate collection
        switch (role) {
            case 'ADMIN':
                user = await Admin.findOne({ email }).select('+password');
                userRole = 'ADMIN';
                break;
            case 'DOCTOR':
                user = await Doctor.findOne({ email }).select('+password');
                userRole = 'DOCTOR';
                break;
            default:
                user = await User.findOne({ email }).select('+password');
                userRole = 'PWD_USER';
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        const token = generateToken(user._id, userRole);

        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: userRole,
                ...(userRole === 'ADMIN' && {
                    institution: user.institution,
                    designation: user.designation,
                }),
                ...(userRole === 'DOCTOR' && {
                    specialization: user.specialization,
                    hospital: user.hospital,
                }),
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
    try {
        res.json({
            success: true,
            data: req.user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
    try {
        const { name, phone, address, dateOfBirth, gender } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;
        if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
        if (gender) updateData.gender = gender;

        let Model;
        switch (req.user.role) {
            case 'ADMIN':
                Model = Admin;
                break;
            case 'DOCTOR':
                Model = Doctor;
                break;
            default:
                Model = User;
        }

        const updatedUser = await Model.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    registerAdmin,
    registerDoctor,
    loginUser,
    getProfile,
    updateProfile,
};
