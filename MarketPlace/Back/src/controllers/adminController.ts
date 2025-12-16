import { Request, Response } from 'express';
import User from '../models/User';
import Listing from '../models/Listing';
import Conversation from '../models/Conversation';
import Message from '../models/Message';

// @desc    Obtenir les statistiques du dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      totalListings,
      activeListings,
      totalConversations,
      totalMessages,
      recentUsers,
      recentListings,
    ] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Listing.countDocuments({ status: 'active' }),
      Conversation.countDocuments(),
      Message.countDocuments(),
      User.find().sort('-createdAt').limit(5).select('name email createdAt'),
      Listing.find().sort('-createdAt').limit(5).populate('owner', 'name'),
    ]);

    // Stats par catégorie
    const listingsByCategory = await Listing.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalListings,
          activeListings,
          totalConversations,
          totalMessages,
        },
        listingsByCategory,
        recentUsers,
        recentListings,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération des statistiques',
    });
  }
};

// @desc    Obtenir tous les utilisateurs
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: users,
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
      message: error.message || 'Erreur lors de la récupération des utilisateurs',
    });
  }
};

// @desc    Obtenir toutes les annonces (admin)
// @route   GET /api/admin/listings
// @access  Private/Admin
export const getAllListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, status, category, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate('owner', 'name email')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Listing.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: listings,
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
      message: error.message || 'Erreur lors de la récupération des annonces',
    });
  }
};

// @desc    Mettre à jour le statut d'une annonce
// @route   PUT /api/admin/listings/:id/status
// @access  Private/Admin
export const updateListingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('owner', 'name email');

    if (!listing) {
      res.status(404).json({
        success: false,
        message: 'Annonce non trouvée',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour du statut',
    });
  }
};

// @desc    Supprimer une annonce (admin)
// @route   DELETE /api/admin/listings/:id
// @access  Private/Admin
export const deleteListingAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);

    if (!listing) {
      res.status(404).json({
        success: false,
        message: 'Annonce non trouvée',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Annonce supprimée avec succès',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la suppression de l\'annonce',
    });
  }
};

// @desc    Mettre à jour le rôle d'un utilisateur
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour du rôle',
    });
  }
};
