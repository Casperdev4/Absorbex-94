import mongoose, { Document, Schema } from 'mongoose';

export interface IFavorite extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  listing?: mongoose.Types.ObjectId;
  service?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Utilisateur requis'],
    },
    listing: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
    },
  },
  {
    timestamps: true,
  }
);

// Validation: au moins un des deux (listing ou service) doit être présent
favoriteSchema.pre('validate', function () {
  if (!this.listing && !this.service) {
    throw new Error('Un listing ou un service doit être spécifié');
  }
});

// Index unique pour éviter les doublons
favoriteSchema.index({ user: 1, listing: 1 }, { unique: true, sparse: true });
favoriteSchema.index({ user: 1, service: 1 }, { unique: true, sparse: true });

export default mongoose.model<IFavorite>('Favorite', favoriteSchema);
