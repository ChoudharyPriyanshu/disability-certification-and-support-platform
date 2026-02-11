const Application = require('../models/Application');
const User = require('../models/User');

/**
 * Submit a new disability certificate application
 */
exports.submitApplication = async (req, res) => {
    try {
        const { personalInfo, disabilityInfo } = req.body;

        // Check if user already has a pending application
        const existingApplication = await Application.findOne({
            user: req.user._id,
            status: { $in: ['SUBMITTED', 'VERIFIED', 'DOCTOR_ASSIGNED', 'ASSESSED'] }
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                error: 'You already have a pending application'
            });
        }

        // Create new application
        const application = new Application({
            user: req.user._id,
            personalInfo,
            disabilityInfo,
            status: 'SUBMITTED'
        });

        // Add to status history
        application.updateStatus('SUBMITTED', req.user._id, 'Application submitted by user');

        await application.save();

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: {
                application
            }
        });
    } catch (error) {
        console.error('Application submission error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to submit application'
        });
    }
};

/**
 * Get applications (filtered by role)
 */
exports.getApplications = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        let query = {};

        // Role-based filtering
        if (req.user.role === 'PWD_USER') {
            query.user = req.user._id;
        } else if (req.user.role === 'DOCTOR') {
            query.assignedDoctor = req.user._id;
        }
        // ADMIN sees all applications

        // Status filter
        if (status) {
            query.status = status;
        }

        const applications = await Application.find(query)
            .populate('user', 'profile.firstName profile.lastName email')
            .populate('assignedDoctor', 'profile.firstName profile.lastName profile.specialization')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Application.countDocuments(query);

        res.json({
            success: true,
            data: {
                applications,
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
            error: 'Failed to fetch applications'
        });
    }
};

/**
 * Get single application by ID
 */
exports.getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('user', '-password')
            .populate('assignedDoctor', 'profile.firstName profile.lastName profile.specialization profile.hospital')
            .populate('statusHistory.changedBy', 'profile.firstName profile.lastName role');

        if (!application) {
            return res.status(404).json({
                success: false,
                error: 'Application not found'
            });
        }

        // Authorization check
        if (req.user.role === 'PWD_USER' && application.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            });
        }

        if (req.user.role === 'DOCTOR' && application.assignedDoctor?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            });
        }

        res.json({
            success: true,
            data: {
                application
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch application'
        });
    }
};

/**
 * Update application status (ADMIN only)
 */
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;

        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                error: 'Application not found'
            });
        }

        // Validate status transition
        const validTransitions = {
            'SUBMITTED': ['VERIFIED', 'REJECTED'],
            'VERIFIED': ['DOCTOR_ASSIGNED', 'REJECTED'],
            'DOCTOR_ASSIGNED': ['ASSESSED', 'REJECTED'],
            'ASSESSED': ['APPROVED', 'REJECTED']
        };

        if (!validTransitions[application.status]?.includes(status)) {
            return res.status(400).json({
                success: false,
                error: `Invalid status transition from ${application.status} to ${status}`
            });
        }

        // Update status
        application.updateStatus(status, req.user._id, notes);

        if (status === 'REJECTED' && req.body.rejectionReason) {
            application.rejectionReason = req.body.rejectionReason;
        }

        if (notes) {
            application.adminNotes = notes;
        }

        await application.save();

        res.json({
            success: true,
            message: `Application status updated to ${status}`,
            data: {
                application
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update application status'
        });
    }
};

/**
 * Assign doctor to application (ADMIN only)
 */
exports.assignDoctor = async (req, res) => {
    try {
        const { doctorId } = req.body;

        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                error: 'Application not found'
            });
        }

        // Validate doctor exists and has DOCTOR role
        const doctor = await User.findById(doctorId);

        if (!doctor || doctor.role !== 'DOCTOR') {
            return res.status(400).json({
                success: false,
                error: 'Invalid doctor ID'
            });
        }

        // Assign doctor and update status
        application.assignedDoctor = doctorId;
        application.updateStatus('DOCTOR_ASSIGNED', req.user._id, `Doctor assigned: ${doctor.fullName}`);

        await application.save();

        res.json({
            success: true,
            message: 'Doctor assigned successfully',
            data: {
                application
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to assign doctor'
        });
    }
};

/**
 * Submit assessment (DOCTOR only)
 */
exports.submitAssessment = async (req, res) => {
    try {
        const { doctorNotes, assessedPercentage, recommendations } = req.body;

        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                error: 'Application not found'
            });
        }

        // Verify doctor is assigned to this application
        if (application.assignedDoctor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'You are not assigned to this application'
            });
        }

        // Update assessment
        application.assessment = {
            doctorNotes,
            assessedPercentage,
            assessmentDate: new Date(),
            recommendations
        };

        application.updateStatus('ASSESSED', req.user._id, 'Assessment completed');

        await application.save();

        res.json({
            success: true,
            message: 'Assessment submitted successfully',
            data: {
                application
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to submit assessment'
        });
    }
};

/**
 * Upload documents
 */
exports.uploadDocuments = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                error: 'Application not found'
            });
        }

        // Verify ownership
        if (application.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            });
        }

        // Process uploaded files
        const uploadedFiles = req.files;

        if (uploadedFiles.medicalCertificate) {
            const file = uploadedFiles.medicalCertificate[0];
            application.documents.medicalCertificate = {
                filename: file.originalname,
                path: file.path,
                uploadedAt: new Date()
            };
        }

        if (uploadedFiles.aadharCard) {
            const file = uploadedFiles.aadharCard[0];
            application.documents.aadharCard = {
                filename: file.originalname,
                path: file.path,
                uploadedAt: new Date()
            };
        }

        if (uploadedFiles.photograph) {
            const file = uploadedFiles.photograph[0];
            application.documents.photograph = {
                filename: file.originalname,
                path: file.path,
                uploadedAt: new Date()
            };
        }

        await application.save();

        res.json({
            success: true,
            message: 'Documents uploaded successfully',
            data: {
                application
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to upload documents'
        });
    }
};
