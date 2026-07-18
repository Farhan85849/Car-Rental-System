import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  category: { type: String, required: true },
  dailyPrice: { type: Number, required: true },
  weeklyPrice: { type: Number, required: true },
  monthlyPrice: { type: Number, required: true },
  securityDeposit: { type: Number, default: 0 },
  transmission: { type: String, required: true },
  fuelType: { type: String, required: true },
  seats: { type: Number, required: true },
  doors: { type: Number, required: true },
  mileage: { type: Number, required: true },
  color: { type: String, required: true },
  fuelAverage: { type: String },
  registrationNumber: { type: String, unique: true, sparse: true },
  location: { type: String, required: true },
  status: { type: String, default: 'AVAILABLE' },
  description: { type: String, required: true },
  images: { type: String, required: true },
  features: { type: String, required: true },
}, { timestamps: true });

vehicleSchema.index({ status: 1, category: 1 });
vehicleSchema.index({ brand: 1, model: 1 });
vehicleSchema.index({ dailyPrice: 1 });
vehicleSchema.index({ location: 1 });

vehicleSchema.virtual('id').get(function() { return this._id.toHexString(); });
vehicleSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { delete ret._id; delete ret.__v; } });

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);
