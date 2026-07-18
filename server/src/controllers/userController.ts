import { Request, Response } from 'express';
import { User } from '../models/User';
import { Booking } from '../models/Booking';

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    
    // Fetch bookings for this user
    const bookings = await Booking.find({ userId: req.user.id }).populate('vehicle').sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: { user, bookings } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const updates = req.body;
    // Do not allow updating password or role via this route
    delete updates.password;
    delete updates.role;
    delete updates.loyaltyPoints;
    delete updates.membershipTier;
    
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};
