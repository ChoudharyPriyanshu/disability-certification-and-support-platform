const Application = require('../models/Application');

/**
 * @desc    Get doctor's assigned cases
 * @route   GET /api/doctor/cases
 * @access  Private (Doctor)
 */
const getAssignedCases = async (req, res, next) => {
    try {
        const cases = await Application.find({ assignedDoctor: req.user._id })
            .populate('applicant', 'name email phone dateOfBirth gender address')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: cases.length,
            data: cases,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single assigned case detail
 * @route   GET /api/doctor/cases/:id
 * @access  Private (Doctor)
 */
const getCaseDetail = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('applicant', 'name email phone dateOfBirth gender address');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Case not found',
            });
        }

        // Ensure doctor is assigned to this case
        if (application.assignedDoctor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this case',
            });
        }

        res.json({
            success: true,
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Submit evaluation for a case
 * @route   PUT /api/doctor/cases/:id/evaluate
 * @access  Private (Doctor)
 */
const submitEvaluation = async (req, res, next) => {
    try {
        const { disabilityType, disabilityPercentage, notes } = req.body;

        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Case not found',
            });
        }

        // Ensure doctor is assigned to this case
        if (application.assignedDoctor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to evaluate this case',
            });
        }

        if (application.status !== 'ASSESSMENT_SCHEDULED') {
            return res.status(400).json({
                success: false,
                message: `Cannot submit evaluation — assessment must be scheduled first (Current status: ${application.status})`,
            });
        }

        if (!disabilityPercentage || disabilityPercentage < 0 || disabilityPercentage > 100) {
            return res.status(400).json({
                success: false,
                message: 'Disability percentage must be between 0 and 100',
            });
        }

        // Handle supporting documents if any
        const supportingDocuments = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach((file) => {
                // Determine type based on mimetype or other logic
                let type = 'other';
                if (file.mimetype.startsWith('image/')) {
                    type = 'photograph';
                } else if (file.mimetype === 'application/pdf') {
                    type = 'report';
                }

                supportingDocuments.push({
                    name: file.originalname,
                    url: `/uploads/${req.user._id}/${file.filename}`, // Assuming this is how URLs are constructed
                    type,
                    uploadedAt: new Date(),
                });
            });
        }

        application.doctorEvaluation = {
            disabilityType: disabilityType || application.disabilityType,
            disabilityPercentage,
            notes,
            supportingDocuments,
            submittedAt: new Date(),
        };

        application.status = 'ASSESSMENT_COMPLETED';
        application._statusChangedBy = req.user._id;
        application._statusRemarks = `Evaluation submitted: ${disabilityPercentage}% ${disabilityType || application.disabilityType}`;
        await application.save();

        res.json({
            success: true,
            message: 'Evaluation submitted successfully',
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAssignedCases,
    getCaseDetail,
    submitEvaluation,
};
