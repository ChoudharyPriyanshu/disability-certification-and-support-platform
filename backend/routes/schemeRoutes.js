const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/schemeController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', schemeController.getSchemes);
router.get('/:id', schemeController.getSchemeById);

// Admin routes
router.post('/',
    authenticate,
    authorize('ADMIN'),
    schemeController.createScheme
);

router.patch('/:id',
    authenticate,
    authorize('ADMIN'),
    schemeController.updateScheme
);

router.delete('/:id',
    authenticate,
    authorize('ADMIN'),
    schemeController.deleteScheme
);

module.exports = router;
