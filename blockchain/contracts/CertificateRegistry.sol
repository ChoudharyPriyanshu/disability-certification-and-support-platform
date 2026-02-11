// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CertificateRegistry
 * @dev Immutable storage and verification of disability certificate hashes
 * @notice This contract ONLY stores certificate hashes for verification purposes
 * NO personal data or business logic is stored on-chain
 */
contract CertificateRegistry {
    // Contract owner (admin backend)
    address public owner;
    
    // Mapping: certificate hash => timestamp of storage
    mapping(bytes32 => uint256) private certificateHashes;
    
    // Events
    event CertificateStored(bytes32 indexed certificateHash, uint256 timestamp);
    
    /**
     * @dev Sets the contract deployer as the owner
     */
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Modifier to restrict access to owner only
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    /**
     * @dev Store a certificate hash on the blockchain
     * @param certificateHash SHA-256 hash of the certificate data
     * @notice Can only be called by the contract owner (backend)
     * @notice Prevents duplicate hash storage
     */
    function storeCertificateHash(bytes32 certificateHash) external onlyOwner {
        require(certificateHash != bytes32(0), "Invalid hash: cannot be zero");
        require(certificateHashes[certificateHash] == 0, "Certificate hash already exists");
        
        certificateHashes[certificateHash] = block.timestamp;
        
        emit CertificateStored(certificateHash, block.timestamp);
    }
    
    /**
     * @dev Verify if a certificate hash exists on the blockchain
     * @param certificateHash SHA-256 hash to verify
     * @return bool True if hash exists, false otherwise
     * @notice Public function - anyone can verify
     */
    function verifyCertificateHash(bytes32 certificateHash) external view returns (bool) {
        return certificateHashes[certificateHash] != 0;
    }
    
    /**
     * @dev Get the timestamp when a certificate hash was stored
     * @param certificateHash SHA-256 hash to query
     * @return uint256 Timestamp (0 if hash doesn't exist)
     * @notice Returns 0 if the hash was never stored
     */
    function getCertificateTimestamp(bytes32 certificateHash) external view returns (uint256) {
        return certificateHashes[certificateHash];
    }
    
    /**
     * @dev Transfer ownership of the contract
     * @param newOwner Address of the new owner
     * @notice Only current owner can transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address: cannot be zero");
        owner = newOwner;
    }
}
