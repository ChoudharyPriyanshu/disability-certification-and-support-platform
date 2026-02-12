const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

/**
 * Generate PDF Certificate
 * Creates a professional institutional PDF certificate with QR code
 */
exports.generateCertificatePDF = async (certificateData) => {
    try {
        const {
            certificateNumber,
            user,
            application,
            blockchainTxHash,
            issuedDate,
            disabilityType,
            disabilityPercentage
        } = certificateData;

        // Ensure certificates directory exists
        const certificatesDir = path.join(__dirname, '../uploads/certificates');
        if (!fs.existsSync(certificatesDir)) {
            fs.mkdirSync(certificatesDir, { recursive: true });
        }

        // Create PDF document
        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        // Output file path
        const filename = `${certificateNumber}.pdf`;
        const filepath = path.join(certificatesDir, filename);
        const writeStream = fs.createWriteStream(filepath);
        doc.pipe(writeStream);

        // HEADER - Government Seal/Logo area
        doc.fontSize(24)
            .font('Helvetica-Bold')
            .text('GOVERNMENT OF INDIA', { align: 'center' })
            .moveDown(0.5);

        doc.fontSize(18)
            .text('Ministry of Social Justice and Empowerment', { align: 'center' })
            .moveDown(0.3);

        doc.fontSize(14)
            .font('Helvetica')
            .text('Department of Empowerment of Persons with Disabilities', { align: 'center' })
            .moveDown(1.5);

        // CERTIFICATE TITLE
        doc.fontSize(22)
            .font('Helvetica-Bold')
            .fillColor('#2C5282')
            .text('DISABILITY CERTIFICATE', { align: 'center' })
            .moveDown(0.5);

        doc.fontSize(10)
            .fillColor('#000')
            .font('Helvetica')
            .text(`Certificate No: ${certificateNumber}`, { align: 'center' })
            .moveDown(2);

        // CERTIFICATE BODY
        const bodyStartY = doc.y;
        doc.fontSize(12)
            .font('Helvetica')
            .fillColor('#000');

        // Personal Information
        doc.text(`This is to certify that:`, { continued: false })
            .moveDown(0.8);

        doc.fontSize(14)
            .font('Helvetica-Bold')
            .text(`${user.profile.firstName} ${user.profile.lastName}`, { align: 'center' })
            .moveDown(0.3);

        doc.fontSize(11)
            .font('Helvetica')
            .text(`Date of Birth: ${new Date(user.profile.dateOfBirth).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, { align: 'center' })
            .moveDown(0.3);

        if (user.aadhaar && user.aadhaar.lastFourDigits) {
            doc.text(`Aadhaar (Last 4 digits): XXXX-XXXX-${user.aadhaar.lastFourDigits}`, { align: 'center' })
                .moveDown(1.5);
        } else {
            doc.moveDown(1);
        }

        // Disability Details
        doc.fontSize(12)
            .text(`has been assessed and certified to have:`)
            .moveDown(0.8);

        doc.fontSize(13)
            .font('Helvetica-Bold')
            .fillColor('#C53030')
            .text(`${disabilityType}`, { align: 'center' })
            .moveDown(0.3);

        doc.fontSize(14)
            .text(`${disabilityPercentage}% Disability`, { align: 'center' })
            .moveDown(1.5);

        // Legal statement
        doc.fontSize(11)
            .fillColor('#000')
            .font('Helvetica')
            .text(`This certificate is issued in accordance with the Rights of Persons with Disabilities Act, 2016, and entitles the holder to benefits and concessions as per government schemes`, { align: 'justify' })
            .moveDown(1.5);

        // Validity
        doc.fontSize(10)
            .font('Helvetica-Oblique')
            .text(`Issued on: ${new Date(issuedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`)
            .text(`Valid for: Permanent`)
            .moveDown(2);

        // QR Code - Blockchain Verification
        const qrData = JSON.stringify({
            certificateNumber,
            blockchainTxHash,
            verifyUrl: `${process.env.FRONTEND_URL}/verify-certificate`
        });

        const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
            width: 150,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        // Convert QR code data URL to buffer
        const qrBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');

        // Position QR code on right side
        const qrX = doc.page.width - 200;
        const qrY = doc.page.height - 250;

        doc.image(qrBuffer, qrX, qrY, { width: 120, height: 120 });

        doc.fontSize(8)
            .font('Helvetica')
            .text('Scan to verify on', qrX - 10, qrY + 125, { width: 140, align: 'center' })
            .text('blockchain', qrX - 10, qrY + 135, { width: 140, align: 'center' });

        // Issuing Authority Signature area
        const signatureY = doc.page.height - 200;
        doc.fontSize(10)
            .font('Helvetica')
            .text('_____________________', 80, signatureY)
            .text('Authorized Signatory', 80, signatureY + 15)
            .text('Ministry of Social Justice', 80, signatureY + 30)
            .text('& Empowerment', 80, signatureY + 42);

        // Blockchain Hash footer
        doc.fontSize(7)
            .font('Helvetica')
            .fillColor('#666')
            .text(`Blockchain TX: ${blockchainTxHash.substring(0, 30)}...`, 50, doc.page.height - 50, { width: doc.page.width - 100, align: 'center' });

        // Finalize PDF
        doc.end();

        // Wait for file to be written
        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        return {
            filename,
            filepath,
            relativePath: `/uploads/certificates/${filename}`
        };

    } catch (error) {
        console.error('PDF generation error:', error);
        throw new Error('Failed to generate PDF certificate');
    }
};
