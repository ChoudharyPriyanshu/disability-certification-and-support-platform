/**
 * Download certificate PDF (authenticated users only)
 */
exports.downloadCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({
                success: false,
                error: 'Certificate not found'
            });
        }

        // Authorization check - only certificate holder or admin/doctor
        if (req.user.role === 'PWD_USER' && certificate.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            });
        }

        if (!certificate.pdfUrl) {
            return res.status(404).json({
                success: false,
                error: 'PDF not available for this certificate'
            });
        }

        const path = require('path');
        const filepath = path.join(__dirname, '..', certificate.pdfUrl);

        // Check if file exists
        const fs = require('fs');
        if (!fs.existsSync(filepath)) {
            return res.status(404).json({
                success: false,
                error: 'PDF file not found'
            });
        }

        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${certificate.certificateNumber}.pdf"`);

        // Stream the file
        const fileStream = fs.createReadStream(filepath);
        fileStream.pipe(res);

    } catch (error) {
        console.error('PDF download error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to download certificate'
        });
    }
};
