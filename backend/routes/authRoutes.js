const express = require('express');
const router = express.Router();
const {
    registerUser,
    registerAdmin,
    registerDoctor,
    loginUser,
    getProfile,
    updateProfile,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin/register', registerAdmin);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/doctor/register', protect, authorize('ADMIN'), registerDoctor);

module.exports = router;
