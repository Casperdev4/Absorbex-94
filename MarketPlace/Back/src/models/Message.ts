import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId;
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'Conversation requise'],
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Expéditeur requis'],
    },
    content: {
      type: String,
      required: [true, 'Contenu du message requis'],
      maxlength: [2000, 'Le message ne peut pas dépasser 2000 caractères'],
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour récupérer les messages d'une conversation
messageSchema.index({ conversation: 1, createdAt: 1 });
messageSchema.index({ sender: 1 });

export default mongoose.model<IMessage>('Message', messageSchema);
