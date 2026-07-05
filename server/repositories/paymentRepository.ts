import { prisma } from '../prisma';

export class PaymentRepository {
  async processPaymentWithTransaction(bookingId: string, amount: number, method: string, totalPrice: number, taxAmount: number) {
    const transactionId = `TXN-${Math.floor(Math.random() * 1000000000)}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
    
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          bookingId,
          amount,
          method,
          status: 'PAID',
          transactionId,
        }
      });
      
      await tx.invoice.create({
        data: {
          invoiceNumber,
          bookingId,
          totalAmount: totalPrice,
          taxAmount: taxAmount,
          status: 'PAID',
        }
      });
      
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
  }
}

export const paymentRepository = new PaymentRepository();
