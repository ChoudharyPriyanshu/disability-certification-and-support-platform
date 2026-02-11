const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Public verification endpoint (no auth required)
router.get('/verify', certificateController.verifyCertificate);

// Protected routes
router.use(authenticate);

// Issue certificate (ADMIN)
router.post('/issue',
    authorize('ADMIN'),
    certificateController.issueCertificate
);

// Get user's certificates
router.get('/my-certificates', certificateController.getUserCertificates);

// Get certificate by ID
router.get('/:id', certificateController.getCertificateById);

// Get certificate by application
router.get('/application/:applicationId', certificateController.getCertificateByApplication);

module.exports = router;
