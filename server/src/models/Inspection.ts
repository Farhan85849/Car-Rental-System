import mongoose from 'mongoose';

const inspectionSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['PICKUP', 'RETURN'], required: true },
  odometer: { type: Number, required: true },
  fuelLevel: { type: String, enum: ['Empty', '1/4', '1/2', '3/4', 'Full'], required: true },
  exteriorPhotos: [{ type: String }],
  interiorPhotos: [{ type: String }],
  tiresCondition: { type: String, default: 'Good' },
  lightsCondition: { type: String, default: 'Good' },
  windshieldCondition: { type: String, default: 'Good' },
  mirrorsCondition: { type: String, default: 'Good' },
  accessories: {
    spareTire: { type: Boolean, default: true },
    toolkit: { type: Boolean, default: true },
    documents: { type: Boolean, default: true }
  },
  engineWarningLights: { type: Boolean, default: false },
  cleanliness: { type: String, default: 'Clean' },
  notes: { type: String },
  customerConfirmed: { type: Boolean, default: false },
  staffConfirmed: { type: Boolean, default: false },
  status: { type: String, enum: ['PENDING', 'PASSED', 'FAILED'], default: 'PENDING' }
}, { timestamps: true });

inspectionSchema.virtual('id').get(function() { return this._id.toHexString(); });
inspectionSchema.virtual('booking', { ref: 'Booking', localField: 'bookingId', foreignField: '_id', justOne: true });
inspectionSchema.virtual('vehicle', { ref: 'Vehicle', localField: 'vehicleId', foreignField: '_id', justOne: true });
inspectionSchema.virtual('customer', { ref: 'User', localField: 'customerId', foreignField: '_id', justOne: true });
inspectionSchema.virtual('staff', { ref: 'User', localField: 'staffId', foreignField: '_id', justOne: true });

inspectionSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { delete ret._id; delete ret.__v; } });

export const Inspection = mongoose.model('Inspection', inspectionSchema);
