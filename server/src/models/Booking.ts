import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingNumber: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  
  // New Rental Type fields
  rentalType: { type: String, enum: ['CITY', 'OUT_OF_CITY', 'AIRPORT', 'EVENT'], default: 'CITY' },
  tripType: { type: String, enum: ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'], default: 'DAILY' },
  driveType: { type: String, enum: ['SELF_DRIVE', 'CHAUFFEUR'], default: 'SELF_DRIVE' },
  
  // Trip details
  destinationCity: { type: String },
  returnCity: { type: String },
  estimatedDistance: { type: Number },
  
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  pickupLoc: { type: String, required: true },
  dropoffLoc: { type: String, required: true },
  rentalDuration: { type: Number, required: true }, // Can be hours or days depending on tripType
  
  // Pricing Details
  dailyRate: { type: Number, required: true },
  subTotal: { type: Number, required: true },
  
  // Extras
  driverOption: { type: Boolean, default: false }, // legacy, maybe keep for compatibility
  insurance: { type: Boolean, default: false }, // legacy
  gps: { type: Boolean, default: false },
  childSeat: { type: Boolean, default: false },
  wifi: { type: Boolean, default: false },
  
  // Detailed Charges
  driverCharges: { type: Number, default: 0 },
  driverAllowance: { type: Number, default: 0 },
  nightStayAllowance: { type: Number, default: 0 },
  tollCharges: { type: Number, default: 0 },
  fuelCharges: { type: Number, default: 0 },
  insurancePackage: { type: String }, // e.g. 'BASIC', 'PREMIUM'
  insuranceCharges: { type: Number, default: 0 },
  securityDeposit: { type: Number, default: 0 },
  lateReturnCharges: { type: Number, default: 0 },
  
  extrasTotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  coupon: { type: String },
  totalPrice: { type: Number, required: true },
  
  // Status
  status: { type: String, default: 'PENDING' },
  tripStatus: { type: String, default: 'UPCOMING' }, // UPCOMING, IN_PROGRESS, COMPLETED, CANCELLED
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
}, { timestamps: true });

bookingSchema.index({ userId: 1 });
bookingSchema.index({ vehicleId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ startDate: 1, endDate: 1 });

bookingSchema.virtual('id').get(function() { return this._id.toHexString(); });
bookingSchema.virtual('user', { ref: 'User', localField: 'userId', foreignField: '_id', justOne: true });
bookingSchema.virtual('vehicle', { ref: 'Vehicle', localField: 'vehicleId', foreignField: '_id', justOne: true });
bookingSchema.virtual('payment', { ref: 'Payment', localField: 'paymentId', foreignField: '_id', justOne: true });

bookingSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { delete ret._id; delete ret.__v; } });

export const Booking = mongoose.model('Booking', bookingSchema);
