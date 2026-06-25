import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../config/cloudinary';

const router = express.Router();

router.get('/', getProfile);
router.put('/', authMiddleware, upload.single('profileImage'), updateProfile);

export default router;
