import { vehicleRepository } from '../repositories/vehicleRepository';

export class VehicleService {
  async getVehicles(query: any) {
    const { category, brand, startDate, endDate, location } = query;
    const whereClause: any = {};
    
    if (category) whereClause.category = category;
    if (brand) whereClause.brand = brand;
    if (location) whereClause.location = { contains: String(location) };
    
    if (startDate && endDate) {
        const start = new Date(startDate as string);
        const end = new Date(endDate as string);
        
        const overlappingBookings = await vehicleRepository.findOverlappingBookings(start, end);
        const bookedVehicleIds = overlappingBookings.map(b => b.vehicleId);
        
        whereClause.id = { notIn: bookedVehicleIds };
        whereClause.status = 'AVAILABLE';
    }
    
    return vehicleRepository.findAll(whereClause);
  }

  async getVehicleById(id: string) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    return vehicle;
  }

  async createVehicle(data: any, files?: any[]) {
    const parsedData = {
      ...data,
      year: parseInt(data.year),
      dailyPrice: parseFloat(data.dailyPrice),
      weeklyPrice: parseFloat(data.weeklyPrice),
      monthlyPrice: parseFloat(data.monthlyPrice),
      securityDeposit: parseFloat(data.securityDeposit || '0'),
      seats: parseInt(data.seats),
      doors: parseInt(data.doors || '4'),
      mileage: parseInt(data.mileage),
    };
    
    if (files && files.length > 0) {
      const imageUrls = files.map((file: any) => file.path);
      parsedData.images = JSON.stringify(imageUrls);
    } else if (data.images && typeof data.images === 'string') {
      parsedData.images = data.images;
    } else {
      parsedData.images = JSON.stringify([]);
    }
    
    if (typeof parsedData.features === 'string' && !parsedData.features.startsWith('[')) {
       parsedData.features = JSON.stringify(parsedData.features.split(',').map((f: string) => f.trim()));
    } else if (Array.isArray(parsedData.features)) {
       parsedData.features = JSON.stringify(parsedData.features);
    }
    
    return vehicleRepository.create(parsedData);
  }

  async updateVehicle(id: string, data: any, files?: any[]) {
    let parsedData = { ...data };
    
    if (data.year) parsedData.year = parseInt(data.year);
    if (data.dailyPrice) parsedData.dailyPrice = parseFloat(data.dailyPrice);
    if (data.weeklyPrice) parsedData.weeklyPrice = parseFloat(data.weeklyPrice);
    if (data.monthlyPrice) parsedData.monthlyPrice = parseFloat(data.monthlyPrice);
    if (data.securityDeposit) parsedData.securityDeposit = parseFloat(data.securityDeposit);
    if (data.seats) parsedData.seats = parseInt(data.seats);
    if (data.doors) parsedData.doors = parseInt(data.doors);
    if (data.mileage) parsedData.mileage = parseInt(data.mileage);
    
    if (files && files.length > 0) {
      const imageUrls = files.map((file: any) => file.path);
      parsedData.images = JSON.stringify(imageUrls);
    }
    
    if (typeof parsedData.features === 'string' && !parsedData.features.startsWith('[')) {
       parsedData.features = JSON.stringify(parsedData.features.split(',').map((f: string) => f.trim()));
    } else if (Array.isArray(parsedData.features)) {
       parsedData.features = JSON.stringify(parsedData.features);
    }
    
    return vehicleRepository.update(id, parsedData);
  }

  async deleteVehicle(id: string) {
    return vehicleRepository.delete(id);
  }
}

export const vehicleService = new VehicleService();
