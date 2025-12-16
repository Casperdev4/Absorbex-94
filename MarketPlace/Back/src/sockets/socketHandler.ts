import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Message from '../models/Message';
import Conversation from '../models/Conversation';

interface JwtPayload {
  id: string;
}

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

// Map pour stocker les utilisateurs connectés
const connectedUsers = new Map<string, string>();

export const initializeSocket = (io: Server): void => {
  // Middleware d'authentification
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;

    console.log(`Utilisateur connecté: ${userId}`);

    // Stocker l'utilisateur connecté
    connectedUsers.set(userId, socket.id);

    // Mettre à jour le statut en ligne
    await User.findByIdAndUpdate(userId, { isOnline: true });

    // Informer les autres utilisateurs
    socket.broadcast.emit('user:online', userId);

    // Rejoindre les rooms des conversations de l'utilisateur
    const conversations = await Conversation.find({ participants: userId });
    conversations.forEach((conv) => {
      socket.join(`conversation:${conv._id}`);
    });

    // Gestion de l'envoi de messages
    socket.on('message:send', async (data: {
      conversationId: string;
      content: string;
    }) => {
      try {
        const { conversationId, content } = data;

        // Vérifier que l'utilisateur fait partie de la conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(userId as any)) {
          socket.emit('error', { message: 'Non autorisé' });
          return;
        }

        // Créer le message
        const message = await Message.create({
          conversation: conversationId,
          sender: userId,
          content,
        });

        // Mettre à jour la conversation
        conversation.lastMessage = {
          content,
          sender: userId as any,
          createdAt: new Date(),
        };
        await conversation.save();

        // Populer le message
        await message.populate('sender', 'name avatar');

        // Envoyer le message à tous les participants de la conversation
        io.to(`conversation:${conversationId}`).emit('message:new', {
          message,
          conversationId,
        });

        // Notifier les autres participants
        conversation.participants.forEach((participantId) => {
          if (participantId.toString() !== userId) {
            const participantSocketId = connectedUsers.get(participantId.toString());
            if (participantSocketId) {
              io.to(participantSocketId).emit('notification:message', {
                conversationId,
                message,
              });
            }
          }
        });
      } catch (error) {
        console.error('Erreur envoi message:', error);
        socket.emit('error', { message: 'Erreur lors de l\'envoi du message' });
      }
    });

    // Marquer les messages comme lus
    socket.on('message:read', async (data: { conversationId: string }) => {
      try {
        const { conversationId } = data;

        await Message.updateMany(
          {
            conversation: conversationId,
            sender: { $ne: userId },
            read: false,
          },
          {
            read: true,
            readAt: new Date(),
          }
        );

        // Informer l'autre participant que les messages ont été lus
        socket.to(`conversation:${conversationId}`).emit('message:read', {
          conversationId,
          readBy: userId,
        });
      } catch (error) {
        console.error('Erreur lecture messages:', error);
      }
    });

    // Indicateur de frappe
    socket.on('typing:start', (data: { conversationId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit('typing:start', {
        conversationId: data.conversationId,
        userId,
      });
    });

    socket.on('typing:stop', (data: { conversationId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit('typing:stop', {
        conversationId: data.conversationId,
        userId,
      });
    });

    // Rejoindre une nouvelle conversation
    socket.on('conversation:join', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    // Déconnexion
    socket.on('disconnect', async () => {
      console.log(`Utilisateur déconnecté: ${userId}`);

      connectedUsers.delete(userId);

      // Mettre à jour le statut hors ligne et la dernière connexion
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
      });

      // Informer les autres utilisateurs
      socket.broadcast.emit('user:offline', userId);
    });
  });
};

// Fonction utilitaire pour vérifier si un utilisateur est en ligne
export const isUserOnline = (userId: string): boolean => {
  return connectedUsers.has(userId);
};

// Fonction pour obtenir le socket ID d'un utilisateur
export const getUserSocketId = (userId: string): string | undefined => {
  return connectedUsers.get(userId);
};
