import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  _id: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  priceType: 'fixed' | 'hourly' | 'starting_from';
  category: string;
  subcategory?: string;
  city: string;
  postalCode?: string;
  images: string[];
  tags: string[];
  status: 'active' | 'inactive' | 'pending';
  views: number;
  rating: number;
  reviewCount: number;
  deliveryTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Propriétaire requis'],
    },
    title: {
      type: String,
      required: [true, 'Titre requis'],
      trim: true,
      maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères'],
    },
    description: {
      type: String,
      required: [true, 'Description requise'],
      maxlength: [5000, 'La description ne peut pas dépasser 5000 caractères'],
    },
    price: {
      type: Number,
      required: [true, 'Prix requis'],
      min: [0, 'Le prix ne peut pas être négatif'],
    },
    priceType: {
      type: String,
      enum: ['fixed', 'hourly', 'starting_from'],
      default: 'fixed',
    },
    category: {
      type: String,
      required: [true, 'Catégorie requise'],
      enum: [
        'cleaning',
        'renovation',
        'gardening',
        'handyman',
        'photography',
        'babysitting',
        'moving',
        'tutoring',
        'beauty',
        'tech',
        'events',
        'other',
      ],
    },
    subcategory: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Ville requise'],
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 10;
        },
        message: 'Maximum 10 images autorisées',
      },
    },
    tags: {
      type: [String],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 10;
        },
        message: 'Maximum 10 tags autorisés',
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    deliveryTime: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour la recherche
serviceSchema.index({ title: 'text', description: 'text', tags: 'text' });
serviceSchema.index({ category: 1, city: 1, price: 1 });
serviceSchema.index({ owner: 1 });
serviceSchema.index({ status: 1, createdAt: -1 });
serviceSchema.index({ rating: -1 });

export default mongoose.model<IService>('Service', serviceSchema);
