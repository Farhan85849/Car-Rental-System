import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const processPayment = async (req: Request, res: Response) => {
  try {
    const { bookingId, amount, method } = req.body;
    const userId = (req as any).user.id;

    const booking = await prisma.booking.findUnique({ 
        where: { id: bookingId },
        include: { user: true }
    });
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    
    if (booking.userId !== userId && (req as any).user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    // Mock payment processing
    const transactionId = `TXN-${Math.floor(Math.random() * 1000000000)}`;

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          bookingId,
          amount,
          method,
          status: 'PAID',
          transactionId,
        }
      });

      // Generate invoice
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
      await tx.invoice.create({
        data: {
          invoiceNumber,
          bookingId,
          totalAmount: booking.totalPrice,
          taxAmount: booking.tax,
          status: 'PAID',
        }
      });

      // Update booking status
      await tx.booking.update({
        where: { id: bookingId },
        data: { 
            status: 'CONFIRMED',
            statusHistory: {
                create: { status: 'CONFIRMED', notes: `Payment received via ${method}. Transaction ID: ${transactionId}` }
            }
        }
      });

      return payment;
    });

    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};
