const crypto = require('crypto');

/**
 * Generate a SHA-256 hash of certificate data
 * Used for blockchain storage and QR code verification
 */
const generateHash = (certificateData) => {
    const dataString = JSON.stringify({
        certificateNumber: certificateData.certificateNumber,
        applicantName: certificateData.applicantName,
        disabilityType: certificateData.disabilityType,
        disabilityPercentage: certificateData.disabilityPercentage,
        issuedDate: certificateData.issuedDate,
        timestamp: Date.now(),
    });

    return crypto.createHash('sha256').update(dataString).digest('hex');
};

module.exports = generateHash;
