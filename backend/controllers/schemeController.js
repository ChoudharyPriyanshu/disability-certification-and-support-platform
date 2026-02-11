const GovernmentScheme = require('../models/GovernmentScheme');

/**
 * Get all schemes
 */
exports.getSchemes = async (req, res) => {
    try {
        const { category, state, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        let query = { isActive: true };

        if (category) {
            query.category = category;
        }

        if (state) {
            query.state = { $in: [state, 'All India'] };
        }

        const schemes = await GovernmentScheme.find(query)
            .sort({ name: 1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await GovernmentScheme.countDocuments(query);

        res.json({
            success: true,
            data: {
                schemes,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch schemes'
        });
    }
};

/**
 * Get scheme by ID
 */
exports.getSchemeById = async (req, res) => {
    try {
        const scheme = await GovernmentScheme.findById(req.params.id);

        if (!scheme) {
            return res.status(404).json({
                success: false,
                error: 'Scheme not found'
            });
        }

        res.json({
            success: true,
            data: {
                scheme
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch scheme'
        });
    }
};

/**
 * Create scheme (ADMIN only)
 */
exports.createScheme = async (req, res) => {
    try {
        const scheme = new GovernmentScheme(req.body);
        await scheme.save();

        res.status(201).json({
            success: true,
            message: 'Scheme created successfully',
            data: {
                scheme
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to create scheme'
        });
    }
};

/**
 * Update scheme (ADMIN only)
 */
exports.updateScheme = async (req, res) => {
    try {
        const scheme = await GovernmentScheme.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!scheme) {
            return res.status(404).json({
                success: false,
                error: 'Scheme not found'
            });
        }

        res.json({
            success: true,
            message: 'Scheme updated successfully',
            data: {
                scheme
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update scheme'
        });
    }
};

/**
 * Delete scheme (ADMIN only)
 */
exports.deleteScheme = async (req, res) => {
    try {
        const scheme = await GovernmentScheme.findByIdAndDelete(req.params.id);

        if (!scheme) {
            return res.status(404).json({
                success: false,
                error: 'Scheme not found'
            });
        }

        res.json({
            success: true,
            message: 'Scheme deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete scheme'
        });
    }
};
