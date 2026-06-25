import { Request, Response } from 'express';
import Certificate from '../models/Certificate';

// Get all certificates
export const getCertificates = async (req: Request, res: Response) => {
    try {
        const certificates = await Certificate.find().sort({ issueDate: -1 });
        res.json(certificates);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single certificate
export const getCertificate = async (req: Request, res: Response) => {
    try {
        const certificate = await Certificate.findById(req.params.id);
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.json(certificate);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create certificate
export const createCertificate = async (req: Request, res: Response) => {
    try {
        console.log('[CERT CREATE] Body:', req.body);
        console.log('[CERT CREATE] Files:', req.files);

        // Exclude image and pdf from req.body to prevent cast errors
        const { imageUrl, pdfUrl, ...otherData } = req.body;
        const certificate = new Certificate(otherData);

        if (req.files) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            if (files.imageUrl) {
                const imgPath = files.imageUrl[0].path.startsWith('http') ? files.imageUrl[0].path : `/uploads/${files.imageUrl[0].filename}`;
                certificate.imageUrl = imgPath;
                console.log('[CERT CREATE] Set Image URL:', imgPath);
            }
            if (files.pdfUrl) {
                const pdfPath = files.pdfUrl[0].path.startsWith('http') ? files.pdfUrl[0].path : `/uploads/${files.pdfUrl[0].filename}`;
                certificate.pdfUrl = pdfPath;
                console.log('[CERT CREATE] Set PDF URL:', pdfPath);
            }
        }

        await certificate.save();
        res.status(201).json({ message: 'Certificate created successfully', certificate });
    } catch (error: any) {
        const status = error.name === 'ValidationError' ? 400 : 500;
        res.status(status).json({ message: status === 400 ? 'Validation Failed' : 'Server error', error: error.message });
    }
};

// Update certificate
export const updateCertificate = async (req: Request, res: Response) => {
    try {
        console.log('[CERT UPDATE] ID:', req.params.id);
        console.log('[CERT UPDATE] Body keys:', Object.keys(req.body));
        console.log('[CERT UPDATE] Files:', req.files);

        const certificate = await Certificate.findById(req.params.id);
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        // Exclude image and pdf from req.body
        const { imageUrl, pdfUrl, ...otherData } = req.body;
        Object.assign(certificate, otherData);

        if (req.files) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            if (files.imageUrl) {
                const imgPath = files.imageUrl[0].path.startsWith('http') ? files.imageUrl[0].path : `/uploads/${files.imageUrl[0].filename}`;
                certificate.imageUrl = imgPath;
                console.log('[CERT UPDATE] Set Image URL:', imgPath);
            }
            if (files.pdfUrl) {
                const pdfPath = files.pdfUrl[0].path.startsWith('http') ? files.pdfUrl[0].path : `/uploads/${files.pdfUrl[0].filename}`;
                certificate.pdfUrl = pdfPath;
                console.log('[CERT UPDATE] Set PDF URL:', pdfPath);
            }
        }

        await certificate.save();
        res.json({ message: 'Certificate updated successfully', certificate });
    } catch (error: any) {
        const status = error.name === 'ValidationError' ? 400 : 500;
        res.status(status).json({ message: status === 400 ? 'Validation Failed' : 'Server error', error: error.message });
    }
};

// Delete certificate
export const deleteCertificate = async (req: Request, res: Response) => {
    try {
        const certificate = await Certificate.findByIdAndDelete(req.params.id);
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.json({ message: 'Certificate deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
