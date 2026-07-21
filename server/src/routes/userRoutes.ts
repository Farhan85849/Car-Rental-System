import { Router } from 'express';
import { getProfile, updateProfile, updateAvatar } from '../controllers/userController';
import { upload } from '../middleware/uploadMiddleware';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

router.put('/profile/avatar', protect, upload.single('avatar'), updateAvatar);

export default router;
