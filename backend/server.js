const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { errorHandler } = require('./middleware/errorHandler');

// Route imports (imports)
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// --------------- Middleware ---------------
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --------------- Routes ---------------
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --------------- Error Handler ---------------
app.use(errorHandler);

// --------------- Database & Server ---------------
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✓ MongoDB connected successfully');
        app.listen(PORT, () => {
            console.log(`✓ Server running on port ${PORT}`);
            console.log(`  Environment: ${process.env.NODE_ENV}`);
        });
    })
    .catch((err) => {
        console.error('✗ MongoDB connection error:', err.message);
        process.exit(1);
    });

module.exports = app;
