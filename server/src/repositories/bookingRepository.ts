import { Booking } from '../models/Booking';
import { Payment } from '../models/Payment';
import mongoose from 'mongoose';

const bookingStatusHistorySchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  status: { type: String, required: true },
  notes: { type: String },
}, { timestamps: true });

export const BookingStatusHistoryModel = mongoose.model('BookingStatusHistory', bookingStatusHistorySchema);

export class BookingRepository {
  async createBookingWithTransaction(data: any) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { statusHistory, ...bookingData } = data;
      const booking = new Booking(bookingData);
      await booking.save({ session });
      
      if (statusHistory && statusHistory.create) {
        const history = new BookingStatusHistoryModel({
          bookingId: booking._id,
          status: statusHistory.create.status,
          notes: statusHistory.create.notes
        });
        await history.save({ session });
      }
      
      await session.commitTransaction();
      session.endSession();
      return booking;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async findById(id: string) {
    return Booking.findById(id).populate('user').populate('vehicle').populate('payment');
  }

  async findByUserId(userId: string) {
    return Booking.find({ userId }).populate('vehicle').sort({ createdAt: -1 });
  }

  async findAll() {
    return Booking.find().populate('user').populate('vehicle').sort({ createdAt: -1 });
  }

  async updateStatusWithTransaction(bookingId: string, vehicleId: string, status: string, notes: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true, session });
      
      const history = new BookingStatusHistoryModel({
        bookingId,
        status,
        notes
      });
      await history.save({ session });
      
      await session.commitTransaction();
      session.endSession();
      return booking;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
  
  async cancelBooking(bookingId: string, notes: string) {
    return this.updateStatusWithTransaction(bookingId, '', 'CANCELLED', notes);
  }

  async updatePaymentInfo(bookingId: string, paymentData: any) {
    let payment = await Payment.findOne({ bookingId });
    if (!payment) {
      payment = new Payment({ bookingId, ...paymentData });
    } else {
      Object.assign(payment, paymentData);
    }
    await payment.save();
    return Booking.findByIdAndUpdate(bookingId, { paymentId: payment._id }, { new: true });
  }

  async findOverlappingBooking(vehicleId: string, startDate: Date, endDate: Date) {
    return Booking.findOne({
      vehicleId,
      status: { $nin: ['CANCELLED', 'REJECTED', 'REFUNDED'] },
      startDate: { $lt: endDate },
      endDate: { $gt: startDate }
    });
  }
}

export const bookingRepository = new BookingRepository();
