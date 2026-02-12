const express = require('express');
const router = express.Router();
const aadhaarController = require('../controllers/aadhaarController');
const { authenticate } = require('../middleware/authMiddleware');

// All Aadhaar routes require authentication
router.use(authenticate);

// Request Aadhaar OTP
router.post('/request-otp', aadhaarController.requestAadhaarOTP);

// Verify Aadhaar OTP
router.post('/verify-otp', aadhaarController.verifyAadhaarOTP);

// Check Aadhaar verification status
router.get('/status', aadhaarController.checkAadhaarStatus);

module.exports = router;
