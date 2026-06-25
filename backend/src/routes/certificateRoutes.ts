import express from 'express';
import { getCertificates, getCertificate, createCertificate, updateCertificate, deleteCertificate } from '../controllers/certificateController';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../config/cloudinary';

const router = express.Router();

router.get('/', getCertificates);
router.get('/:id', getCertificate);
router.post('/', authMiddleware, upload.fields([
    { name: 'imageUrl', maxCount: 1 },
    { name: 'pdfUrl', maxCount: 1 }
]), createCertificate);
router.put('/:id', authMiddleware, upload.fields([
    { name: 'imageUrl', maxCount: 1 },
    { name: 'pdfUrl', maxCount: 1 }
]), updateCertificate);
router.delete('/:id', authMiddleware, deleteCertificate);

export default router;
