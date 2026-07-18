import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
}, { timestamps: true });

wishlistSchema.virtual('id').get(function() { return this._id.toHexString(); });
wishlistSchema.virtual('user', { ref: 'User', localField: 'userId', foreignField: '_id', justOne: true });
wishlistSchema.virtual('vehicle', { ref: 'Vehicle', localField: 'vehicleId', foreignField: '_id', justOne: true });

wishlistSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { delete ret._id; delete ret.__v; } });

export const Wishlist = mongoose.model('Wishlist', wishlistSchema);
