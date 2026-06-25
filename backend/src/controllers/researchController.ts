import { Request, Response } from 'express';
import ResearchPaper from '../models/ResearchPaper';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Get all research papers
export const getResearchPapers = async (req: Request, res: Response) => {
    try {
        const papers = await ResearchPaper.find().sort({ publicationDate: -1 });
        res.json(papers);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single research paper
export const getResearchPaper = async (req: Request, res: Response) => {
    try {
        const paper = await ResearchPaper.findById(req.params.id);
        if (!paper) {
            return res.status(404).json({ message: 'Research paper not found' });
        }
        res.json(paper);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create research paper
export const createResearchPaper = async (req: Request, res: Response) => {
    try {
        console.log('[RESEARCH CREATE] Body:', req.body);
        console.log('[RESEARCH CREATE] Files:', req.files);

        const { pdfUrls, imageUrls, externalLinks, ...otherData } = req.body;
        const paper = new ResearchPaper(otherData);

        // Handle file uploads
        if (req.files && Array.isArray(req.files)) {
            const files = req.files as Express.Multer.File[];

            // Separate PDFs, images, and logos
            const pdfFiles = files.filter(f => f.fieldname === 'pdfs');
            const imageFiles = files.filter(f => f.fieldname === 'images');
            const logoFiles = files.filter(f => f.fieldname.startsWith('linkLogo_'));

            // Store PDFs locally (they are already in uploads/ by multer)
            paper.pdfUrls = pdfFiles.map(f => `/uploads/${f.filename}`);

            // Upload images to Cloudinary and remove local temp files
            const uploadedImageUrls = [];
            for (const file of imageFiles) {
                try {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: 'research/images'
                    });
                    uploadedImageUrls.push(result.secure_url);
                    // Remove local file
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                } catch (uploadError) {
                    console.error('[CLOUDINARY UPLOAD ERROR]:', uploadError);
                }
            }
            paper.imageUrls = uploadedImageUrls;

            // Handle External Link Logos
            if (externalLinks) {
                const links = typeof externalLinks === 'string' ? JSON.parse(externalLinks) : externalLinks;
                const processedLinks = [];
                
                for (let i = 0; i < links.length; i++) {
                    const link = links[i];
                    const logoFile = logoFiles.find(f => f.fieldname === `linkLogo_${i}`);
                    let logoUrl = link.logoUrl;

                    if (logoFile) {
                        try {
                            const result = await cloudinary.uploader.upload(logoFile.path, {
                                folder: 'research/logos'
                            });
                            logoUrl = result.secure_url;
                            if (fs.existsSync(logoFile.path)) {
                                fs.unlinkSync(logoFile.path);
                            }
                        } catch (logoError) {
                            console.error('[CLOUDINARY LOGO UPLOAD ERROR]:', logoError);
                        }
                    }

                    processedLinks.push({
                        url: link.url,
                        label: link.label,
                        logoUrl: logoUrl
                    });
                }
                paper.externalLinks = processedLinks;
            }
        }

        await paper.save();
        res.status(201).json({ message: 'Research paper created successfully', paper });
    } catch (error: any) {
        console.error('[RESEARCH CREATE ERROR]:', error);
        const status = error.name === 'ValidationError' ? 400 : 500;
        res.status(status).json({ message: status === 400 ? 'Validation Failed' : 'Server error', error: error.message });
    }
};

// Update research paper
export const updateResearchPaper = async (req: Request, res: Response) => {
    try {
        console.log('[RESEARCH UPDATE] ID:', req.params.id);
        console.log('[RESEARCH UPDATE] Body:', req.body);
        console.log('[RESEARCH UPDATE] Files:', req.files);

        const paper = await ResearchPaper.findById(req.params.id);
        if (!paper) {
            return res.status(404).json({ message: 'Research paper not found' });
        }

        const { pdfUrls, imageUrls, externalLinks, ...otherData } = req.body;
        Object.assign(paper, otherData);

        // Handle file uploads
        if (req.files && Array.isArray(req.files)) {
            const files = req.files as Express.Multer.File[];

            const pdfFiles = files.filter(f => f.fieldname === 'pdfs');
            const imageFiles = files.filter(f => f.fieldname === 'images');
            const logoFiles = files.filter(f => f.fieldname.startsWith('linkLogo_'));

            if (pdfFiles.length > 0) {
                const newPdfUrls = pdfFiles.map(f => `/uploads/${f.filename}`);
                paper.pdfUrls = [...(paper.pdfUrls || []), ...newPdfUrls];
            }

            if (imageFiles.length > 0) {
                const uploadedImageUrls = [];
                for (const file of imageFiles) {
                    try {
                        const result = await cloudinary.uploader.upload(file.path, {
                            folder: 'research/images'
                        });
                        uploadedImageUrls.push(result.secure_url);
                        if (fs.existsSync(file.path)) {
                            fs.unlinkSync(file.path);
                        }
                    } catch (uploadError) {
                        console.error('[CLOUDINARY UPLOAD ERROR]:', uploadError);
                    }
                }
                paper.imageUrls = [...(paper.imageUrls || []), ...uploadedImageUrls];
            }

            // Update external links and their logos
            if (externalLinks) {
                const links = typeof externalLinks === 'string' ? JSON.parse(externalLinks) : externalLinks;
                const processedLinks = [];

                for (let i = 0; i < links.length; i++) {
                    const link = links[i];
                    const logoFile = logoFiles.find(f => f.fieldname === `linkLogo_${i}`);
                    let logoUrl = link.logoUrl;

                    if (logoFile) {
                        try {
                            const result = await cloudinary.uploader.upload(logoFile.path, {
                                folder: 'research/logos'
                            });
                            logoUrl = result.secure_url;
                            if (fs.existsSync(logoFile.path)) {
                                fs.unlinkSync(logoFile.path);
                            }
                        } catch (logoError) {
                            console.error('[CLOUDINARY LOGO UPLOAD ERROR]:', logoError);
                        }
                    }

                    processedLinks.push({
                        url: link.url,
                        label: link.label,
                        logoUrl: logoUrl
                    });
                }
                paper.externalLinks = processedLinks;
            }
        }

        await paper.save();
        res.json({ message: 'Research paper updated successfully', paper });
    } catch (error: any) {
        console.error('[RESEARCH UPDATE ERROR]:', error);
        const status = error.name === 'ValidationError' ? 400 : 500;
        res.status(status).json({ message: status === 400 ? 'Validation Failed' : 'Server error', error: error.message });
    }
};

// Delete research paper
export const deleteResearchPaper = async (req: Request, res: Response) => {
    try {
        const paper = await ResearchPaper.findByIdAndDelete(req.params.id);
        if (!paper) {
            return res.status(404).json({ message: 'Research paper not found' });
        }
        res.json({ message: 'Research paper deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
