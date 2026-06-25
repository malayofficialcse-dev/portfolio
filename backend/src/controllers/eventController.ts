import { Request, Response } from 'express';
import Event from '../models/Event';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Get all events
export const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await Event.find().sort({ date: -1 });
        res.json(events);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single event
export const getEvent = async (req: Request, res: Response) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create event
export const createEvent = async (req: Request, res: Response) => {
    try {
        const { skills, ...otherData } = req.body;
        const event = new Event({
            ...otherData,
            skills: Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : skills)
        });

        if (req.files && Array.isArray(req.files)) {
            const files = req.files as Express.Multer.File[];

            // Carousel Images
            const imageFiles = files.filter(f => f.fieldname === 'images');
            if (imageFiles.length > 0) {
                const urls = [];
                for (const file of imageFiles) {
                    const result = await cloudinary.uploader.upload(file.path, { folder: 'events/carousel' });
                    urls.push(result.secure_url);
                    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                }
                event.imageUrls = urls;
            }

            // Local Certification PDFs
            const certificateFiles = files.filter(f => f.fieldname === 'certificates');
            if (certificateFiles.length > 0) {
                event.certificateUrls = certificateFiles.map(f => `/uploads/${f.filename}`);
            }
        }

        await event.save();
        res.status(201).json({ message: 'Event created successfully', event });
    } catch (error: any) {
        console.error('[EVENT CREATE ERROR]:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update event
export const updateEvent = async (req: Request, res: Response) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const { skills, certificateUrls, imageUrls, ...otherData } = req.body;
        Object.assign(event, otherData);

        if (skills) {
            event.skills = Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : skills);
        }

        // Handle existing URLs
        if (imageUrls) event.imageUrls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
        if (certificateUrls) event.certificateUrls = Array.isArray(certificateUrls) ? certificateUrls : [certificateUrls];

        if (req.files && Array.isArray(req.files)) {
            const files = req.files as Express.Multer.File[];

            const imageFiles = files.filter(f => f.fieldname === 'images');
            if (imageFiles.length > 0) {
                const newUrls = [];
                for (const file of imageFiles) {
                    const result = await cloudinary.uploader.upload(file.path, { folder: 'events/carousel' });
                    newUrls.push(result.secure_url);
                    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                }
                event.imageUrls = [...(event.imageUrls || []), ...newUrls];
            }

            const certificateFiles = files.filter(f => f.fieldname === 'certificates');
            if (certificateFiles.length > 0) {
                const newCerts = certificateFiles.map(f => `/uploads/${f.filename}`);
                event.certificateUrls = [...(event.certificateUrls || []), ...newCerts];
            }
        }

        await event.save();
        res.json({ message: 'Event updated successfully', event });
    } catch (error: any) {
        console.error('[EVENT UPDATE ERROR]:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete event
export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
