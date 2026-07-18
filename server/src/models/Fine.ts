import mongoose from 'mongoose';

const fineSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  damageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Damage' },
  inspectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inspection' },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'PAID'], default: 'PENDING' },
  notes: { type: String }
}, { timestamps: true });

fineSchema.virtual('id').get(function() { return this._id.toHexString(); });
fineSchema.virtual('booking', { ref: 'Booking', localField: 'bookingId', foreignField: '_id', justOne: true });
fineSchema.virtual('damage', { ref: 'Damage', localField: 'damageId', foreignField: '_id', justOne: true });

fineSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { delete ret._id; delete ret.__v; } });

export const Fine = mongoose.model('Fine', fineSchema);
