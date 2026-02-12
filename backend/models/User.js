const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default
    },
    role: {
        type: String,
        enum: ['PWD_USER', 'ADMIN', 'DOCTOR'],
        default: 'PWD_USER',
        required: true
    },
    profile: {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number']
        },
        dateOfBirth: {
            type: Date,
            required: function () { return this.role === 'PWD_USER'; }
        },
        address: {
            street: String,
            city: String,
            state: String,
            pincode: String
        },
        // Doctor-specific fields
        medicalLicenseNumber: {
            type: String,
            required: function () { return this.role === 'DOCTOR'; }
        },
        specialization: {
            type: String,
            required: function () { return this.role === 'DOCTOR'; }
        },
        hospital: {
            type: String,
            required: function () { return this.role === 'DOCTOR'; }
        }
    },
    // Aadhaar verification (SECURE - No full Aadhaar stored)
    aadhaar: {
        lastFourDigits: {
            type: String,
            match: [/^\d{4}$/, 'Last four digits must be 4 digits']
        },
        hashedReference: {
            type: String // SHA-256 hash of full Aadhaar for verification
        },
        verified: {
            type: Boolean,
            default: false
        },
        verifiedAt: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// Virtual for full name
userSchema.virtual('fullName').get(function () {
    return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
