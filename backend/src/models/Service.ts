import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  name: string;
  slug: string;
  description: string;
  categoryId: mongoose.Types.ObjectId;
  basePrice: number;
  discountPercentage: number;
  durationMinutes: number;
  images: string[];
  thumbnail?: string;
  whatIncluded: string[];
  whatExcluded: string[];
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  totalBookings: number;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 15,
    },
    images: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
    },
    whatIncluded: {
      type: [String],
      default: [],
    },
    whatExcluded: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.index({ slug: 1 });
serviceSchema.index({ categoryId: 1 });
serviceSchema.index({ isActive: 1, isFeatured: 1 });
serviceSchema.index({ rating: -1 });

export default mongoose.model<IService>('Service', serviceSchema);
