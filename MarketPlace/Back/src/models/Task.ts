import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  worker?: mongoose.Types.ObjectId;
  service?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  budget: number;
  budgetType: 'fixed' | 'hourly';
  city: string;
  address?: string;
  scheduledDate?: Date;
  scheduledTime?: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Client requis'],
    },
    worker: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
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
      maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères'],
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
    budget: {
      type: Number,
      required: [true, 'Budget requis'],
      min: [0, 'Le budget doit être positif'],
    },
    budgetType: {
      type: String,
      enum: ['fixed', 'hourly'],
      default: 'fixed',
    },
    city: {
      type: String,
      required: [true, 'Ville requise'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    scheduledDate: {
      type: Date,
    },
    scheduledTime: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index
taskSchema.index({ client: 1 });
taskSchema.index({ worker: 1 });
taskSchema.index({ status: 1, createdAt: -1 });
taskSchema.index({ category: 1, city: 1 });

export default mongoose.model<ITask>('Task', taskSchema);
