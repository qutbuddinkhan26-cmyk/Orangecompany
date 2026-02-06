import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId;
  rating: number;
  review: string;
  images: string[];
  response?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    response: {
      type: String,
    },
    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ userId: 1 });
reviewSchema.index({ serviceId: 1 });
reviewSchema.index({ bookingId: 1 });

export default mongoose.model<IReview>('Review', reviewSchema);
