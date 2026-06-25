import express from 'express';
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent } from '../controllers/eventController';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', authMiddleware, upload.any(), createEvent);
router.put('/:id', authMiddleware, upload.any(), updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);

export default router;
