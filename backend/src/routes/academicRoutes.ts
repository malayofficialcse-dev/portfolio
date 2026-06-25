import express from 'express';
import { getAcademics, getAcademic, createAcademic, updateAcademic, deleteAcademic } from '../controllers/academicController';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = express.Router();

router.get('/', getAcademics);
router.get('/:id', getAcademic);
router.post('/', authMiddleware, upload.any(), createAcademic);
router.put('/:id', authMiddleware, upload.any(), updateAcademic);
router.delete('/:id', authMiddleware, deleteAcademic);

export default router;
