import express from 'express';
import { getProjects, getProject, createProject, updateProject, deleteProject } from '../controllers/projectController';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../config/cloudinary';

const router = express.Router();

router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', authMiddleware, upload.fields([
    { name: 'images', maxCount: 50 },
    { name: 'pdfs', maxCount: 20 }
]), createProject);

router.put('/:id', authMiddleware, upload.fields([
    { name: 'images', maxCount: 50 },
    { name: 'pdfs', maxCount: 20 }
]), updateProject);
router.delete('/:id', authMiddleware, deleteProject);

export default router;
