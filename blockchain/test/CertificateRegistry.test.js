const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateRegistry", function () {
    let certificateRegistry;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
        certificateRegistry = await CertificateRegistry.deploy();
        await certificateRegistry.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await certificateRegistry.owner()).to.equal(owner.address);
        });
    });

    describe("Store Certificate Hash", function () {
        it("Should store a certificate hash successfully", async function () {
            const testHash = ethers.keccak256(ethers.toUtf8Bytes("test-certificate-123"));

            await expect(certificateRegistry.storeCertificateHash(testHash))
                .to.emit(certificateRegistry, "CertificateStored")
                .withArgs(testHash, await ethers.provider.getBlockNumber() + 1);

            const exists = await certificateRegistry.verifyCertificateHash(testHash);
            expect(exists).to.be.true;
        });

        it("Should reject zero hash", async function () {
            const zeroHash = ethers.ZeroHash;

            await expect(
                certificateRegistry.storeCertificateHash(zeroHash)
            ).to.be.revertedWith("Invalid hash: cannot be zero");
        });

        it("Should prevent duplicate hash storage", async function () {
            const testHash = ethers.keccak256(ethers.toUtf8Bytes("test-certificate-456"));

            await certificateRegistry.storeCertificateHash(testHash);

            await expect(
                certificateRegistry.storeCertificateHash(testHash)
            ).to.be.revertedWith("Certificate hash already exists");
        });

        it("Should only allow owner to store hashes", async function () {
            const testHash = ethers.keccak256(ethers.toUtf8Bytes("test-certificate-789"));

            await expect(
                certificateRegistry.connect(addr1).storeCertificateHash(testHash)
            ).to.be.revertedWith("Only owner can call this function");
        });
    });

    describe("Verify Certificate Hash", function () {
        it("Should verify an existing hash", async function () {
            const testHash = ethers.keccak256(ethers.toUtf8Bytes("test-certificate-verify"));

            await certificateRegistry.storeCertificateHash(testHash);

            const exists = await certificateRegistry.verifyCertificateHash(testHash);
            expect(exists).to.be.true;
        });

        it("Should return false for non-existent hash", async function () {
            const testHash = ethers.keccak256(ethers.toUtf8Bytes("non-existent-hash"));

            const exists = await certificateRegistry.verifyCertificateHash(testHash);
            expect(exists).to.be.false;
        });

        it("Should allow anyone to verify", async function () {
            const testHash = ethers.keccak256(ethers.toUtf8Bytes("public-verify-test"));

            await certificateRegistry.storeCertificateHash(testHash);

            const exists = await certificateRegistry.connect(addr1).verifyCertificateHash(testHash);
            expect(exists).to.be.true;
        });
    });

    describe("Get Certificate Timestamp", function () {
        it("Should return timestamp for stored hash", async function () {
            const testHash = ethers.keccak256(ethers.toUtf8Bytes("timestamp-test"));

            await certificateRegistry.storeCertificateHash(testHash);

            const timestamp = await certificateRegistry.getCertificateTimestamp(testHash);
            expect(timestamp).to.be.gt(0);
        });

        it("Should return 0 for non-existent hash", async function () {
            const testHash = ethers.keccak256(ethers.toUtf8Bytes("non-existent-timestamp"));

            const timestamp = await certificateRegistry.getCertificateTimestamp(testHash);
            expect(timestamp).to.equal(0);
        });
    });

    describe("Transfer Ownership", function () {
        it("Should transfer ownership successfully", async function () {
            await certificateRegistry.transferOwnership(addr1.address);
            expect(await certificateRegistry.owner()).to.equal(addr1.address);
        });

        it("Should reject zero address", async function () {
            await expect(
                certificateRegistry.transferOwnership(ethers.ZeroAddress)
            ).to.be.revertedWith("Invalid address: cannot be zero");
        });

        it("Should only allow owner to transfer", async function () {
            await expect(
                certificateRegistry.connect(addr1).transferOwnership(addr2.address)
            ).to.be.revertedWith("Only owner can call this function");
        });
    });
});
