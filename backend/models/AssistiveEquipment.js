const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 1500
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Mobility Aids',
            'Hearing Aids',
            'Visual Aids',
            'Communication Devices',
            'Daily Living Aids',
            'Medical Equipment',
            'Educational Tools',
            'Sports & Recreation',
            'Other'
        ]
    },
    subcategory: String,
    specifications: {
        type: Map,
        of: String
    },
    price: {
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        currency: {
            type: String,
            default: 'INR'
        }
    },
    supplier: {
        name: {
            type: String,
            required: true
        },
        contact: {
            phone: String,
            email: String,
            website: String,
            address: String
        }
    },
    images: [{
        url: String,
        caption: String
    }],
    availability: {
        inStock: {
            type: Boolean,
            default: true
        },
        estimatedDelivery: String
    },
    subsidyEligible: {
        type: Boolean,
        default: false
    },
    subsidyDetails: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AssistiveEquipment', equipmentSchema);
