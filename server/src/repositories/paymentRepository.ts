import { Payment } from '../models/Payment';
import { Booking } from '../models/Booking';
import mongoose from 'mongoose';

export class PaymentRepository {
  async create(data: any) {
    const payment = new Payment(data);
    await payment.save();
    return payment;
  }

  async findById(id: string) {
    return Payment.findById(id);
  }

  async findByBookingId(bookingId: string) {
    return Payment.findOne({ bookingId });
  }

  async update(id: string, data: any) {
    return Payment.findByIdAndUpdate(id, data, { new: true });
  }

  async updateStatusAndTransactionId(bookingId: string, status: string, transactionId: string) {
    return Payment.findOneAndUpdate(
      { bookingId },
      { status, transactionId },
      { new: true }
    );
  }

  async processPaymentWithTransaction(bookingId: string, amount: number, method: string, totalPrice: number, tax: number) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const transactionId = `txn_${Date.now()}`;
      const payment = new Payment({
        bookingId,
        amount,
        method,
        status: 'COMPLETED',
        transactionId
      });
      await payment.save({ session });
      
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: 'CONFIRMED', paymentId: payment._id },
        { new: true, session }
      );
      
      await session.commitTransaction();
      session.endSession();
      return payment;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}

export const paymentRepository = new PaymentRepository();
