import { Router } from 'express';
import { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle } from '../controllers/vehicleController';
import { protect, authorize } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.get('/', getVehicles);
router.get('/:id', getVehicle);

router.post('/', protect, authorize('ADMIN'), upload.array('images', 5), createVehicle);
router.put('/:id', protect, authorize('ADMIN'), upload.array('images', 5), updateVehicle);
router.delete('/:id', protect, authorize('ADMIN'), deleteVehicle);

export default router;
