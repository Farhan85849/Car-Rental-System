import { Router } from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { prisma } from '../prisma';

const router = Router();

router.get('/vehicle/:vehicleId', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { vehicleId: req.params.vehicleId },
      include: { user: { select: { firstName: true, lastName: true } } }
    });
    res.json({ success: true, data: reviews });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', protect, async (req: any, res) => {
  try {
    const { vehicleId, rating, comment } = req.body;
    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        vehicleId,
        rating,
        comment
      }
    });
    res.status(201).json({ success: true, data: review });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', protect, authorize('ADMIN'), async (req, res) => {
  try {
    await prisma.review.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Review deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
