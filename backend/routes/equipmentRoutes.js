const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', equipmentController.getEquipment);
router.get('/:id', equipmentController.getEquipmentById);

// Admin routes
router.post('/',
    authenticate,
    authorize('ADMIN'),
    equipmentController.createEquipment
);

router.patch('/:id',
    authenticate,
    authorize('ADMIN'),
    equipmentController.updateEquipment
);

router.delete('/:id',
    authenticate,
    authorize('ADMIN'),
    equipmentController.deleteEquipment
);

module.exports = router;
