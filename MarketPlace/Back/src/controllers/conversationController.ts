import { Request, Response } from 'express';
import Conversation from '../models/Conversation';
import Message from '../models/Message';
import Listing from '../models/Listing';

// @desc    Créer ou récupérer une conversation
// @route   POST /api/conversations
// @access  Private
export const createConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listingId, sellerId } = req.body;

    // Vérifier que l'annonce existe
    const listing = await Listing.findById(listingId);
    if (!listing) {
      res.status(404).json({
        success: false,
        message: 'Annonce non trouvée',
      });
      return;
    }

    // Ne pas permettre de se contacter soi-même
    if (listing.owner.toString() === req.user!._id.toString()) {
      res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas vous contacter vous-même',
      });
      return;
    }

    // Vérifier si une conversation existe déjà
    let conversation = await Conversation.findOne({
      listing: listingId,
      participants: { $all: [req.user!._id, sellerId] },
    }).populate('participants', 'name avatar isOnline')
      .populate('listing', 'title images price');

    if (conversation) {
      res.status(200).json({
        success: true,
        data: conversation,
      });
      return;
    }

    // Créer une nouvelle conversation
    conversation = await Conversation.create({
      participants: [req.user!._id, sellerId],
      listing: listingId,
    });

    // Populer les données
    conversation = await Conversation.findById(conversation._id)
      .populate('participants', 'name avatar isOnline')
      .populate('listing', 'title images price');

    res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la création de la conversation',
    });
  }
};

// @desc    Obtenir mes conversations
// @route   GET /api/conversations
// @access  Private
export const getMyConversations = async (req: Request, res: Response): Promise<void> => {
  try {
    const conversations = await Conversation.find({
      participants: req.user!._id,
    })
      .populate('participants', 'name avatar isOnline')
      .populate('listing', 'title images price status')
      .sort('-updatedAt');

    // Compter les messages non lus pour chaque conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversation: conv._id,
          sender: { $ne: req.user!._id },
          read: false,
        });
        return {
          ...conv.toObject(),
          unreadCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: conversationsWithUnread,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération des conversations',
    });
  }
};

// @desc    Obtenir une conversation par ID
// @route   GET /api/conversations/:id
// @access  Private
export const getConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('participants', 'name avatar isOnline lastSeen')
      .populate('listing', 'title images price status owner');

    if (!conversation) {
      res.status(404).json({
        success: false,
        message: 'Conversation non trouvée',
      });
      return;
    }

    // Vérifier que l'utilisateur fait partie de la conversation
    const isParticipant = conversation.participants.some(
      (p: any) => p._id.toString() === req.user!._id.toString()
    );

    if (!isParticipant) {
      res.status(403).json({
        success: false,
        message: 'Accès non autorisé à cette conversation',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération de la conversation',
    });
  }
};

// @desc    Obtenir les messages d'une conversation
// @route   GET /api/conversations/:id/messages
// @access  Private
export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      res.status(404).json({
        success: false,
        message: 'Conversation non trouvée',
      });
      return;
    }

    // Vérifier que l'utilisateur fait partie de la conversation
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user!._id.toString()
    );

    if (!isParticipant) {
      res.status(403).json({
        success: false,
        message: 'Accès non autorisé à cette conversation',
      });
      return;
    }

    const [messages, total] = await Promise.all([
      Message.find({ conversation: req.params.id })
        .populate('sender', 'name avatar')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Message.countDocuments({ conversation: req.params.id }),
    ]);

    // Marquer les messages comme lus
    await Message.updateMany(
      {
        conversation: req.params.id,
        sender: { $ne: req.user!._id },
        read: false,
      },
      {
        read: true,
        readAt: new Date(),
      }
    );

    res.status(200).json({
      success: true,
      data: messages.reverse(), // Inverser pour avoir les plus anciens en premier
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération des messages',
    });
  }
};

// @desc    Envoyer un message
// @route   POST /api/conversations/:id/messages
// @access  Private
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content } = req.body;

    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      res.status(404).json({
        success: false,
        message: 'Conversation non trouvée',
      });
      return;
    }

    // Vérifier que l'utilisateur fait partie de la conversation
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user!._id.toString()
    );

    if (!isParticipant) {
      res.status(403).json({
        success: false,
        message: 'Accès non autorisé à cette conversation',
      });
      return;
    }

    // Créer le message
    const message = await Message.create({
      conversation: req.params.id,
      sender: req.user!._id,
      content,
    });

    // Mettre à jour le dernier message de la conversation
    conversation.lastMessage = {
      content,
      sender: req.user!._id,
      createdAt: new Date(),
    };
    await conversation.save();

    // Populer les données du message
    await message.populate('sender', 'name avatar');

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de l\'envoi du message',
    });
  }
};

// @desc    Compter les messages non lus
// @route   GET /api/conversations/unread/count
// @access  Private
export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
  try {
    // Trouver toutes les conversations de l'utilisateur
    const conversations = await Conversation.find({
      participants: req.user!._id,
    });

    const conversationIds = conversations.map((c) => c._id);

    // Compter les messages non lus
    const unreadCount = await Message.countDocuments({
      conversation: { $in: conversationIds },
      sender: { $ne: req.user!._id },
      read: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors du comptage des messages non lus',
    });
  }
};
