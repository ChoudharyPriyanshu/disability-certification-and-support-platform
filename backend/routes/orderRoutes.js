const express = require('express');
const router = express.Router();
const {
    placeOrder,
    getMyOrders,
    getOrder,
    createPayment,
    verifyPayment,
    getAllOrders,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// PwD User routes
router.post('/', protect, authorize('PWD_USER'), placeOrder);
router.get('/my', protect, authorize('PWD_USER'), getMyOrders);
router.get('/:id', protect, getOrder);
router.post('/:id/payment', protect, authorize('PWD_USER'), createPayment);
router.post('/:id/verify-payment', protect, authorize('PWD_USER'), verifyPayment);

// Admin routes
router.get('/', protect, authorize('ADMIN'), getAllOrders);

module.exports = router;
