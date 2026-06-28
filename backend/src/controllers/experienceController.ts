import { Request, Response } from 'express';
import Experience from '../models/Experience';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const uploadFileAndGetUrl = async (file: Express.Multer.File, folder: string) => {
    const isCloudinaryConfigured = Boolean(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_CLOUD_NAME !== 'demo' &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_KEY !== 'demo' &&
        process.env.CLOUDINARY_API_SECRET &&
        process.env.CLOUDINARY_API_SECRET !== 'demo'
    );

    if (isCloudinaryConfigured) {
        try {
            const result = await cloudinary.uploader.upload(file.path, { folder });
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            return result.secure_url;
        } catch (error) {
            console.warn(`[EXP UPLOAD] Cloudinary upload failed for ${file.originalname}, falling back to local storage`, error);
        }
    }

    return `/uploads/${file.filename}`;
};

// Get all experiences
export const getExperiences = async (req: Request, res: Response) => {
    try {
        const experiences = await Experience.find().sort({ joinDate: -1 });
        res.json(experiences);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single experience
export const getExperience = async (req: Request, res: Response) => {
    try {
        const experience = await Experience.findById(req.params.id);
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }
        res.json(experience);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create experience
export const createExperience = async (req: Request, res: Response) => {
    try {
        let { projects, skills, ...experienceData } = req.body;

        const experience = new Experience({
            ...experienceData,
            projects: typeof projects === 'string' ? JSON.parse(projects) : projects,
            skills: typeof skills === 'string' ? JSON.parse(skills) : skills,
            isCurrent: req.body.isCurrent === 'true'
        });

        if (req.files && Array.isArray(req.files)) {
            const files = req.files as Express.Multer.File[];

            // Handle Main Experience Images (Cloudinary)
            const mainImageFiles = files.filter(f => f.fieldname === 'images');
            if (mainImageFiles.length > 0) {
                const urls = [];
                for (const file of mainImageFiles) {
                    const url = await uploadFileAndGetUrl(file, 'experiences/main');
                    urls.push(url);
                }
                experience.imageUrls = urls;
            }

            // Handle Project Images (Cloudinary)
            if (experience.projects) {
                for (let i = 0; i < experience.projects.length; i++) {
                    const projectImageFiles = files.filter(f => f.fieldname === `project_${i}_images`);
                    if (projectImageFiles.length > 0) {
                        const urls = [];
                        for (const file of projectImageFiles) {
                            const url = await uploadFileAndGetUrl(file, 'experiences/projects');
                            urls.push(url);
                        }
                        experience.projects[i].images = urls;
                    }
                }
            }

            // Handle Skill Icons
            if (experience.skills) {
                for (let i = 0; i < experience.skills.length; i++) {
                    const skillIconFile = files.find(f => f.fieldname === `skill_icon_${i}`);
                    if (skillIconFile) {
                        experience.skills[i].iconUrl = await uploadFileAndGetUrl(skillIconFile, 'experiences/skills');
                    }
                }
            }

            // Handle Documents (Local PDF)
            const documentFiles = files.filter(f => f.fieldname === 'documents');
            if (documentFiles.length > 0) {
                experience.documentUrls = documentFiles.map(f => `/uploads/${f.filename}`);
            }
        }

        await experience.save();
        res.status(201).json({ message: 'Experience created successfully', experience });
    } catch (error: any) {
        console.error('[EXP CREATE ERROR]:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update experience
export const updateExperience = async (req: Request, res: Response) => {
    try {
        const experience = await Experience.findById(req.params.id);
        if (!experience) return res.status(404).json({ message: 'Experience not found' });

        let { projects, skills, ...updateData } = req.body;
        Object.assign(experience, updateData);

        if (projects) experience.projects = typeof projects === 'string' ? JSON.parse(projects) : projects;
        if (skills) experience.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
        if (req.body.isCurrent !== undefined) experience.isCurrent = req.body.isCurrent === 'true';

        if (req.files && Array.isArray(req.files)) {
            const files = req.files as Express.Multer.File[];

            // Handle Main Images
            const mainImageFiles = files.filter(f => f.fieldname === 'images');
            if (mainImageFiles.length > 0) {
                const urls = [];
                for (const file of mainImageFiles) {
                    const url = await uploadFileAndGetUrl(file, 'experiences/main');
                    urls.push(url);
                }
                experience.imageUrls = [...(experience.imageUrls || []), ...urls];
            }

            // Handle Project Images
            if (experience.projects) {
                for (let i = 0; i < experience.projects.length; i++) {
                    const projectImageFiles = files.filter(f => f.fieldname === `project_${i}_images`);
                    if (projectImageFiles.length > 0) {
                        const urls = [];
                        for (const file of projectImageFiles) {
                            const url = await uploadFileAndGetUrl(file, 'experiences/projects');
                            urls.push(url);
                        }
                        experience.projects[i].images = [...(experience.projects[i].images || []), ...urls];
                    }
                }
            }

            // Handle Skill Icons
            if (experience.skills) {
                for (let i = 0; i < experience.skills.length; i++) {
                    const skillIconFile = files.find(f => f.fieldname === `skill_icon_${i}`);
                    if (skillIconFile) {
                        experience.skills[i].iconUrl = await uploadFileAndGetUrl(skillIconFile, 'experiences/skills');
                    }
                }
            }

            // Handle Documents
            const documentFiles = files.filter(f => f.fieldname === 'documents');
            if (documentFiles.length > 0) {
                experience.documentUrls = [...(experience.documentUrls || []), ...documentFiles.map(f => `/uploads/${f.filename}`)];
            }
        }

        await experience.save();
        res.json({ message: 'Experience updated successfully', experience });
    } catch (error: any) {
        console.error('[EXP UPDATE ERROR]:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete experience
export const deleteExperience = async (req: Request, res: Response) => {
    try {
        const experience = await Experience.findByIdAndDelete(req.params.id);
        if (!experience) return res.status(404).json({ message: 'Experience not found' });
        res.json({ message: 'Experience deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

