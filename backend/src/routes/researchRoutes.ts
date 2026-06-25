import express from 'express';
import { getResearchPapers, getResearchPaper, createResearchPaper, updateResearchPaper, deleteResearchPaper } from '../controllers/researchController';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = express.Router();

router.get('/', getResearchPapers);
router.get('/:id', getResearchPaper);
router.post('/', authMiddleware, upload.any(), createResearchPaper);
router.put('/:id', authMiddleware, upload.any(), updateResearchPaper);
router.delete('/:id', authMiddleware, deleteResearchPaper);

export default router;
