const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { requireAadhaarVerification } = require('../middleware/aadhaarMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// All routes require authentication
router.use(authenticate);

// Submit application (PWD_USER) - Requires Aadhaar verification
router.post('/',
    authorize('PWD_USER'),
    requireAadhaarVerification,
    applicationController.submitApplication
);

// Get applications (role-filtered)
router.get('/', applicationController.getApplications);

// Get single application
router.get('/:id', applicationController.getApplicationById);

// Upload documents
router.patch('/:id/documents',
    authorize('PWD_USER'),
    uploadMiddleware.fields([
        { name: 'medicalCertificate', maxCount: 1 },
        { name: 'aadharCard', maxCount: 1 },
        { name: 'photograph', maxCount: 1 }
    ]),
    applicationController.uploadDocuments
);

// Update application status (ADMIN)
router.patch('/:id/status',
    authorize('ADMIN'),
    applicationController.updateApplicationStatus
);

// Assign doctor (ADMIN)
router.patch('/:id/assign-doctor',
    authorize('ADMIN'),
    applicationController.assignDoctor
);

// Submit assessment (DOCTOR)
router.patch('/:id/assessment',
    authorize('DOCTOR'),
    applicationController.submitAssessment
);

module.exports = router;
