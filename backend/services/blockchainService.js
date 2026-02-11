const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

class BlockchainService {
    constructor() {
        this.provider = null;
        this.contract = null;
        this.wallet = null;
        this.initialized = false;
    }

    /**
     * Initialize blockchain connection
     */
    async initialize() {
        try {
            // Connect to blockchain network
            this.provider = new ethers.JsonRpcProvider(
                process.env.BLOCKCHAIN_NETWORK || 'http://127.0.0.1:8545'
            );

            // Load contract ABI
            const contractPath = path.join(__dirname, '..', 'contracts', 'CertificateRegistry.json');

            if (!fs.existsSync(contractPath)) {
                throw new Error('Contract ABI not found. Deploy the blockchain contract first.');
            }

            const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
            const contractAbi = contractJson.abi;

            // Load deployment info
            const deploymentPath = path.join(__dirname, '..', '..', 'blockchain', 'deployment.json');

            if (!fs.existsSync(deploymentPath)) {
                throw new Error('Deployment info not found. Deploy the blockchain contract first.');
            }

            const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
            const contractAddress = deployment.contractAddress;

            // Create wallet from private key
            if (!process.env.PRIVATE_KEY) {
                throw new Error('PRIVATE_KEY not set in environment variables');
            }

            this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);

            // Initialize contract instance
            this.contract = new ethers.Contract(contractAddress, contractAbi, this.wallet);

            this.initialized = true;
            console.log('✓ Blockchain service initialized');
            console.log(`  Contract: ${contractAddress}`);
            console.log(`  Network: ${process.env.BLOCKCHAIN_NETWORK}`);

            return true;
        } catch (error) {
            console.error('✗ Blockchain initialization error:', error.message);
            return false;
        }
    }

    /**
     * Store certificate hash on blockchain
     * @param {string} hash - Certificate hash (hex string)
     * @returns {Object} Transaction details
     */
    async storeCertificateHash(hash) {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            // Convert hash to bytes32 format
            const bytes32Hash = hash.startsWith('0x') ? hash : `0x${hash}`;

            // Call smart contract function
            const tx = await this.contract.storeCertificateHash(bytes32Hash);

            console.log(`⏳ Transaction submitted: ${tx.hash}`);

            // Wait for transaction confirmation
            const receipt = await tx.wait();

            console.log(`✓ Transaction confirmed in block: ${receipt.blockNumber}`);

            return {
                success: true,
                transactionHash: receipt.hash,
                blockNumber: receipt.blockNumber,
                timestamp: new Date()
            };
        } catch (error) {
            console.error('Blockchain storage error:', error.message);
            throw new Error(`Failed to store hash on blockchain: ${error.message}`);
        }
    }

    /**
     * Verify certificate hash on blockchain
     * @param {string} hash - Certificate hash to verify
     * @returns {Object} Verification result
     */
    async verifyCertificateHash(hash) {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            const bytes32Hash = hash.startsWith('0x') ? hash : `0x${hash}`;

            // Check if hash exists
            const exists = await this.contract.verifyCertificateHash(bytes32Hash);

            if (exists) {
                // Get timestamp
                const timestamp = await this.contract.getCertificateTimestamp(bytes32Hash);

                return {
                    verified: true,
                    timestamp: new Date(Number(timestamp) * 1000)
                };
            } else {
                return {
                    verified: false
                };
            }
        } catch (error) {
            console.error('Blockchain verification error:', error.message);
            throw new Error(`Failed to verify hash on blockchain: ${error.message}`);
        }
    }

    /**
     * Get blockchain network info
     */
    async getNetworkInfo() {
        if (!this.initialized) {
            await this.initialize();
        }

        const network = await this.provider.getNetwork();
        const blockNumber = await this.provider.getBlockNumber();

        return {
            chainId: network.chainId,
            name: network.name,
            blockNumber
        };
    }
}

// Export singleton instance
module.exports = new BlockchainService();
