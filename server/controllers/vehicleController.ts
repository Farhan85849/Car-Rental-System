import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const { category, brand, startDate, endDate, location } = req.query;
    
    const whereClause: any = {};
    if (category) whereClause.category = category;
    if (brand) whereClause.brand = brand;
    if (location) whereClause.location = { contains: String(location) };
    
    // Implementation for availability engine
    if (startDate && endDate) {
        const start = new Date(startDate as string);
        const end = new Date(endDate as string);
        
        // Find bookings that overlap
        const overlappingBookings = await prisma.booking.findMany({
            where: {
                status: { notIn: ['CANCELLED', 'REJECTED', 'REFUNDED'] },
                AND: [
                    { startDate: { lt: end } },
                    { endDate: { gt: start } }
                ]
            },
            select: { vehicleId: true }
        });
        
        const bookedVehicleIds = overlappingBookings.map(b => b.vehicleId);
        
        whereClause.id = { notIn: bookedVehicleIds };
        whereClause.status = 'AVAILABLE';
    }

    const vehicles = await prisma.vehicle.findMany({ 
      where: whereClause,
      orderBy: { dailyPrice: 'desc' }
    });
    res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: req.params.id } });
    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }
    res.status(200).json({ success: true, data: vehicle });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    // Parse numeric fields
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

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const imageUrls = (req.files as Express.Multer.File[]).map(file => file.path);
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

    const vehicle = await prisma.vehicle.create({
      data: parsedData,
    });

    res.status(201).json({ success: true, data: vehicle });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    let parsedData = { ...data };
    
    if (data.year) parsedData.year = parseInt(data.year);
    if (data.dailyPrice) parsedData.dailyPrice = parseFloat(data.dailyPrice);
    if (data.weeklyPrice) parsedData.weeklyPrice = parseFloat(data.weeklyPrice);
    if (data.monthlyPrice) parsedData.monthlyPrice = parseFloat(data.monthlyPrice);
    if (data.securityDeposit) parsedData.securityDeposit = parseFloat(data.securityDeposit);
    if (data.seats) parsedData.seats = parseInt(data.seats);
    if (data.doors) parsedData.doors = parseInt(data.doors);
    if (data.mileage) parsedData.mileage = parseInt(data.mileage);

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const imageUrls = (req.files as Express.Multer.File[]).map(file => file.path);
      parsedData.images = JSON.stringify(imageUrls);
    }

    if (typeof parsedData.features === 'string' && !parsedData.features.startsWith('[')) {
       parsedData.features = JSON.stringify(parsedData.features.split(',').map((f: string) => f.trim()));
    } else if (Array.isArray(parsedData.features)) {
       parsedData.features = JSON.stringify(parsedData.features);
    }

    const vehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: parsedData,
    });

    res.status(200).json({ success: true, data: vehicle });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    await prisma.vehicle.delete({
      where: { id: req.params.id },
    });
    res.status(200).json({ success: true, data: {} });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};
