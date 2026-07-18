import { Vehicle } from '../models/Vehicle';
import { Booking } from '../models/Booking';

export class VehicleRepository {
  async findAll(whereClause: any = {}) {
    return Vehicle.find(whereClause).sort({ dailyPrice: -1 });
  }

  async findOverlappingBookings(start: Date, end: Date) {
    return Booking.find({
      status: { $nin: ['CANCELLED', 'REJECTED', 'REFUNDED'] },
      startDate: { $lt: end },
      endDate: { $gt: start }
    }).select('vehicleId');
  }

  async findById(id: string) {
    return Vehicle.findById(id);
  }

  async create(data: any) {
    const vehicle = new Vehicle(data);
    await vehicle.save();
    return vehicle;
  }

  async update(id: string, data: any) {
    return Vehicle.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return Vehicle.findByIdAndDelete(id);
  }
}

export const vehicleRepository = new VehicleRepository();
