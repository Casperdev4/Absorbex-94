import { Request, Response } from 'express';
import Listing from '../models/Listing';
import Favorite from '../models/Favorite';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';

// @desc    Créer une annonce
// @route   POST /api/listings
// @access  Private
export const createListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, price, category, subcategory, city, postalCode, tags, condition, deliveryOption } = req.body;

    // Upload des images si présentes
    let images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      const uploadPromises = req.files.map((file: Express.Multer.File) =>
        uploadToCloudinary(file.buffer, 'leboncoin/listings')
      );
      const results = await Promise.all(uploadPromises);
      images = results.map((r) => r.url);
    }

    const listing = await Listing.create({
      owner: req.user!._id,
      title,
      description,
      price,
      category,
      subcategory,
      city,
      postalCode,
      images,
      tags: tags ? JSON.parse(tags) : [],
      condition,
      deliveryOption,
    });

    res.status(201).json({
      success: true,
      data: listing,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la création de l\'annonce',
    });
  }
};

// @desc    Obtenir toutes les annonces avec filtres
// @route   GET /api/listings
// @access  Public
export const getListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      city,
      minPrice,
      maxPrice,
      search,
      sort = '-createdAt',
      condition,
    } = req.query;

    // Construire le filtre
    const filter: any = { status: 'active' };

    if (category) filter.category = category;
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (condition) filter.condition = condition;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search as string };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Exécuter la requête
    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate('owner', 'name city avatar')
        .sort(sort as string)
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

// @desc    Obtenir une annonce par ID
// @route   GET /api/listings/:id
// @access  Public
export const getListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner', 'name city avatar phone createdAt');

    if (!listing) {
      res.status(404).json({
        success: false,
        message: 'Annonce non trouvée',
      });
      return;
    }

    // Incrémenter les vues
    listing.views += 1;
    await listing.save();

    // Vérifier si l'annonce est en favori pour l'utilisateur connecté
    let isFavorite = false;
    if (req.user) {
      const favorite = await Favorite.findOne({
        user: req.user._id,
        listing: listing._id,
      });
      isFavorite = !!favorite;
    }

    res.status(200).json({
      success: true,
      data: {
        ...listing.toObject(),
        isFavorite,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération de l\'annonce',
    });
  }
};

// @desc    Mettre à jour une annonce
// @route   PUT /api/listings/:id
// @access  Private (owner only)
export const updateListing = async (req: Request, res: Response): Promise<void> => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      res.status(404).json({
        success: false,
        message: 'Annonce non trouvée',
      });
      return;
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (listing.owner.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cette annonce',
      });
      return;
    }

    const { title, description, price, category, subcategory, city, postalCode, tags, status, condition, deliveryOption } = req.body;

    // Upload des nouvelles images si présentes
    let images = listing.images;
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadPromises = req.files.map((file: Express.Multer.File) =>
        uploadToCloudinary(file.buffer, 'leboncoin/listings')
      );
      const results = await Promise.all(uploadPromises);
      images = [...images, ...results.map((r) => r.url)];
    }

    listing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        price,
        category,
        subcategory,
        city,
        postalCode,
        images,
        tags: tags ? JSON.parse(tags) : listing.tags,
        status,
        condition,
        deliveryOption,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour de l\'annonce',
    });
  }
};

// @desc    Supprimer une annonce
// @route   DELETE /api/listings/:id
// @access  Private (owner only)
export const deleteListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      res.status(404).json({
        success: false,
        message: 'Annonce non trouvée',
      });
      return;
    }

    // Vérifier que l'utilisateur est le propriétaire ou admin
    if (listing.owner.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer cette annonce',
      });
      return;
    }

    await listing.deleteOne();

    // Supprimer les favoris associés
    await Favorite.deleteMany({ listing: req.params.id });

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

// @desc    Obtenir les annonces d'un utilisateur
// @route   GET /api/listings/user/:userId
// @access  Public
export const getUserListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = { owner: req.params.userId };

    // Si ce n'est pas le propriétaire, ne montrer que les annonces actives
    if (!req.user || req.user._id.toString() !== req.params.userId) {
      filter.status = 'active';
    }

    const [listings, total] = await Promise.all([
      Listing.find(filter)
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

// @desc    Obtenir mes annonces
// @route   GET /api/listings/my
// @access  Private
export const getMyListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = { owner: req.user!._id };
    if (status) filter.status = status;

    const [listings, total] = await Promise.all([
      Listing.find(filter)
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
      message: error.message || 'Erreur lors de la récupération de vos annonces',
    });
  }
};
