const express = require('express');
const router = express.Router();
const {
    submitApplication,
    getMyApplications,
    getApplication,
    uploadDocuments,
    getAllApplications,
    reviewApplication,
    assignDoctor,
    scheduleAssessment,
    approveApplication,
    rejectApplication,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// PwD User routes
router.post('/', protect, authorize('PWD_USER'), upload.array('documents', 5), submitApplication);
router.get('/my', protect, authorize('PWD_USER'), getMyApplications);

// Shared route (all authenticated users)
router.get('/:id', protect, getApplication);

// Document upload
router.post('/:id/documents', protect, authorize('PWD_USER'), upload.array('documents', 5), uploadDocuments);

// Admin routes
router.get('/', protect, authorize('ADMIN'), getAllApplications);
router.put('/:id/review', protect, authorize('ADMIN'), reviewApplication);
router.put('/:id/assign-doctor', protect, authorize('ADMIN'), assignDoctor);
router.put('/:id/schedule', protect, authorize('ADMIN'), scheduleAssessment);
router.put('/:id/approve', protect, authorize('ADMIN'), approveApplication);
router.put('/:id/reject', protect, authorize('ADMIN'), rejectApplication);

module.exports = router;
