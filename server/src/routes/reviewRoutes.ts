import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import { Review } from '../models/Review';

const router = express.Router();

router.get('/:vehicleId', async (req, res) => {
  try {
    const reviews = await Review.find({ vehicleId: req.params.vehicleId }).populate('user', 'firstName lastName avatar').sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/', protect, async (req: any, res: any) => {
  try {
    const { vehicleId, rating, comment } = req.body;
    const review = new Review({
      userId: req.user.id,
      vehicleId,
      rating: parseInt(rating),
      comment
    });
    await review.save();
    res.status(201).json({ success: true, data: review });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/:id', protect, admin, async (req: any, res: any) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
