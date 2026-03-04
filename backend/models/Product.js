const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: [
                'Mobility Aids',
                'Hearing Aids',
                'Visual Aids',
                'Daily Living Aids',
                'Communication Devices',
                'Orthotics & Prosthetics',
                'Other',
            ],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: 0,
        },
        discountedPrice: {
            type: Number,
            min: 0,
        },
        image: {
            type: String,
            default: '/uploads/products/default.png',
        },
        stock: {
            type: Number,
            default: 0,
            min: 0,
        },
        specifications: {
            type: String,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Product', productSchema);
