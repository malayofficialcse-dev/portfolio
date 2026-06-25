import { Request, Response } from 'express';
import Project from '../models/Project';

// Get all projects
export const getProjects = async (req: Request, res: Response) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single project
export const getProject = async (req: Request, res: Response) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create project
export const createProject = async (req: Request, res: Response) => {
    try {
        console.log('[PROJECT CREATE] Body:', req.body);
        console.log('[PROJECT CREATE] Files:', req.files);

        // Exclude image and pdf fields from req.body
        const { imageUrls, pdfUrls, ...otherData } = req.body;
        const project = new Project(otherData);

        if (req.files) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            if (files.images) {
                // Use Cloudinary URL from file.path instead of local path
                project.imageUrls = files.images.map(f => (f as any).path);
                console.log('[PROJECT CREATE] Set Image URLs from Cloudinary:', project.imageUrls);
            }
            if (files.pdfs) {
                // Use Cloudinary URL from file.path instead of local path
                project.pdfUrls = files.pdfs.map(f => (f as any).path);
                console.log('[PROJECT CREATE] Set PDF URLs from Cloudinary:', project.pdfUrls);
            }
        }

        await project.save();
        res.status(201).json({ message: 'Project created successfully', project });
    } catch (error: any) {
        const status = error.name === 'ValidationError' ? 400 : 500;
        res.status(status).json({ message: status === 400 ? 'Validation Failed' : 'Server error', error: error.message });
    }
};

// Update project
export const updateProject = async (req: Request, res: Response) => {
    try {
        console.log('[PROJECT UPDATE] ID:', req.params.id);
        console.log('[PROJECT UPDATE] Body keys:', Object.keys(req.body));
        console.log('[PROJECT UPDATE] Files:', req.files);

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Exclude image and pdf fields from req.body
        const { imageUrls, pdfUrls, ...otherData } = req.body;
        Object.assign(project, otherData);

        if (req.files) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            if (files.images) {
                // Use Cloudinary URL from file.path instead of local path
                project.imageUrls = files.images.map(f => (f as any).path);
                console.log('[PROJECT UPDATE] Set Image URLs from Cloudinary:', project.imageUrls);
            }
            if (files.pdfs) {
                // Use Cloudinary URL from file.path instead of local path
                project.pdfUrls = files.pdfs.map(f => (f as any).path);
                console.log('[PROJECT UPDATE] Set PDF URLs from Cloudinary:', project.pdfUrls);
            }
        }

        await project.save();
        res.json({ message: 'Project updated successfully', project });
    } catch (error: any) {
        const status = error.name === 'ValidationError' ? 400 : 500;
        res.status(status).json({ message: status === 400 ? 'Validation Failed' : 'Server error', error: error.message });
    }
};

// Delete project
export const deleteProject = async (req: Request, res: Response) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
