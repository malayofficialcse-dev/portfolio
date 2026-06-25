import { Request, Response } from 'express';
import Admin from '../models/Admin';
import jwt from 'jsonwebtoken';

// Register Admin
export const registerAdmin = async (req: Request, res: Response) => {
    try {
        const { username, email, password, name } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const admin = new Admin({ username, email, password, name });
        await admin.save();

        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Admin registered successfully',
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                name: admin.name
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login Admin
export const loginAdmin = async (req: Request, res: Response) => {
    try {
        const { identity, password } = req.body;

        // Find admin by username OR email
        const admin = await Admin.findOne({
            $or: [
                { username: identity },
                { email: identity }
            ]
        });

        if (!admin) {
            return res.status(401).json({ message: 'Invalid identity or password' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid identity or password' });
        }

        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                name: admin.name
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
