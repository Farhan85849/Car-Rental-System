import { Request, Response } from 'express';
import { inspectionService } from '../services/inspectionService';

export const inspectionController = {
  createPickupInspection: async (req: any, res: Response) => {
    try {
      const staffId = req.user.id;
      const result = await inspectionService.createPickupInspection(req.body, staffId);
      res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  createReturnInspection: async (req: any, res: Response) => {
    try {
      const staffId = req.user.id;
      const result = await inspectionService.createReturnInspection(req.body, staffId);
      res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  getInspectionsByBooking: async (req: any, res: Response) => {
    try {
      const { bookingId } = req.params;
      const result = await inspectionService.getInspectionsByBooking(bookingId, req.user);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  getAllInspections: async (req: Request, res: Response) => {
    try {
      const result = await inspectionService.getAllInspections();
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  getAllDamages: async (req: Request, res: Response) => {
    try {
      const result = await inspectionService.getAllDamages();
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  markDamageRepaired: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { cost, notes } = req.body;
      const result = await inspectionService.markDamageRepaired(id, cost, notes);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  getAllFines: async (req: Request, res: Response) => {
    try {
      const result = await inspectionService.getAllFines();
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  getMyFines: async (req: any, res: Response) => {
    try {
      const result = await inspectionService.getMyFines(req.user.id);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  updateFineStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await inspectionService.updateFineStatus(id, status);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  appealFine: async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const result = await inspectionService.appealFine(id, req.user.id, notes);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  payFine: async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const result = await inspectionService.payFine(id, req.user.id);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
};
