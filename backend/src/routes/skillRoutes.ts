import express from 'express';
import { getSkills, getSkillSet, updateSkills, uploadSkillIcon } from '../controllers/skillController';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../config/cloudinary';

const router = express.Router();

router.get('/', getSkills);
router.get('/set', getSkillSet);
router.put('/set', authMiddleware, updateSkills);
router.post('/upload-icon', authMiddleware, upload.single('icon'), uploadSkillIcon);

export default router;
