import { Request, Response } from 'express';
import { paymentService } from '../services/paymentService';

export const processPayment = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const result = await paymentService.processPayment(req.body, user);
    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    if (err.message === 'Booking not found') return res.status(404).json({ success: false, error: err.message });
    if (err.message === 'Unauthorized') return res.status(403).json({ success: false, error: err.message });
    res.status(400).json({ success: false, error: err.message });
  }
};
