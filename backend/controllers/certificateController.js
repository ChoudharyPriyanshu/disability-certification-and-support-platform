const Certificate = require('../models/Certificate');
const Application = require('../models/Application');
const User = require('../models/User');
const generateHash = require('../utils/generateHash');
const generateCertificatePDF = require('../utils/generateCertificate');

/**
 * @desc    Generate certificate for approved application
 * @route   POST /api/certificates/generate/:applicationId
 * @access  Private (Admin)
 */
const generateCertificate = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.applicationId)
            .populate('applicant', 'name email dateOfBirth gender address')
            .populate('assignedDoctor', 'name specialization');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        if (application.status !== 'APPROVED') {
            return res.status(400).json({
                success: false,
                message: 'Application must be approved before generating certificate',
            });
        }

        // Check if certificate already exists
        const existingCert = await Certificate.findOne({ application: application._id });
        if (existingCert) {
            return res.status(400).json({
                success: false,
                message: 'Certificate already generated for this application',
                data: existingCert,
            });
        }

        // Generate unique certificate number
        const certificateNumber = `UDID-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        // Prepare certificate data
        const certificateData = {
            certificateNumber,
            applicantName: application.applicantName || application.applicant.name,
            dateOfBirth: application.dateOfBirth || application.applicant.dateOfBirth,
            gender: application.gender || application.applicant.gender,
            address: application.address || application.applicant.address,
            disabilityType: application.doctorEvaluation.disabilityType || application.disabilityType,
            disabilityPercentage: application.doctorEvaluation.disabilityPercentage,
            doctorName: application.assignedDoctor?.name,
            issuedByName: req.user.name,
            issuedDate: new Date(),
            validUntil: null, // Lifetime validity
        };

        // Generate hash
        const certificateHash = generateHash(certificateData);
        certificateData.certificateHash = certificateHash;

        // Generate PDF
        const pdfResult = await generateCertificatePDF(certificateData);

        // Create certificate record
        const certificate = await Certificate.create({
            application: application._id,
            user: application.applicant._id || application.applicant,
            certificateNumber,
            disabilityType: certificateData.disabilityType,
            disabilityPercentage: certificateData.disabilityPercentage,
            issuedBy: req.user._id,
            issuedDate: certificateData.issuedDate,
            validUntil: certificateData.validUntil,
            qrCodeData: pdfResult.qrCodeData,
            pdfUrl: pdfResult.pdfUrl,
            certificateHash,
            isVerified: true,
        });

        res.status(201).json({
            success: true,
            message: 'Certificate generated successfully',
            data: certificate,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current user's certificates
 * @route   GET /api/certificates/my
 * @access  Private (PwD User)
 */
const getMyCertificates = async (req, res, next) => {
    try {
        const certificates = await Certificate.find({ user: req.user._id })
            .populate('application', 'disabilityType status')
            .populate('issuedBy', 'name institution designation')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: certificates.length,
            data: certificates,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Download certificate PDF
 * @route   GET /api/certificates/:id/download
 * @access  Private
 */
const downloadCertificate = async (req, res, next) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found',
            });
        }

        // Ensure user can only download their own certificate (unless admin)
        if (
            req.user.role === 'PWD_USER' &&
            certificate.user.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to download this certificate',
            });
        }

        const path = require('path');
        const filePath = path.join(__dirname, '..', certificate.pdfUrl);

        res.download(filePath, `certificate-${certificate.certificateNumber}.pdf`);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Verify certificate by hash (public)
 * @route   GET /api/certificates/verify/:hash
 * @access  Public
 */
const verifyCertificate = async (req, res, next) => {
    try {
        const { hash } = req.params;

        const certificate = await Certificate.findOne({ certificateHash: hash })
            .populate('user', 'name')
            .populate('issuedBy', 'name institution designation');

        if (!certificate) {
            return res.json({
                success: false,
                verified: false,
                message: 'Certificate not found — verification failed',
            });
        }

        res.json({
            success: true,
            verified: true,
            message: 'Certificate verified successfully',
            data: {
                certificateNumber: certificate.certificateNumber,
                holderName: certificate.user?.name,
                disabilityType: certificate.disabilityType,
                disabilityPercentage: certificate.disabilityPercentage,
                issuedDate: certificate.issuedDate,
                validUntil: certificate.validUntil,
                issuedBy: certificate.issuedBy?.name,
                institution: certificate.issuedBy?.institution,
                blockchainTxHash: certificate.blockchainTxHash,
                isOnChain: !!certificate.blockchainTxHash,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all certificates (Admin)
 * @route   GET /api/certificates
 * @access  Private (Admin)
 */
const getAllCertificates = async (req, res, next) => {
    try {
        const certificates = await Certificate.find()
            .populate('user', 'name email')
            .populate('issuedBy', 'name institution')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: certificates.length,
            data: certificates,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    generateCertificate,
    getMyCertificates,
    downloadCertificate,
    verifyCertificate,
    getAllCertificates,
};
