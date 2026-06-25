import { Request, Response } from 'express';
import Academic from '../models/Academic';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Get all academics
export const getAcademics = async (req: Request, res: Response) => {
    try {
        const academics = await Academic.find().sort({ startDate: -1 });
        res.json(academics);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single academic record
export const getAcademic = async (req: Request, res: Response) => {
    try {
        const academic = await Academic.findById(req.params.id);
        if (!academic) return res.status(404).json({ message: 'Academic record not found' });
        res.json(academic);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create academic record
export const createAcademic = async (req: Request, res: Response) => {
    try {
        const { semesterResults, ...otherData } = req.body;
        const academic = new Academic({
            ...otherData,
            semesterResults: typeof semesterResults === 'string' ? JSON.parse(semesterResults) : semesterResults
        });

        if (req.files && Array.isArray(req.files)) {
            const files = req.files as Express.Multer.File[];

            // Handle Logo Image
            const logoFile = files.find(f => f.fieldname === 'logo');
            if (logoFile) {
                const result = await cloudinary.uploader.upload(logoFile.path, { folder: 'academics/logos' });
                academic.logoUrl = result.secure_url;
                if (fs.existsSync(logoFile.path)) fs.unlinkSync(logoFile.path);
            }

            // Handle Carousel Images
            const imageFiles = files.filter(f => f.fieldname === 'images');
            if (imageFiles.length > 0) {
                const urls = [];
                for (const file of imageFiles) {
                    const result = await cloudinary.uploader.upload(file.path, { folder: 'academics/carousel' });
                    urls.push(result.secure_url);
                    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                }
                academic.imageUrls = urls;
            }

            // Handle Local PDFs
            const degreeFile = files.find(f => f.fieldname === 'degreeCertificate');
            if (degreeFile) {
                academic.degreeCertificateUrl = `/uploads/${degreeFile.filename}`;
            }

            const registrationFile = files.find(f => f.fieldname === 'registrationCertificate');
            if (registrationFile) {
                academic.registrationCertificateUrl = `/uploads/${registrationFile.filename}`;
            }

            // Handle Semester PDFs (marksheet_0, certificate_0, etc.)
            if (academic.semesterResults) {
                for (let i = 0; i < academic.semesterResults.length; i++) {
                    const marksheetFile = files.find(f => f.fieldname === `marksheet_${i}`);
                    if (marksheetFile) {
                        academic.semesterResults[i].marksheetUrl = `/uploads/${marksheetFile.filename}`;
                    }
                    const certFile = files.find(f => f.fieldname === `certificate_${i}`);
                    if (certFile) {
                        academic.semesterResults[i].certificateUrl = `/uploads/${certFile.filename}`;
                    }
                }
            }
        }

        await academic.save();
        res.status(201).json({ message: 'Academic record created successfully', academic });
    } catch (error: any) {
        console.error('[ACADEMIC CREATE ERROR]:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update academic record
export const updateAcademic = async (req: Request, res: Response) => {
    try {
        const academic = await Academic.findById(req.params.id);
        if (!academic) return res.status(404).json({ message: 'Academic record not found' });

        const { semesterResults, ...otherData } = req.body;
        Object.assign(academic, otherData);

        if (semesterResults) {
            academic.semesterResults = typeof semesterResults === 'string' ? JSON.parse(semesterResults) : semesterResults;
        }

        if (req.files && Array.isArray(req.files)) {
            const files = req.files as Express.Multer.File[];

            const logoFile = files.find(f => f.fieldname === 'logo');
            if (logoFile) {
                const result = await cloudinary.uploader.upload(logoFile.path, { folder: 'academics/logos' });
                academic.logoUrl = result.secure_url;
                if (fs.existsSync(logoFile.path)) fs.unlinkSync(logoFile.path);
            }

            const imageFiles = files.filter(f => f.fieldname === 'images');
            if (imageFiles.length > 0) {
                const newUrls = [];
                for (const file of imageFiles) {
                    const result = await cloudinary.uploader.upload(file.path, { folder: 'academics/carousel' });
                    newUrls.push(result.secure_url);
                    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                }
                academic.imageUrls = [...(academic.imageUrls || []), ...newUrls];
            }

            const degreeFile = files.find(f => f.fieldname === 'degreeCertificate');
            if (degreeFile) academic.degreeCertificateUrl = `/uploads/${degreeFile.filename}`;

            const registrationFile = files.find(f => f.fieldname === 'registrationCertificate');
            if (registrationFile) academic.registrationCertificateUrl = `/uploads/${registrationFile.filename}`;

            if (academic.semesterResults) {
                for (let i = 0; i < academic.semesterResults.length; i++) {
                    const marksheetFile = files.find(f => f.fieldname === `marksheet_${i}`);
                    if (marksheetFile) academic.semesterResults[i].marksheetUrl = `/uploads/${marksheetFile.filename}`;
                    const certFile = files.find(f => f.fieldname === `certificate_${i}`);
                    if (certFile) academic.semesterResults[i].certificateUrl = `/uploads/${certFile.filename}`;
                }
            }
        }

        await academic.save();
        res.json({ message: 'Academic record updated successfully', academic });
    } catch (error: any) {
        console.error('[ACADEMIC UPDATE ERROR]:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete academic record
export const deleteAcademic = async (req: Request, res: Response) => {
    try {
        const academic = await Academic.findByIdAndDelete(req.params.id);
        if (!academic) return res.status(404).json({ message: 'Academic record not found' });
        res.json({ message: 'Academic record deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
