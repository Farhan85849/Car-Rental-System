import { Request, Response } from 'express';
import { vehicleService } from '../services/vehicleService';

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleService.getVehicles(req.query);
    res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    res.status(200).json({ success: true, data: vehicle });
  } catch (err: any) {
    if (err.message === 'Vehicle not found') {
      return res.status(404).json({ success: false, error: err.message });
    }
    res.status(400).json({ success: false, error: err.message });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const files = req.files && Array.isArray(req.files) ? req.files : undefined;
    const vehicle = await vehicleService.createVehicle(req.body, files);
    res.status(201).json({ success: true, data: vehicle });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const files = req.files && Array.isArray(req.files) ? req.files : undefined;
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body, files);
    res.status(200).json({ success: true, data: vehicle });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    await vehicleService.deleteVehicle(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};
