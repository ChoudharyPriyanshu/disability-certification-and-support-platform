const express = require('express');
const router = express.Router();
const {
    getAssignedCases,
    getCaseDetail,
    submitEvaluation,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All doctor routes require DOCTOR role
router.use(protect, authorize('DOCTOR'));

router.get('/cases', getAssignedCases);
router.get('/cases/:id', getCaseDetail);
router.put('/cases/:id/evaluate', upload.array('evidence', 5), submitEvaluation);

module.exports = router;
