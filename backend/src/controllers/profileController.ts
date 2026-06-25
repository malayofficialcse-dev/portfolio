import { Request, Response } from 'express';
import Profile from '../models/Profile';

// Get profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    let profile = await Profile.findOne();

    if (!profile) {
      profile = new Profile({
        name: 'Your Name',
        title: 'Professional Title',
        bio: 'Short bio about yourself',
        description: 'Detailed description about your background, experience, and expertise'
      });
      await profile.save();
    }

    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    console.log('[PROFILE UPDATE] Body keys:', Object.keys(req.body));
    console.log('[PROFILE UPDATE] File:', req.file);

    let profile = await Profile.findOne();

    if (!profile) {
      // Exclude profileImage from req.body to prevent cast errors
      const { profileImage: dummy, ...otherData } = req.body;
      profile = new Profile(otherData);
    } else {
      // Exclude profileImage from req.body to prevent cast errors if it's sent as an object/null
      const { profileImage: dummy, ...otherData } = req.body;
      Object.assign(profile, otherData);
    }

    if (req.file) {
      // If using Cloudinary, path will be the full URL. If local, it's just the filename.
      const filePath = req.file.path.startsWith('http') ? req.file.path : `/uploads/${req.file.filename}`;
      profile.profileImage = filePath;
      console.log('[PROFILE UPDATE] Set Image URL:', filePath);
    }

    await profile.save();
    res.json({ message: 'Profile updated successfully', profile });
  } catch (error: any) {
    console.error('[PROFILE UPDATE ERROR]', error);
    const status = error.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({
      message: status === 400 ? 'Validation Failed' : 'Server error',
      error: error.message,
      details: error.errors
    });
  }
};
