import { paymentRepository } from '../repositories/paymentRepository';
import { bookingRepository } from '../repositories/bookingRepository';

export class PaymentService {
  async processPayment(data: any, user: any) {
    const { bookingId, amount, method } = data;
    
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    if (booking.userId.toString() !== user.id && user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
    
    return paymentRepository.processPaymentWithTransaction(bookingId, amount, method, booking.totalPrice, booking.tax);
  }
}

export const paymentService = new PaymentService();
