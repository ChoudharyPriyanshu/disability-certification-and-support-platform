const Certificate = require('../models/Certificate');
const Application = require('../models/Application');
const blockchainService = require('../services/blockchainService');
const hashService = require('../services/hashService');

/**
 * Issue certificate (ADMIN only)
 */
exports.issueCertificate = async (req, res) => {
    try {
        const { applicationId } = req.body;

        const application = await Application.findById(applicationId)
            .populate('user');

        if (!application) {
            return res.status(404).json({
                success: false,
                error: 'Application not found'
            });
        }

        // Verify application is approved
        if (application.status !== 'APPROVED') {
            return res.status(400).json({
                success: false,
                error: 'Application must be in APPROVED status'
            });
        }

        // Check if certificate already exists
        const existingCertificate = await Certificate.findOne({ application: applicationId });

        if (existingCertificate) {
            return res.status(400).json({
                success: false,
                error: 'Certificate already issued for this application'
            });
        }

        // Create certificate
        const certificate = new Certificate({
            application: applicationId,
            user: application.user._id,
            disabilityType: application.disabilityInfo.type,
            disabilityPercentage: application.assessment.assessedPercentage,
            issuedBy: req.user._id
        });

        // Generate certificate hash
        const certificateData = {
            certificateNumber: certificate.certificateNumber,
            userId: certificate.user.toString(),
            applicationId: certificate.application.toString(),
            disabilityType: certificate.disabilityType,
            disabilityPercentage: certificate.disabilityPercentage,
            issueDate: certificate.issueDate,
            validUntil: certificate.validUntil
        };

        const hash = hashService.generateCertificateHash(certificateData);
        certificate.certificateHash = hash;

        // Generate QR code data (URL to verification page)
        certificate.qrCodeData = JSON.stringify({
            certificateNumber: certificate.certificateNumber,
            hash: hash,
            verifyUrl: `${process.env.FRONTEND_URL}/verify/${certificate.certificateNumber}`
        });

        // Store hash on blockchain
        try {
            const blockchainResult = await blockchainService.storeCertificateHash(hash);

            certificate.blockchain = {
                transactionHash: blockchainResult.transactionHash,
                blockNumber: blockchainResult.blockNumber,
                timestamp: blockchainResult.timestamp,
                verified: true
            };
        } catch (blockchainError) {
            console.error('Blockchain storage failed:', blockchainError);
            return res.status(500).json({
                success: false,
                error: 'Failed to store certificate on blockchain'
            });
        }

        await certificate.save();

        // Update application status
        application.updateStatus('CERTIFICATE_ISSUED', req.user._id, 'Certificate issued');
        await application.save();

        res.status(201).json({
            success: true,
            message: 'Certificate issued successfully',
            data: {
                certificate
            }
        });
    } catch (error) {
        console.error('Certificate issuance error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to issue certificate'
        });
    }
};

/**
 * Get certificate by ID
 */
exports.getCertificateById = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id)
            .populate('user', 'profile.firstName profile.lastName profile.dateOfBirth')
            .populate('application')
            .populate('issuedBy', 'profile.firstName profile.lastName');

        if (!certificate) {
            return res.status(404).json({
                success: false,
                error: 'Certificate not found'
            });
        }

        // Authorization check
        if (req.user.role === 'PWD_USER' && certificate.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            });
        }

        res.json({
            success: true,
            data: {
                certificate
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch certificate'
        });
    }
};

/**
 * Get certificate by application ID
 */
exports.getCertificateByApplication = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ application: req.params.applicationId })
            .populate('user', 'profile.firstName profile.lastName')
            .populate('issuedBy', 'profile.firstName profile.lastName');

        if (!certificate) {
            return res.status(404).json({
                success: false,
                error: 'Certificate not found for this application'
            });
        }

        res.json({
            success: true,
            data: {
                certificate
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch certificate'
        });
    }
};

/**
 * Verify certificate hash (PUBLIC)
 */
exports.verifyCertificate = async (req, res) => {
    try {
        const { certificateNumber, hash } = req.query;

        let certificate;

        if (certificateNumber) {
            certificate = await Certificate.findOne({ certificateNumber })
                .populate('user', 'profile.firstName profile.lastName');
        } else if (hash) {
            certificate = await Certificate.findOne({ certificateHash: hash })
                .populate('user', 'profile.firstName profile.lastName');
        } else {
            return res.status(400).json({
                success: false,
                error: 'Please provide certificateNumber or hash'
            });
        }

        if (!certificate) {
            return res.json({
                success: true,
                data: {
                    verified: false,
                    message: 'Certificate not found in database'
                }
            });
        }

        // Verify on blockchain
        const blockchainVerification = await blockchainService.verifyCertificateHash(certificate.certificateHash);

        res.json({
            success: true,
            data: {
                verified: blockchainVerification.verified,
                certificate: blockchainVerification.verified ? {
                    certificateNumber: certificate.certificateNumber,
                    holderName: certificate.user.fullName,
                    disabilityType: certificate.disabilityType,
                    disabilityPercentage: certificate.disabilityPercentage,
                    issueDate: certificate.issueDate,
                    validUntil: certificate.validUntil,
                    isActive: certificate.isActive,
                    blockchain: {
                        verified: true,
                        timestamp: blockchainVerification.timestamp,
                        transactionHash: certificate.blockchain.transactionHash,
                        blockNumber: certificate.blockchain.blockNumber
                    }
                } : null
            }
        });
    } catch (error) {
        console.error('Certificate verification error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to verify certificate'
        });
    }
};

/**
 * Get user's certificates
 */
exports.getUserCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({ user: req.user._id })
            .populate('application')
            .sort({ issueDate: -1 });

        res.json({
            success: true,
            data: {
                certificates
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch certificates'
        });
    }
};
