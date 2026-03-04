const Scheme = require('../models/Scheme');

/**
 * @desc    Get all active schemes
 * @route   GET /api/schemes
 * @access  Public
 */
const getSchemes = async (req, res, next) => {
    try {
        const { disabilityType, percentage } = req.query;
        const query = { isActive: true };

        if (disabilityType) {
            query.disabilityTypes = { $in: [disabilityType, 'All'] };
        }

        if (percentage) {
            query.minimumPercentage = { $lte: parseInt(percentage) };
        }

        const schemes = await Scheme.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: schemes.length,
            data: schemes,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single scheme
 * @route   GET /api/schemes/:id
 * @access  Public
 */
const getScheme = async (req, res, next) => {
    try {
        const scheme = await Scheme.findById(req.params.id);

        if (!scheme) {
            return res.status(404).json({
                success: false,
                message: 'Scheme not found',
            });
        }

        res.json({
            success: true,
            data: scheme,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create scheme
 * @route   POST /api/schemes
 * @access  Private (Admin)
 */
const createScheme = async (req, res, next) => {
    try {
        const scheme = await Scheme.create(req.body);

        res.status(201).json({
            success: true,
            data: scheme,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update scheme
 * @route   PUT /api/schemes/:id
 * @access  Private (Admin)
 */
const updateScheme = async (req, res, next) => {
    try {
        const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!scheme) {
            return res.status(404).json({
                success: false,
                message: 'Scheme not found',
            });
        }

        res.json({
            success: true,
            data: scheme,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete scheme
 * @route   DELETE /api/schemes/:id
 * @access  Private (Admin)
 */
const deleteScheme = async (req, res, next) => {
    try {
        const scheme = await Scheme.findByIdAndDelete(req.params.id);

        if (!scheme) {
            return res.status(404).json({
                success: false,
                message: 'Scheme not found',
            });
        }

        res.json({
            success: true,
            message: 'Scheme removed',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSchemes,
    getScheme,
    createScheme,
    updateScheme,
    deleteScheme,
};
