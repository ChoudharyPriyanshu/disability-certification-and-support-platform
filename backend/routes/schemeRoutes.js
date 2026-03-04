const express = require('express');
const router = express.Router();
const {
    getSchemes,
    getScheme,
    createScheme,
    updateScheme,
    deleteScheme,
} = require('../controllers/schemeController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getSchemes);
router.get('/:id', getScheme);

// Admin routes
router.post('/', protect, authorize('ADMIN'), createScheme);
router.put('/:id', protect, authorize('ADMIN'), updateScheme);
router.delete('/:id', protect, authorize('ADMIN'), deleteScheme);

module.exports = router;
