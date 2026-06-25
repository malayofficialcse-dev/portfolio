import { Request, Response } from 'express';
import Skill from '../models/Skill';

// Get all skills
export const getSkills = async (req: Request, res: Response) => {
    try {
        const skills = await Skill.find().sort({ createdAt: -1 });
        res.json(skills);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single skill set (usually there's only one)
export const getSkillSet = async (req: Request, res: Response) => {
    try {
        let skillSet = await Skill.findOne();

        if (!skillSet) {
            skillSet = new Skill({
                communicationSkills: [],
                technicalSkills: [],
                theoreticalSkills: []
            });
            await skillSet.save();
        }

        res.json(skillSet);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Upload skill icon
export const uploadSkillIcon = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = req.file.path.startsWith('http') ? req.file.path : `/uploads/${req.file.filename}`;
        res.json({ url: filePath });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateSkills = async (req: Request, res: Response) => {
    try {
        const { communicationSkills, technicalSkills, theoreticalSkills } = req.body;

        let skillSet = await Skill.findOne();

        if (!skillSet) {
            skillSet = new Skill({
                communicationSkills,
                technicalSkills,
                theoreticalSkills
            });
        } else {
            skillSet.communicationSkills = communicationSkills;
            skillSet.technicalSkills = technicalSkills;
            skillSet.theoreticalSkills = theoreticalSkills;
        }

        await skillSet.save();
        res.json({ message: 'Skills updated successfully', skillSet });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
