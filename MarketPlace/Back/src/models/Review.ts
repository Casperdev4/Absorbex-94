import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId;
  reviewed: mongoose.Types.ObjectId;
  service?: mongoose.Types.ObjectId;
  task?: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reviewer requis'],
    },
    reviewed: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Utilisateur évalué requis'],
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
    },
    rating: {
      type: Number,
      required: [true, 'Note requise'],
      min: [1, 'La note minimum est 1'],
      max: [5, 'La note maximum est 5'],
    },
    comment: {
      type: String,
      required: [true, 'Commentaire requis'],
      maxlength: [1000, 'Le commentaire ne peut pas dépasser 1000 caractères'],
    },
  },
  {
    timestamps: true,
  }
);

// Index pour éviter les doublons
reviewSchema.index({ reviewer: 1, reviewed: 1, service: 1 }, { unique: true, sparse: true });
reviewSchema.index({ reviewer: 1, reviewed: 1, task: 1 }, { unique: true, sparse: true });
reviewSchema.index({ reviewed: 1, createdAt: -1 });

export default mongoose.model<IReview>('Review', reviewSchema);
