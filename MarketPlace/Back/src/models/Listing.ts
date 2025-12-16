import mongoose, { Document, Schema } from 'mongoose';

export interface IListing extends Document {
  _id: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  city: string;
  postalCode?: string;
  images: string[];
  tags: string[];
  status: 'active' | 'inactive' | 'sold' | 'pending';
  views: number;
  condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  deliveryOption: 'pickup' | 'shipping' | 'both';
  createdAt: Date;
  updatedAt: Date;
}

const listingSchema = new Schema<IListing>(
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
    category: {
      type: String,
      required: [true, 'Catégorie requise'],
      enum: [
        'vehicules',
        'immobilier',
        'multimedia',
        'maison',
        'loisirs',
        'emploi',
        'services',
        'vetements',
        'autres',
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
      enum: ['active', 'inactive', 'sold', 'pending'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
    condition: {
      type: String,
      enum: ['new', 'like_new', 'good', 'fair', 'poor'],
    },
    deliveryOption: {
      type: String,
      enum: ['pickup', 'shipping', 'both'],
      default: 'pickup',
    },
  },
  {
    timestamps: true,
  }
);

// Index pour la recherche
listingSchema.index({ title: 'text', description: 'text', tags: 'text' });
listingSchema.index({ category: 1, city: 1, price: 1 });
listingSchema.index({ owner: 1 });
listingSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<IListing>('Listing', listingSchema);
