import express from 'express';
import { getQuickLinks, createQuickLink, updateQuickLink, deleteQuickLink } from '../controllers/quickLinkController';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

router.get('/', getQuickLinks);
router.post('/', authMiddleware, createQuickLink);
router.put('/:id', authMiddleware, updateQuickLink);
router.delete('/:id', authMiddleware, deleteQuickLink);

export default router;
