import express from 'express';
import { handleChat, handleSearch, handleRecommendation, handleAnalytics } from '../controllers/aiController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/chat', handleChat);
router.post('/search', handleSearch);
router.post('/recommend', handleRecommendation);
router.get('/analytics', protect, authorize('ADMIN'), handleAnalytics);

export default router;
