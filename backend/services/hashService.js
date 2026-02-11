const crypto = require('crypto');

/**
 * Generate SHA-256 hash from certificate data
 * @param {Object} certificateData - Certificate data to hash
 * @returns {string} Hexadecimal hash string
 */
exports.generateCertificateHash = (certificateData) => {
    // Create deterministic string from certificate data
    const dataString = JSON.stringify({
        certificateNumber: certificateData.certificateNumber,
        userId: certificateData.userId,
        applicationId: certificateData.applicationId,
        disabilityType: certificateData.disabilityType,
        disabilityPercentage: certificateData.disabilityPercentage,
        issueDate: certificateData.issueDate,
        validUntil: certificateData.validUntil
    });

    // Generate SHA-256 hash
    const hash = crypto.createHash('sha256').update(dataString).digest('hex');

    return hash;
};

/**
 * Convert hex hash to bytes32 format for Solidity
 * @param {string} hexHash - Hexadecimal hash string
 * @returns {string} bytes32 formatted hash (with 0x prefix)
 */
exports.hexToBytes32 = (hexHash) => {
    // Ensure 0x prefix
    return hexHash.startsWith('0x') ? hexHash : `0x${hexHash}`;
};
