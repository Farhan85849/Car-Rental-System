import mongoose from 'mongoose';

const repairHistorySchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  damageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Damage' },
  repairDate: { type: Date, required: true },
  cost: { type: Number, required: true },
  notes: { type: String },
  status: { type: String, enum: ['COMPLETED'], default: 'COMPLETED' }
}, { timestamps: true });

repairHistorySchema.virtual('id').get(function() { return this._id.toHexString(); });
repairHistorySchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { delete ret._id; delete ret.__v; } });

export const RepairHistory = mongoose.model('RepairHistory', repairHistorySchema);
