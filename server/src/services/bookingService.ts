import { bookingRepository } from '../repositories/bookingRepository';
import { vehicleRepository } from '../repositories/vehicleRepository';
import { userRepository } from '../repositories/userRepository';
import { calculateBookingPrice, generateBookingNumber } from '../utils/priceCalculator';
import { sendEmail } from '../utils/email';

export class BookingService {
  async createBooking(data: any, userId: string) {
    const { vehicleId, startDate, endDate, pickupLoc, dropoffLoc, extras } = data;
    
    const vehicle = await vehicleRepository.findById(vehicleId);
    if (!vehicle) throw new Error('Vehicle not found');
    if (vehicle.status !== 'AVAILABLE') throw new Error('Vehicle is currently not available.');
    
    const overlapping = await bookingRepository.findOverlappingBooking(vehicleId, new Date(startDate), new Date(endDate));
    if (overlapping) throw new Error('Vehicle is already booked for these dates');
    
    const priceDetailsForDb = calculateBookingPrice(vehicle, startDate, endDate, extras || {});
    const bookingNumber = generateBookingNumber();
    
    const bookingData = {
      bookingNumber,
      userId,
      vehicleId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      pickupLoc,
      dropoffLoc,
      ...priceDetailsForDb,
      driverOption: extras?.driverOption || false,
      insurance: extras?.insurance || false,
      gps: extras?.gps || false,
      childSeat: extras?.childSeat || false,
      wifi: extras?.wifi || false,
      status: 'AWAITING_PAYMENT',
      statusHistory: {
        create: {
          status: 'AWAITING_PAYMENT',
          notes: 'Booking created, awaiting payment.'
        }
      }
    };
    
    const newBooking = await bookingRepository.createBookingWithTransaction(bookingData);
    
    // Fetch user for email
    const user = await userRepository.findById(userId);
    if (user && user.email) {
      await sendEmail(
        user.email,
        `Booking Confirmation - ${bookingNumber}`,
        `Your booking ${bookingNumber} has been created successfully.`,
        `<h3>Booking Confirmation</h3><p>Your booking ${bookingNumber} for ${vehicle.brand} ${vehicle.model} has been created successfully.</p>`
      );
    }
    
    return newBooking;
  }

  async getMyBookings(userId: string) {
    return bookingRepository.findByUserId(userId);
  }

  async getBookingById(id: string, user: any) {
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new Error('Not found');
    if (booking.userId !== user.id && user.role !== 'ADMIN') throw new Error('Unauthorized');
    return booking;
  }

  async getAllBookings() {
    return bookingRepository.findAll();
  }

  async updateBookingStatus(bookingId: string, status: string, notes: string) {
    const currentBooking = await bookingRepository.findById(bookingId);
    if (!currentBooking) throw new Error('Not found');
    
    const statusNotes = notes || `Status updated to ${status}`;
    const updated = await bookingRepository.updateStatusWithTransaction(bookingId, currentBooking.vehicleId, status, statusNotes);
    
    // Email update
    const user = await userRepository.findById(currentBooking.userId);
    if (user && user.email) {
      await sendEmail(
        user.email,
        `Booking Status Updated - ${currentBooking.bookingNumber}`,
        `Your booking ${currentBooking.bookingNumber} is now ${status}.`,
        `<h3>Booking Status Updated</h3><p>Your booking ${currentBooking.bookingNumber} is now ${status}.</p>`
      );
    }
    
    return updated;
  }

  async cancelBooking(bookingId: string, userId: string) {
    const currentBooking = await bookingRepository.findById(bookingId);
    if (!currentBooking) throw new Error('Not found');
    if (currentBooking.userId !== userId) throw new Error('Unauthorized');
    if (['ACTIVE', 'COMPLETED', 'CANCELLED'].includes(currentBooking.status)) {
      throw new Error('Cannot cancel this booking');
    }
    
    const cancelled = await bookingRepository.cancelBooking(bookingId, 'Cancelled by customer');
    
    const user = await userRepository.findById(userId);
    if (user && user.email) {
      await sendEmail(
        user.email,
        `Booking Cancelled - ${currentBooking.bookingNumber}`,
        `Your booking ${currentBooking.bookingNumber} has been cancelled successfully.`,
        `<h3>Booking Cancelled</h3><p>Your booking ${currentBooking.bookingNumber} has been cancelled successfully.</p>`
      );
    }
    
    return cancelled;
  }

  async calculatePrice(data: any) {
    const { vehicleId, startDate, endDate, extras } = data;
    const vehicle = await vehicleRepository.findById(vehicleId);
    if (!vehicle) throw new Error('Vehicle not found');
    
    return calculateBookingPrice(vehicle, startDate, endDate, extras || {});
  }
}

export const bookingService = new BookingService();
