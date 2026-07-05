import { Request, Response } from 'express';
import { bookingService } from '../services/bookingService';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const booking = await bookingService.createBooking(req.body, userId);
    res.status(201).json({ success: true, data: booking });
  } catch (err: any) {
    if (err.message === 'Vehicle not found') return res.status(404).json({ success: false, error: err.message });
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const bookings = await bookingService.getMyBookings(userId);
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const booking = await bookingService.getBookingById(req.params.id, user);
    res.status(200).json({ success: true, data: booking });
  } catch (err: any) {
    if (err.message === 'Not found') return res.status(404).json({ success: false, error: err.message });
    if (err.message === 'Unauthorized') return res.status(403).json({ success: false, error: err.message });
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;
    const booking = await bookingService.updateBookingStatus(req.params.id, status, notes);
    res.status(200).json({ success: true, data: booking });
  } catch (err: any) {
    if (err.message === 'Not found') return res.status(404).json({ success: false, error: err.message });
    res.status(400).json({ success: false, error: err.message });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const booking = await bookingService.cancelBooking(req.params.id, userId);
    res.status(200).json({ success: true, data: booking });
  } catch (err: any) {
    if (err.message === 'Not found') return res.status(404).json({ success: false, error: err.message });
    if (err.message === 'Unauthorized') return res.status(403).json({ success: false, error: err.message });
    res.status(400).json({ success: false, error: err.message });
  }
};

export const calculatePrice = async (req: Request, res: Response) => {
  try {
    const priceDetails = await bookingService.calculatePrice(req.body);
    res.status(200).json({ success: true, data: priceDetails });
  } catch (err: any) {
    if (err.message === 'Vehicle not found') return res.status(404).json({ success: false, error: err.message });
    res.status(400).json({ success: false, error: err.message });
  }
};
