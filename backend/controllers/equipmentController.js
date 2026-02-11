const AssistiveEquipment = require('../models/AssistiveEquipment');

/**
 * Get all equipment
 */
exports.getEquipment = async (req, res) => {
    try {
        const { category, inStock, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        let query = { isActive: true };

        if (category) {
            query.category = category;
        }

        if (inStock !== undefined) {
            query['availability.inStock'] = inStock === 'true';
        }

        const equipment = await AssistiveEquipment.find(query)
            .sort({ name: 1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await AssistiveEquipment.countDocuments(query);

        res.json({
            success: true,
            data: {
                equipment,
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
            error: 'Failed to fetch equipment'
        });
    }
};

/**
 * Get equipment by ID
 */
exports.getEquipmentById = async (req, res) => {
    try {
        const equipment = await AssistiveEquipment.findById(req.params.id);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                error: 'Equipment not found'
            });
        }

        res.json({
            success: true,
            data: {
                equipment
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch equipment'
        });
    }
};

/**
 * Create equipment (ADMIN only)
 */
exports.createEquipment = async (req, res) => {
    try {
        const equipment = new AssistiveEquipment(req.body);
        await equipment.save();

        res.status(201).json({
            success: true,
            message: 'Equipment created successfully',
            data: {
                equipment
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to create equipment'
        });
    }
};

/**
 * Update equipment (ADMIN only)
 */
exports.updateEquipment = async (req, res) => {
    try {
        const equipment = await AssistiveEquipment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!equipment) {
            return res.status(404).json({
                success: false,
                error: 'Equipment not found'
            });
        }

        res.json({
            success: true,
            message: 'Equipment updated successfully',
            data: {
                equipment
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update equipment'
        });
    }
};

/**
 * Delete equipment (ADMIN only)
 */
exports.deleteEquipment = async (req, res) => {
    try {
        const equipment = await AssistiveEquipment.findByIdAndDelete(req.params.id);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                error: 'Equipment not found'
            });
        }

        res.json({
            success: true,
            message: 'Equipment deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete equipment'
        });
    }
};
