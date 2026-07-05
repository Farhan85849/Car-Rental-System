import { prisma } from '../prisma';

export class BookingRepository {
  async findOverlappingBooking(vehicleId: string, start: Date, end: Date) {
    return prisma.booking.findFirst({
      where: {
        vehicleId,
        status: { notIn: ['CANCELLED', 'REJECTED', 'REFUNDED'] },
        AND: [
          { startDate: { lt: end } },
          { endDate: { gt: start } }
        ]
      }
    });
  }

  async createBookingWithTransaction(bookingData: any) {
    return prisma.$transaction(async (tx) => {
      return tx.booking.create({
        data: bookingData,
      });
    });
  }

  async findByUserId(userId: string) {
    return prisma.booking.findMany({
      where: { userId },
      include: { vehicle: true, invoice: true, payment: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: { vehicle: true, user: true, invoice: true, payment: true, statusHistory: { orderBy: { createdAt: 'desc' } } }
    });
  }

  async findAll() {
    return prisma.booking.findMany({
      include: { vehicle: true, user: true, payment: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateStatusWithTransaction(bookingId: string, vehicleId: string, status: string, notes: string) {
    return prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status,
          statusHistory: {
            create: {
              status,
              notes
            }
          }
        }
      });

      if (status === 'ACTIVE') {
        await tx.vehicle.update({ where: { id: vehicleId }, data: { status: 'RENTED' }});
      } else if (['COMPLETED', 'CANCELLED', 'REJECTED'].includes(status)) {
        await tx.vehicle.update({ where: { id: vehicleId }, data: { status: 'AVAILABLE' }});
      }

      return b;
    });
  }

  async cancelBooking(bookingId: string, notes: string) {
    return prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        statusHistory: {
          create: { status: 'CANCELLED', notes }
        }
      }
    });
  }
}

export const bookingRepository = new BookingRepository();
