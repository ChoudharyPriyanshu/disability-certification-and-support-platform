const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

/**
 * Generate a formal disability certificate PDF with embedded QR code
 */
const generateCertificatePDF = async (certificateData) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4

    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

    const { width, height } = page.getSize();

    // ---------- Color definitions ----------
    const darkText = rgb(0.1, 0.1, 0.12);
    const mutedText = rgb(0.35, 0.35, 0.38);
    const accentLine = rgb(0.18, 0.35, 0.28);

    // ---------- Border ----------
    page.drawRectangle({
        x: 30,
        y: 30,
        width: width - 60,
        height: height - 60,
        borderColor: accentLine,
        borderWidth: 2,
    });

    page.drawRectangle({
        x: 35,
        y: 35,
        width: width - 70,
        height: height - 70,
        borderColor: accentLine,
        borderWidth: 0.5,
    });

    // ---------- Header ----------
    let yPos = height - 80;

    page.drawText('GOVERNMENT OF INDIA', {
        x: width / 2 - fontBold.widthOfTextAtSize('GOVERNMENT OF INDIA', 14) / 2,
        y: yPos,
        size: 14,
        font: fontBold,
        color: darkText,
    });

    yPos -= 25;
    page.drawText('DISABILITY CERTIFICATE', {
        x: width / 2 - fontBold.widthOfTextAtSize('DISABILITY CERTIFICATE', 18) / 2,
        y: yPos,
        size: 18,
        font: fontBold,
        color: darkText,
    });

    yPos -= 18;
    page.drawText('(Issued under the Rights of Persons with Disabilities Act, 2016)', {
        x: width / 2 - fontItalic.widthOfTextAtSize('(Issued under the Rights of Persons with Disabilities Act, 2016)', 9) / 2,
        y: yPos,
        size: 9,
        font: fontItalic,
        color: mutedText,
    });

    // ---------- Divider ----------
    yPos -= 20;
    page.drawLine({
        start: { x: 50, y: yPos },
        end: { x: width - 50, y: yPos },
        thickness: 1.5,
        color: accentLine,
    });

    // ---------- Certificate Number ----------
    yPos -= 30;
    page.drawText(`Certificate No: ${certificateData.certificateNumber}`, {
        x: 60,
        y: yPos,
        size: 10,
        font: fontBold,
        color: darkText,
    });

    page.drawText(`Date: ${new Date(certificateData.issuedDate).toLocaleDateString('en-IN')}`, {
        x: width - 200,
        y: yPos,
        size: 10,
        font: font,
        color: darkText,
    });

    // ---------- Body ----------
    yPos -= 40;
    const drawField = (label, value) => {
        page.drawText(label, {
            x: 60,
            y: yPos,
            size: 10,
            font: fontBold,
            color: mutedText,
        });
        page.drawText(value || 'N/A', {
            x: 220,
            y: yPos,
            size: 11,
            font: font,
            color: darkText,
        });
        yPos -= 28;
    };

    drawField('Name:', certificateData.applicantName);
    drawField('Date of Birth:', certificateData.dateOfBirth
        ? new Date(certificateData.dateOfBirth).toLocaleDateString('en-IN')
        : 'N/A');
    drawField('Gender:', certificateData.gender);
    drawField('Address:', certificateData.address);

    yPos -= 10;
    page.drawLine({
        start: { x: 60, y: yPos },
        end: { x: width - 60, y: yPos },
        thickness: 0.5,
        color: accentLine,
    });

    yPos -= 30;
    drawField('Disability Type:', certificateData.disabilityType);
    drawField('Disability Percentage:', `${certificateData.disabilityPercentage}%`);

    yPos -= 10;
    page.drawLine({
        start: { x: 60, y: yPos },
        end: { x: width - 60, y: yPos },
        thickness: 0.5,
        color: accentLine,
    });

    yPos -= 30;
    drawField('Assessed By:', certificateData.doctorName || 'N/A');
    drawField('Issued By:', certificateData.issuedByName || 'N/A');
    drawField('Valid Until:', certificateData.validUntil
        ? new Date(certificateData.validUntil).toLocaleDateString('en-IN')
        : 'Lifetime');

    // ---------- Certificate Hash ----------
    yPos -= 20;
    page.drawText('Verification Hash:', {
        x: 60,
        y: yPos,
        size: 8,
        font: fontBold,
        color: mutedText,
    });
    yPos -= 14;
    page.drawText(certificateData.certificateHash || '', {
        x: 60,
        y: yPos,
        size: 7,
        font: font,
        color: mutedText,
    });

    // ---------- QR Code ----------
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${certificateData.certificateHash}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 120,
        margin: 1,
        color: { dark: '#1a1a1e', light: '#ffffff' },
    });

    const qrImageBytes = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
    const qrImage = await pdfDoc.embedPng(qrImageBytes);

    page.drawImage(qrImage, {
        x: width - 170,
        y: 80,
        width: 100,
        height: 100,
    });

    page.drawText('Scan to verify', {
        x: width - 158,
        y: 68,
        size: 8,
        font: fontItalic,
        color: mutedText,
    });

    // ---------- Footer ----------
    page.drawLine({
        start: { x: 50, y: 55 },
        end: { x: width - 50, y: 55 },
        thickness: 0.5,
        color: accentLine,
    });

    page.drawText('This is a digitally generated certificate. Verify authenticity via QR code.', {
        x: 60,
        y: 42,
        size: 7,
        font: fontItalic,
        color: mutedText,
    });

    // ---------- Save ----------
    const pdfBytes = await pdfDoc.save();
    const uploadsDir = path.join(__dirname, '..', 'uploads', 'certificates');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `certificate-${certificateData.certificateNumber}.pdf`;
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, pdfBytes);

    return {
        fileName,
        filePath,
        pdfUrl: `/uploads/certificates/${fileName}`,
        qrCodeData: verificationUrl,
    };
};

module.exports = generateCertificatePDF;
