import mongoose from 'mongoose';

const damageSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  inspectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inspection', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  damageType: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  estimatedCost: { type: Number, default: 0 },
  isExisting: { type: Boolean, default: false }, // Existed before rental
  status: { type: String, enum: ['PENDING', 'REPAIRED'], default: 'PENDING' }
}, { timestamps: true });

damageSchema.virtual('id').get(function() { return this._id.toHexString(); });
damageSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { delete ret._id; delete ret.__v; } });

export const Damage = mongoose.model('Damage', damageSchema);
