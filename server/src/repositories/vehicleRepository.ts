import { prisma } from '../prisma';

export class VehicleRepository {
  async findAll(whereClause: any) {
    return prisma.vehicle.findMany({
      where: whereClause,
      orderBy: { dailyPrice: 'desc' }
    });
  }

  async findOverlappingBookings(start: Date, end: Date) {
    return prisma.booking.findMany({
      where: {
        status: { notIn: ['CANCELLED', 'REJECTED', 'REFUNDED'] },
        AND: [
          { startDate: { lt: end } },
          { endDate: { gt: start } }
        ]
      },
      select: { vehicleId: true }
    });
  }

  async findById(id: string) {
    return prisma.vehicle.findUnique({ where: { id } });
  }

  async create(data: any) {
    return prisma.vehicle.create({ data });
  }

  async update(id: string, data: any) {
    return prisma.vehicle.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return prisma.vehicle.delete({ where: { id } });
  }
}

export const vehicleRepository = new VehicleRepository();
