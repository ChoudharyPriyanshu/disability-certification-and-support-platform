const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * @desc    Place an order (dummy payment for now)
 * @route   POST /api/orders
 * @access  Private (PwD User)
 */
const placeOrder = async (req, res, next) => {
    try {
        const { products, shippingAddress } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No products in order',
            });
        }

        // Calculate total and validate products
        let totalAmount = 0;
        const orderProducts = [];

        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.product} not found`,
                });
            }

            if (!product.isAvailable || product.stock < (item.quantity || 1)) {
                return res.status(400).json({
                    success: false,
                    message: `Product "${product.name}" is out of stock`,
                });
            }

            const price = product.discountedPrice || product.price;
            const quantity = item.quantity || 1;
            totalAmount += price * quantity;

            orderProducts.push({
                product: product._id,
                quantity,
                price,
            });
        }

        const order = await Order.create({
            user: req.user._id,
            products: orderProducts,
            totalAmount,
            shippingAddress,
            paymentStatus: 'PENDING',
            status: 'PLACED',
        });

        // Update stock
        for (const item of orderProducts) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            });
        }

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current user's orders
 * @route   GET /api/orders/my
 * @access  Private (PwD User)
 */
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('products.product', 'name image price category')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single order
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('products.product', 'name image price category')
            .populate('user', 'name email phone');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Ensure user can only view their own orders (unless admin)
        if (
            req.user.role === 'PWD_USER' &&
            order.user._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order',
            });
        }

        res.json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create Razorpay order (placeholder — will integrate real API later)
 * @route   POST /api/orders/:id/payment
 * @access  Private (PwD User)
 */
const createPayment = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }

        // Dummy Razorpay order — replace with real API when keys are provided
        const dummyRazorpayOrder = {
            id: `order_${Date.now()}`,
            amount: order.totalAmount * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_${order._id}`,
        };

        order.razorpayOrderId = dummyRazorpayOrder.id;
        await order.save();

        res.json({
            success: true,
            data: {
                orderId: dummyRazorpayOrder.id,
                amount: dummyRazorpayOrder.amount,
                currency: dummyRazorpayOrder.currency,
                key: process.env.RAZORPAY_KEY_ID || 'dummy_key',
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Verify payment (placeholder)
 * @route   POST /api/orders/:id/verify-payment
 * @access  Private (PwD User)
 */
const verifyPayment = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Dummy verification — mark as completed
        order.paymentStatus = 'COMPLETED';
        order.razorpayPaymentId = req.body.razorpayPaymentId || `pay_${Date.now()}`;
        order.status = 'CONFIRMED';
        await order.save();

        res.json({
            success: true,
            message: 'Payment verified successfully',
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all orders (Admin)
 * @route   GET /api/orders
 * @access  Private (Admin)
 */
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email phone')
            .populate('products.product', 'name price category')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    placeOrder,
    getMyOrders,
    getOrder,
    createPayment,
    verifyPayment,
    getAllOrders,
};
