const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("Deploying CertificateRegistry contract...");

    // Get the contract factory
    const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");

    // Deploy the contract
    const certificateRegistry = await CertificateRegistry.deploy();

    await certificateRegistry.waitForDeployment();

    const contractAddress = await certificateRegistry.getAddress();

    console.log(`✓ CertificateRegistry deployed to: ${contractAddress}`);

    // Save contract address and ABI for backend integration
    const deploymentInfo = {
        contractAddress: contractAddress,
        network: hre.network.name,
        deployer: (await hre.ethers.getSigners())[0].address,
        deployedAt: new Date().toISOString()
    };

    const deploymentPath = path.join(__dirname, "..", "deployment.json");
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

    console.log(`✓ Deployment info saved to: ${deploymentPath}`);

    // Copy ABI to backend directory (will be created later)
    const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "CertificateRegistry.sol", "CertificateRegistry.json");
    const backendAbiPath = path.join(__dirname, "..", "..", "backend", "contracts", "CertificateRegistry.json");

    // Create backend/contracts directory if it doesn't exist
    const backendContractsDir = path.join(__dirname, "..", "..", "backend", "contracts");
    if (!fs.existsSync(backendContractsDir)) {
        fs.mkdirSync(backendContractsDir, { recursive: true });
    }

    // Copy the ABI file
    if (fs.existsSync(artifactPath)) {
        fs.copyFileSync(artifactPath, backendAbiPath);
        console.log(`✓ Contract ABI copied to backend directory`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
