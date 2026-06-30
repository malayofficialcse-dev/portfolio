import { Request, Response } from 'express';
import QuickLink from '../models/QuickLink';

const DEFAULT_QUICK_LINKS = [
  { name: "GitHub", icon: "FaGithub", text: "900+ Contributions", link: "/projects", order: 0 },
  { name: "LinkedIn", icon: "FaLinkedin", text: "1.5k+ Connections", link: "/skills", order: 1 },
  { name: "Google Scholar", icon: "SiGooglescholar", text: "9+ Publications", link: "/certificates", order: 2 },
  { name: "Research Gate", icon: "SiResearchgate", text: "60+ Publications", link: "/research", order: 3 },
  { name: "ORCID", icon: "SiOrcid", text: "0211-0000-0000", link: "/books", order: 4 },
  { name: "DockerHub", icon: "FaDocker", text: "10+ Images", link: "/experiences", order: 5 },
  { name: "LeetCode", icon: "SiLeetcode", text: "Top 22%", link: "/events", order: 6 },
  { name: "GeeksforGeeks", icon: "SiGeeksforgeeks", text: "Top 8%", link: "/academic", order: 7 }
];

// Get all quick links
export const getQuickLinks = async (req: Request, res: Response) => {
    try {
        let quickLinks = await QuickLink.find().sort({ order: 1, createdAt: 1 });
        
        // If none exist, seed with defaults
        if (quickLinks.length === 0) {
            await QuickLink.insertMany(DEFAULT_QUICK_LINKS);
            quickLinks = await QuickLink.find().sort({ order: 1, createdAt: 1 });
        }
        
        res.json(quickLinks);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create a quick link
export const createQuickLink = async (req: Request, res: Response) => {
    try {
        const { name, icon, text, link, order } = req.body;
        
        const quickLink = new QuickLink({
            name,
            icon,
            text,
            link,
            order: order ? Number(order) : 0
        });

        await quickLink.save();
        res.status(201).json({ message: 'Quick Link created successfully', quickLink });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a quick link
export const updateQuickLink = async (req: Request, res: Response) => {
    try {
        const { name, icon, text, link, order } = req.body;
        
        const quickLink = await QuickLink.findById(req.params.id);
        if (!quickLink) {
            return res.status(404).json({ message: 'Quick Link not found' });
        }

        if (name !== undefined) quickLink.name = name;
        if (icon !== undefined) quickLink.icon = icon;
        if (text !== undefined) quickLink.text = text;
        if (link !== undefined) quickLink.link = link;
        if (order !== undefined) quickLink.order = Number(order);

        await quickLink.save();
        res.json({ message: 'Quick Link updated successfully', quickLink });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a quick link
export const deleteQuickLink = async (req: Request, res: Response) => {
    try {
        const quickLink = await QuickLink.findByIdAndDelete(req.params.id);
        if (!quickLink) {
            return res.status(404).json({ message: 'Quick Link not found' });
        }
        res.json({ message: 'Quick Link deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
