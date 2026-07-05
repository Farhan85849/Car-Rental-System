import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { calculateBookingPrice, generateBookingNumber } from '../utils/priceCalculator';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { vehicleId, startDate, endDate, pickupLoc, dropoffLoc, extras } = req.body;
    const userId = (req as any).user.id;

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    if (vehicle.status !== 'AVAILABLE') {
      return res.status(400).json({ success: false, error: 'Vehicle is currently not available.' });
    }

    // Check for overlapping bookings
    const overlapping = await prisma.booking.findFirst({
      where: {
        vehicleId,
        status: { notIn: ['CANCELLED', 'REJECTED', 'REFUNDED'] },
        AND: [
          { startDate: { lt: new Date(endDate) } },
          { endDate: { gt: new Date(startDate) } }
        ]
      }
    });

    if (overlapping) {
      return res.status(400).json({ success: false, error: 'Vehicle is already booked for these dates' });
    }

    const priceDetailsForDb = calculateBookingPrice(vehicle, startDate, endDate, extras || {});
    const bookingNumber = generateBookingNumber();

    const booking = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.create({
        data: {
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
        },
      });

      // We don't mark the vehicle as RENTED until confirmed/active, but you could mark it as reserved if needed.
      return b;
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { vehicle: true, invoice: true, payment: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { vehicle: true, user: true, invoice: true, payment: true, statusHistory: { orderBy: { createdAt: 'desc' } } }
    });
    if (!booking) return res.status(404).json({ success: false, error: 'Not found' });
    
    // Authorization check
    if (booking.userId !== (req as any).user.id && (req as any).user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { vehicle: true, user: true, payment: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;
    const bookingId = req.params.id;

    const currentBooking = await prisma.booking.findUnique({ where: { id: bookingId }});
    if (!currentBooking) return res.status(404).json({ success: false, error: 'Not found' });

    const booking = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status,
          statusHistory: {
            create: {
              status,
              notes: notes || `Status updated to ${status}`
            }
          }
        }
      });

      if (status === 'ACTIVE') {
        await tx.vehicle.update({ where: { id: currentBooking.vehicleId }, data: { status: 'RENTED' }});
      } else if (['COMPLETED', 'CANCELLED', 'REJECTED'].includes(status)) {
        await tx.vehicle.update({ where: { id: currentBooking.vehicleId }, data: { status: 'AVAILABLE' }});
      }

      return b;
    });

    res.status(200).json({ success: true, data: booking });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const bookingId = req.params.id;

    const currentBooking = await prisma.booking.findUnique({ where: { id: bookingId }});
    if (!currentBooking) return res.status(404).json({ success: false, error: 'Not found' });
    if (currentBooking.userId !== userId) return res.status(403).json({ success: false, error: 'Unauthorized' });

    if (['ACTIVE', 'COMPLETED', 'CANCELLED'].includes(currentBooking.status)) {
        return res.status(400).json({ success: false, error: 'Cannot cancel this booking' });
    }

    const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
            status: 'CANCELLED',
            statusHistory: {
                create: { status: 'CANCELLED', notes: 'Cancelled by customer' }
            }
        }
    });
    res.status(200).json({ success: true, data: booking });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const calculatePrice = async (req: Request, res: Response) => {
    try {
        const { vehicleId, startDate, endDate, extras } = req.body;
        const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
        if (!vehicle) return res.status(404).json({ success: false, error: 'Vehicle not found' });
        
        const priceDetails = calculateBookingPrice(vehicle, startDate, endDate, extras || {});
        res.status(200).json({ success: true, data: priceDetails });
    } catch (err: any) {
        res.status(400).json({ success: false, error: err.message });
    }
}
