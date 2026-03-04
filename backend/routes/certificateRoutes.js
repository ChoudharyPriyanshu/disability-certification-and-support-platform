const express = require('express');
const router = express.Router();
const {
    generateCertificate,
    getMyCertificates,
    downloadCertificate,
    verifyCertificate,
    getAllCertificates,
} = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/auth');

// Public verification route
router.get('/verify/:hash', verifyCertificate);

// PwD user routes
router.get('/my', protect, authorize('PWD_USER'), getMyCertificates);
router.get('/:id/download', protect, downloadCertificate);

// Admin routes
router.post('/generate/:applicationId', protect, authorize('ADMIN'), generateCertificate);
router.get('/', protect, authorize('ADMIN'), getAllCertificates);

module.exports = router;
