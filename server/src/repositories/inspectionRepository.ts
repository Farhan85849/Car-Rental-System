import { Inspection } from '../models/Inspection';
import { Damage } from '../models/Damage';
import { Fine } from '../models/Fine';
import { RepairHistory } from '../models/RepairHistory';

export const inspectionRepository = {
  createInspection: async (data: any, session?: any) => {
    const inspection = new Inspection(data);
    return await inspection.save({ session });
  },

  getInspectionsByBooking: async (bookingId: string) => {
    return await Inspection.find({ bookingId }).sort({ createdAt: -1 });
  },

  getAllInspections: async () => {
    return await Inspection.find().populate('booking vehicle customer staff').sort({ createdAt: -1 });
  },

  createDamage: async (data: any, session?: any) => {
    const damage = new Damage(data);
    return await damage.save({ session });
  },

  getAllDamages: async () => {
    return await Damage.find().populate('booking vehicle inspection customer staff').sort({ createdAt: -1 });
  },

  getDamageById: async (id: string) => {
    return await Damage.findById(id);
  },

  updateDamageStatus: async (id: string, status: string, session?: any) => {
    return await Damage.findByIdAndUpdate(id, { status }, { new: true, session });
  },

  createFine: async (data: any, session?: any) => {
    const fine = new Fine(data);
    return await fine.save({ session });
  },

  getAllFines: async () => {
    return await Fine.find().populate('booking customer damage inspection').sort({ createdAt: -1 });
  },

  getFinesByCustomer: async (customerId: string) => {
    return await Fine.find({ customerId }).populate('booking damage inspection').sort({ createdAt: -1 });
  },

  updateFineStatus: async (id: string, status: string) => {
    return await Fine.findByIdAndUpdate(id, { status }, { new: true });
  },

  createRepairHistory: async (data: any, session?: any) => {
    const repair = new RepairHistory(data);
    return await repair.save({ session });
  }
};
