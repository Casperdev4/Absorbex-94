import { Request, Response } from 'express';
import Favorite from '../models/Favorite';
import Listing from '../models/Listing';
import Service from '../models/Service';

// @desc    Ajouter une annonce/service aux favoris
// @route   POST /api/favorites/:id
// @access  Private
export const addFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { type = 'service' } = req.body; // 'listing' ou 'service'

    let item = null;
    let favoriteData: any = { user: req.user!._id };

    if (type === 'listing') {
      item = await Listing.findById(id);
      if (!item) {
        res.status(404).json({
          success: false,
          message: 'Annonce non trouvée',
        });
        return;
      }
      favoriteData.listing = id;

      // Vérifier si déjà en favori
      const existingFavorite = await Favorite.findOne({
        user: req.user!._id,
        listing: id,
      });
      if (existingFavorite) {
        res.status(400).json({
          success: false,
          message: 'Cette annonce est déjà dans vos favoris',
        });
        return;
      }
    } else {
      item = await Service.findById(id);
      if (!item) {
        res.status(404).json({
          success: false,
          message: 'Service non trouvé',
        });
        return;
      }
      favoriteData.service = id;

      // Vérifier si déjà en favori
      const existingFavorite = await Favorite.findOne({
        user: req.user!._id,
        service: id,
      });
      if (existingFavorite) {
        res.status(400).json({
          success: false,
          message: 'Ce service est déjà dans vos favoris',
        });
        return;
      }
    }

    const favorite = await Favorite.create(favoriteData);

    res.status(201).json({
      success: true,
      data: favorite,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de l\'ajout aux favoris',
    });
  }
};

// @desc    Retirer une annonce/service des favoris
// @route   DELETE /api/favorites/:id
// @access  Private
export const removeFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { type = 'service' } = req.query; // 'listing' ou 'service'

    let favorite;

    if (type === 'listing') {
      favorite = await Favorite.findOneAndDelete({
        user: req.user!._id,
        listing: id,
      });
    } else {
      favorite = await Favorite.findOneAndDelete({
        user: req.user!._id,
        service: id,
      });
    }

    if (!favorite) {
      res.status(404).json({
        success: false,
        message: 'Favori non trouvé',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Retiré des favoris',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la suppression du favori',
    });
  }
};

// @desc    Obtenir mes favoris
// @route   GET /api/favorites
// @access  Private
export const getMyFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let filter: any = { user: req.user!._id };

    // Filtrer par type si spécifié
    if (type === 'listing') {
      filter.listing = { $exists: true, $ne: null };
    } else if (type === 'service') {
      filter.service = { $exists: true, $ne: null };
    }

    const [favorites, total] = await Promise.all([
      Favorite.find(filter)
        .populate({
          path: 'listing',
          populate: {
            path: 'owner',
            select: 'name city avatar',
          },
        })
        .populate({
          path: 'service',
          populate: {
            path: 'owner',
            select: 'name city avatar rating reviewCount',
          },
        })
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Favorite.countDocuments(filter),
    ]);

    // Filtrer les éléments supprimés
    const validFavorites = favorites.filter((f) => f.listing || f.service);

    res.status(200).json({
      success: true,
      data: validFavorites,
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
      message: error.message || 'Erreur lors de la récupération des favoris',
    });
  }
};

// @desc    Vérifier si un élément est en favori
// @route   GET /api/favorites/check/:id
// @access  Private
export const checkFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { type = 'service' } = req.query; // 'listing' ou 'service'

    let favorite;

    if (type === 'listing') {
      favorite = await Favorite.findOne({
        user: req.user!._id,
        listing: id,
      });
    } else {
      favorite = await Favorite.findOne({
        user: req.user!._id,
        service: id,
      });
    }

    res.status(200).json({
      success: true,
      isFavorite: !!favorite,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la vérification du favori',
    });
  }
};
