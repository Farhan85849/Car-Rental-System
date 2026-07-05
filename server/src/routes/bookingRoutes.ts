import express from 'express';
import { createBooking, getMyBookings, getAllBookings, updateBookingStatus, cancelBooking, getBookingById, calculatePrice } from '../controllers/bookingController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/calculate', calculatePrice);
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.post('/:id/cancel', protect, cancelBooking);

router.get('/', protect, authorize('ADMIN'), getAllBookings);
router.put('/:id/status', protect, authorize('ADMIN'), updateBookingStatus);

export default router;
