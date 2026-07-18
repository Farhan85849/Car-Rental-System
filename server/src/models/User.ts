import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  cnic: { type: String },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String },
  loyaltyPoints: { type: Number, default: 0 },
  membershipTier: { type: String, default: 'Silver' }, // Silver, Gold, Platinum
  role: { type: String, default: 'CUSTOMER' }, // CUSTOMER, ADMIN
  avatar: { type: String },
}, { timestamps: true });

// Virtual to duplicate _id as id for frontend compatibility
userSchema.virtual('id').get(function() { return this._id.toHexString(); });
userSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { delete ret._id; delete ret.__v; } });

export const User = mongoose.model('User', userSchema);
