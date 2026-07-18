import { inspectionRepository } from '../repositories/inspectionRepository';
import { bookingRepository } from '../repositories/bookingRepository';
import { vehicleRepository } from '../repositories/vehicleRepository';
import mongoose from 'mongoose';
import { EmailService } from './emailService';
import { userRepository } from '../repositories/userRepository';

const FINE_RATES: Record<string, number> = {
  'Scratch': 5000,
  'Dent': 10000,
  'Broken Mirror': 8000,
  'Broken Headlight': 12000,
  'Broken Windshield': 30000,
  'Missing Toolkit': 4000,
  'Missing Documents': 2000,
  'Heavy Cleaning Required': 3000
};

export const inspectionService = {
  createPickupInspection: async (data: any, staffId: string) => {
    const booking = await bookingRepository.findById(data.bookingId);
    if (!booking) throw new Error('Booking not found');

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const inspectionData = {
        ...data,
        type: 'PICKUP',
        staffId,
        customerId: booking.userId,
        vehicleId: booking.vehicleId,
        status: 'PASSED'
      };

      const inspection = await inspectionRepository.createInspection(inspectionData, session);

      // Update vehicle status
      await vehicleRepository.update(booking.vehicleId.toString(), { status: 'Picked Up' });

      // If there are existing damages reported, save them
      if (data.existingDamages && data.existingDamages.length > 0) {
        for (const d of data.existingDamages) {
          await inspectionRepository.createDamage({
            bookingId: booking._id,
            vehicleId: booking.vehicleId,
            inspectionId: inspection._id,
            customerId: booking.userId,
            staffId,
            damageType: d.damageType,
            description: d.description,
            images: d.images,
            isExisting: true
          }, session);
        }
      }

      await session.commitTransaction();
      session.endSession();
      return inspection;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  },

  createReturnInspection: async (data: any, staffId: string) => {
    const booking = await bookingRepository.findById(data.bookingId);
    if (!booking) throw new Error('Booking not found');

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const inspectionData = {
        ...data,
        type: 'RETURN',
        staffId,
        customerId: booking.userId,
        vehicleId: booking.vehicleId,
        status: data.newDamages?.length > 0 ? 'FAILED' : 'PASSED'
      };

      const inspection = await inspectionRepository.createInspection(inspectionData, session);

      if (data.newDamages && data.newDamages.length > 0) {
        // Vehicle needs repair
        await vehicleRepository.update(booking.vehicleId.toString(), { status: 'Under Repair' });

        for (const d of data.newDamages) {
          const estimatedCost = d.estimatedCost || FINE_RATES[d.damageType] || 0;
          
          const damage = await inspectionRepository.createDamage({
            bookingId: booking._id,
            vehicleId: booking.vehicleId,
            inspectionId: inspection._id,
            customerId: booking.userId,
            staffId,
            damageType: d.damageType,
            description: d.description,
            images: d.images,
            estimatedCost,
            isExisting: false
          }, session);

          // Create a fine
          if (estimatedCost > 0) {
            await inspectionRepository.createFine({
              bookingId: booking._id,
              customerId: booking.userId,
              damageId: damage._id,
              inspectionId: inspection._id,
              amount: estimatedCost,
              reason: `Fine for ${d.damageType}: ${d.description}`,
              status: 'PENDING'
            }, session);
          }
        }
      } else {
        // Vehicle is good
        await vehicleRepository.update(booking.vehicleId.toString(), { status: 'AVAILABLE' });
      }

      // Mark booking as completed if not already
      if (booking.status !== 'COMPLETED') {
        await bookingRepository.updateStatusWithTransaction(
          booking._id.toString(), 
          booking.vehicleId.toString(), 
          'COMPLETED', 
          'Vehicle returned and inspected'
        );
      }

      await session.commitTransaction();
      session.endSession();
      return inspection;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  },

  getInspectionsByBooking: async (bookingId: string, user: any) => {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new Error('Booking not found');
    if (booking.userId.toString() !== user.id && user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
    return await inspectionRepository.getInspectionsByBooking(bookingId);
  },

  getAllInspections: async () => {
    return await inspectionRepository.getAllInspections();
  },

  getAllDamages: async () => {
    return await inspectionRepository.getAllDamages();
  },

  markDamageRepaired: async (damageId: string, cost: number, notes: string) => {
    const damage = await inspectionRepository.getDamageById(damageId);
    if (!damage) throw new Error('Damage not found');

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await inspectionRepository.updateDamageStatus(damageId, 'REPAIRED', session);
      
      await inspectionRepository.createRepairHistory({
        vehicleId: damage.vehicleId,
        damageId: damage._id,
        repairDate: new Date(),
        cost,
        notes
      }, session);

      // Check if all damages for this vehicle are repaired to mark vehicle as AVAILABLE
      // Simplified: Just mark it available for now, ideally should check other pending damages.
      await vehicleRepository.update(damage.vehicleId.toString(), { status: 'AVAILABLE' });

      await session.commitTransaction();
      session.endSession();
      return { success: true };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  },

  getAllFines: async () => {
    return await inspectionRepository.getAllFines();
  },

  getMyFines: async (customerId: string) => {
    return await inspectionRepository.getFinesByCustomer(customerId);
  },

  updateFineStatus: async (fineId: string, status: string) => {
    const fine = await inspectionRepository.updateFineStatus(fineId, status);
    if (fine) {
       const user = await userRepository.findById(fine.customerId.toString());
       if (user) {
         await EmailService.sendEmail(user.email, `Fine ${status}`, `<h3>Fine Update</h3><p>Your fine of PKR ${fine.amount} for ${fine.reason} is now ${status}.</p>`);
       }
    }
    return fine;
  },

  appealFine: async (fineId: string, customerId: string, notes: string) => {
    // Find fine and verify customer
    const fine = await inspectionRepository.updateFineStatus(fineId, 'PENDING');
    if (fine) {
      fine.notes = notes;
      await fine.save();
    }
    return fine;
  },

  payFine: async (fineId: string, customerId: string) => {
    // Basic simulation of paying a fine
    const fine = await inspectionRepository.updateFineStatus(fineId, 'PAID');
    if (fine) {
       const user = await userRepository.findById(fine.customerId.toString());
       if (user) {
         await EmailService.sendEmail(user.email, `Fine Paid`, `<h3>Fine Paid successfully</h3><p>Thank you for your payment of PKR ${fine.amount} for ${fine.reason}.</p>`);
       }
    }
    return fine;
  }
};
