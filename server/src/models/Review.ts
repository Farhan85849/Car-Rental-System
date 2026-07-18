import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

reviewSchema.virtual('id').get(function() { return this._id.toHexString(); });
reviewSchema.virtual('user', { ref: 'User', localField: 'userId', foreignField: '_id', justOne: true });
reviewSchema.virtual('vehicle', { ref: 'Vehicle', localField: 'vehicleId', foreignField: '_id', justOne: true });

reviewSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { delete ret._id; delete ret.__v; } });

export const Review = mongoose.model('Review', reviewSchema);
