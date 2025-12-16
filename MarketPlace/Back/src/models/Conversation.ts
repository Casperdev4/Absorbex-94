import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  _id: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  listing?: mongoose.Types.ObjectId;
  service?: mongoose.Types.ObjectId;
  lastMessage?: {
    content: string;
    sender: mongoose.Types.ObjectId;
    createdAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    listing: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
    },
    lastMessage: {
      content: String,
      sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      createdAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Validation: au moins un des deux (listing ou service) doit être présent
conversationSchema.pre('validate', function () {
  if (!this.listing && !this.service) {
    throw new Error('Un listing ou un service doit être spécifié');
  }
});

// Index pour récupérer rapidement les conversations d'un utilisateur
conversationSchema.index({ participants: 1 });
conversationSchema.index({ listing: 1 });
conversationSchema.index({ service: 1 });
conversationSchema.index({ updatedAt: -1 });

export default mongoose.model<IConversation>('Conversation', conversationSchema);
