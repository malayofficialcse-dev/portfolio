import express from 'express';
import {
    getExperiences,
    getExperience,
    createExperience,
    updateExperience,
    deleteExperience
} from '../controllers/experienceController';
import { upload } from '../middlewares/upload';

const router = express.Router();

// Public routes
router.get('/', getExperiences);
router.get('/:id', getExperience);

// Protected routes (admin)
router.post('/', upload.any(), createExperience);

router.put('/:id', upload.any(), updateExperience);

router.delete('/:id', deleteExperience);

export default router;
