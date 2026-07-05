import express from 'express';
import { processPayment } from '../controllers/paymentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, processPayment);

export default router;
