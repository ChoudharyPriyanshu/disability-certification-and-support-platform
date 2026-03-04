const Application = require('../models/Application');
const Doctor = require('../models/Doctor');

/**
 * @desc    Submit new application
 * @route   POST /api/applications
 * @access  Private (PwD User)
 */
const submitApplication = async (req, res, next) => {
    try {
        const {
            disabilityType,
            disabilityDescription,
            congenitalOrAcquired,
            applicantName,
            dateOfBirth,
            gender,
            address,
            phone,
        } = req.body;

        const application = await Application.create({
            applicant: req.user._id,
            applicantName: applicantName || req.user.name,
            dateOfBirth: dateOfBirth || req.user.dateOfBirth,
            gender: gender || req.user.gender,
            address: address || req.user.address,
            phone: phone || req.user.phone,
            disabilityType,
            disabilityDescription,
            congenitalOrAcquired,
            status: 'SUBMITTED',
            statusHistory: [
                {
                    status: 'SUBMITTED',
                    changedAt: new Date(),
                    changedBy: req.user._id,
                    remarks: 'Application submitted',
                },
            ],
        });

        // Handle document uploads if files were attached
        if (req.files && req.files.length > 0) {
            application.documents = req.files.map((file) => ({
                name: file.originalname,
                url: `/uploads/${req.user._id}/${file.filename}`,
                type: req.body.documentType || 'other',
            }));
            await application.save();
        }

        res.status(201).json({
            success: true,
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current user's applications
 * @route   GET /api/applications/my
 * @access  Private (PwD User)
 */
const getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ applicant: req.user._id })
            .populate('assignedDoctor', 'name specialization hospital')
            .populate('reviewedBy', 'name institution')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: applications.length,
            data: applications,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single application
 * @route   GET /api/applications/:id
 * @access  Private
 */
const getApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('applicant', 'name email phone')
            .populate('assignedDoctor', 'name specialization hospital')
            .populate('reviewedBy', 'name institution designation');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        // Ensure PwD users can only view their own applications
        if (
            req.user.role === 'PWD_USER' &&
            application.applicant._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this application',
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
 * @desc    Upload documents for application
 * @route   POST /api/applications/:id/documents
 * @access  Private (PwD User)
 */
const uploadDocuments = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        if (application.applicant.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded',
            });
        }

        const newDocs = req.files.map((file) => ({
            name: file.originalname,
            url: `/uploads/${req.user._id}/${file.filename}`,
            type: req.body.documentType || 'other',
        }));

        application.documents.push(...newDocs);
        await application.save();

        res.json({
            success: true,
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all applications (Admin)
 * @route   GET /api/applications
 * @access  Private (Admin)
 */
const getAllApplications = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query = {};

        if (status) {
            query.status = status;
        }

        const applications = await Application.find(query)
            .populate('applicant', 'name email phone')
            .populate('assignedDoctor', 'name specialization')
            .populate('reviewedBy', 'name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Application.countDocuments(query);

        res.json({
            success: true,
            count: applications.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: applications,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Start review of application (Admin)
 * @route   PUT /api/applications/:id/review
 * @access  Private (Admin)
 */
const reviewApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        if (application.status !== 'SUBMITTED') {
            return res.status(400).json({
                success: false,
                message: `Application cannot be reviewed — current status: ${application.status}`,
            });
        }

        application.status = 'UNDER_REVIEW';
        application.reviewedBy = req.user._id;
        application._statusChangedBy = req.user._id;
        application._statusRemarks = req.body.remarks || 'Application is under review';
        await application.save();

        res.json({
            success: true,
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Assign doctor to application (Admin)
 * @route   PUT /api/applications/:id/assign-doctor
 * @access  Private (Admin)
 */
const assignDoctor = async (req, res, next) => {
    try {
        const { doctorId } = req.body;

        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        if (!['UNDER_REVIEW', 'SUBMITTED'].includes(application.status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot assign doctor — current status: ${application.status}`,
            });
        }

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found',
            });
        }

        application.assignedDoctor = doctorId;
        application.status = 'DOCTOR_ASSIGNED';
        application.reviewedBy = req.user._id;
        application._statusChangedBy = req.user._id;
        application._statusRemarks = `Doctor ${doctor.name} assigned`;
        await application.save();

        // Add to doctor's assigned cases
        if (!doctor.assignedCases.includes(application._id)) {
            doctor.assignedCases.push(application._id);
            await doctor.save();
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
 * @desc    Schedule assessment (Admin)
 * @route   PUT /api/applications/:id/schedule
 * @access  Private (Admin)
 */
const scheduleAssessment = async (req, res, next) => {
    try {
        const { assessmentDate } = req.body;

        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        if (application.status !== 'DOCTOR_ASSIGNED') {
            return res.status(400).json({
                success: false,
                message: `Cannot schedule assessment — current status: ${application.status}`,
            });
        }

        application.assessmentDate = assessmentDate;
        application.status = 'ASSESSMENT_SCHEDULED';
        application._statusChangedBy = req.user._id;
        application._statusRemarks = `Assessment scheduled for ${new Date(assessmentDate).toLocaleDateString('en-IN')}`;
        await application.save();

        res.json({
            success: true,
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Final approve application (Admin)
 * @route   PUT /api/applications/:id/approve
 * @access  Private (Admin)
 */
const approveApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        if (application.status !== 'ASSESSMENT_COMPLETED') {
            return res.status(400).json({
                success: false,
                message: `Cannot approve — current status: ${application.status}. Assessment must be completed first.`,
            });
        }

        if (!application.doctorEvaluation || !application.doctorEvaluation.disabilityPercentage) {
            return res.status(400).json({
                success: false,
                message: 'Cannot approve — doctor evaluation not submitted',
            });
        }

        application.status = 'APPROVED';
        application.adminRemarks = req.body.remarks || 'Application approved';
        application.reviewedBy = req.user._id;
        application._statusChangedBy = req.user._id;
        application._statusRemarks = req.body.remarks || 'Application approved by admin';
        await application.save();

        res.json({
            success: true,
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Reject application (Admin)
 * @route   PUT /api/applications/:id/reject
 * @access  Private (Admin)
 */
const rejectApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        if (['APPROVED', 'REJECTED'].includes(application.status)) {
            return res.status(400).json({
                success: false,
                message: `Application already ${application.status.toLowerCase()}`,
            });
        }

        application.status = 'REJECTED';
        application.adminRemarks = req.body.remarks || 'Application rejected';
        application.reviewedBy = req.user._id;
        application._statusChangedBy = req.user._id;
        application._statusRemarks = req.body.remarks || 'Application rejected';
        await application.save();

        res.json({
            success: true,
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    submitApplication,
    getMyApplications,
    getApplication,
    uploadDocuments,
    getAllApplications,
    reviewApplication,
    assignDoctor,
    scheduleAssessment,
    approveApplication,
    rejectApplication,
};
