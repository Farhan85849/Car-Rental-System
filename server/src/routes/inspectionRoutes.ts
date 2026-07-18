import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import { inspectionController } from '../controllers/inspectionController';

const router = express.Router();

router.post('/pickup', protect, admin, inspectionController.createPickupInspection);
router.post('/return', protect, admin, inspectionController.createReturnInspection);
router.get('/booking/:bookingId', protect, inspectionController.getInspectionsByBooking);
router.get('/', protect, admin, inspectionController.getAllInspections);

// Damages
router.get('/damages', protect, admin, inspectionController.getAllDamages);
router.put('/damages/:id/repair', protect, admin, inspectionController.markDamageRepaired);

// Fines
router.get('/fines', protect, admin, inspectionController.getAllFines);
router.get('/fines/customer', protect, inspectionController.getMyFines);
router.put('/fines/:id/status', protect, admin, inspectionController.updateFineStatus);
router.put('/fines/:id/appeal', protect, inspectionController.appealFine);
router.put('/fines/:id/pay', protect, inspectionController.payFine);

export default router;
