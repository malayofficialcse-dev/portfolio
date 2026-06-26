import express from 'express';
import {
    getExperiences,
    getExperience,
    createExperience,
    updateExperience,
    deleteExperience
} from '../controllers/experienceController';
import { upload } from '../middlewares/upload';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.get('/', getExperiences);
router.get('/:id', getExperience);

// Protected routes (admin)
router.post('/', authMiddleware, upload.any(), createExperience);

router.put('/:id', authMiddleware, upload.any(), updateExperience);

router.delete('/:id', authMiddleware, deleteExperience);

export default router;
