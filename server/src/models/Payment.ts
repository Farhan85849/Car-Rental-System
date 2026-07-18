import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  status: { type: String, default: 'PENDING' },
  transactionId: { type: String },
}, { timestamps: true });

paymentSchema.virtual('id').get(function() { return this._id.toHexString(); });
paymentSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { delete ret._id; delete ret.__v; } });

export const Payment = mongoose.model('Payment', paymentSchema);
