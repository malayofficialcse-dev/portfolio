import express from 'express';
import { getBooks, getBook, createBook, updateBook, deleteBook } from '../controllers/bookController';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = express.Router();

router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', authMiddleware, upload.any(), createBook);
router.put('/:id', authMiddleware, upload.any(), updateBook);
router.delete('/:id', authMiddleware, deleteBook);

export default router;
