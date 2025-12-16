import { Request, Response } from 'express';
import Service from '../models/Service';
import Favorite from '../models/Favorite';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';

// @desc    Créer un service
// @route   POST /api/services
// @access  Private
export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, price, priceType, category, subcategory, city, postalCode, tags, deliveryTime } = req.body;

    // Upload des images si présentes
    let images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      const uploadPromises = req.files.map((file: Express.Multer.File) =>
        uploadToCloudinary(file.buffer, 'service/services')
      );
      const results = await Promise.all(uploadPromises);
      images = results.map((r) => r.url);
    }

    const service = await Service.create({
      owner: req.user!._id,
      title,
      description,
      price,
      priceType: priceType || 'fixed',
      category,
      subcategory,
      city,
      postalCode,
      images,
      tags: tags ? JSON.parse(tags) : [],
      deliveryTime,
    });

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la création du service',
    });
  }
};

// @desc    Obtenir tous les services avec filtres
// @route   GET /api/services
// @access  Public
export const getServices = async (req: Request, res: Response): Promise<void> => {
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
      priceType,
    } = req.query;

    // Construire le filtre
    const filter: any = { status: 'active' };

    if (category) filter.category = category;
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (priceType) filter.priceType = priceType;

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
    const [services, total] = await Promise.all([
      Service.find(filter)
        .populate('owner', 'name city avatar rating reviewCount verified')
        .sort(sort as string)
        .skip(skip)
        .limit(Number(limit)),
      Service.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: services,
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
      message: error.message || 'Erreur lors de la récupération des services',
    });
  }
};

// @desc    Obtenir un service par ID
// @route   GET /api/services/:id
// @access  Public
export const getService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id).populate('owner', 'name city avatar phone rating reviewCount verified bio skills hourlyRate completedTasks createdAt');

    if (!service) {
      res.status(404).json({
        success: false,
        message: 'Service non trouvé',
      });
      return;
    }

    // Incrémenter les vues
    service.views += 1;
    await service.save();

    // Vérifier si le service est en favori pour l'utilisateur connecté
    let isFavorite = false;
    if (req.user) {
      const favorite = await Favorite.findOne({
        user: req.user._id,
        listing: service._id,
      });
      isFavorite = !!favorite;
    }

    res.status(200).json({
      success: true,
      data: {
        ...service.toObject(),
        isFavorite,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération du service',
    });
  }
};

// @desc    Mettre à jour un service
// @route   PUT /api/services/:id
// @access  Private (owner only)
export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404).json({
        success: false,
        message: 'Service non trouvé',
      });
      return;
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (service.owner.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier ce service',
      });
      return;
    }

    const { title, description, price, priceType, category, subcategory, city, postalCode, tags, status, deliveryTime } = req.body;

    // Upload des nouvelles images si présentes
    let images = service.images;
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadPromises = req.files.map((file: Express.Multer.File) =>
        uploadToCloudinary(file.buffer, 'service/services')
      );
      const results = await Promise.all(uploadPromises);
      images = [...images, ...results.map((r) => r.url)];
    }

    service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        price,
        priceType,
        category,
        subcategory,
        city,
        postalCode,
        images,
        tags: tags ? JSON.parse(tags) : service.tags,
        status,
        deliveryTime,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour du service',
    });
  }
};

// @desc    Supprimer un service
// @route   DELETE /api/services/:id
// @access  Private (owner only)
export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404).json({
        success: false,
        message: 'Service non trouvé',
      });
      return;
    }

    // Vérifier que l'utilisateur est le propriétaire ou admin
    if (service.owner.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer ce service',
      });
      return;
    }

    await service.deleteOne();

    // Supprimer les favoris associés
    await Favorite.deleteMany({ listing: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Service supprimé avec succès',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la suppression du service',
    });
  }
};

// @desc    Obtenir les services d'un utilisateur
// @route   GET /api/services/user/:userId
// @access  Public
export const getUserServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = { owner: req.params.userId };

    // Si ce n'est pas le propriétaire, ne montrer que les services actifs
    if (!req.user || req.user._id.toString() !== req.params.userId) {
      filter.status = 'active';
    }

    const [services, total] = await Promise.all([
      Service.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Service.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: services,
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
      message: error.message || 'Erreur lors de la récupération des services',
    });
  }
};

// @desc    Obtenir mes services
// @route   GET /api/services/my
// @access  Private
export const getMyServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = { owner: req.user!._id };
    if (status) filter.status = status;

    const [services, total] = await Promise.all([
      Service.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Service.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: services,
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
      message: error.message || 'Erreur lors de la récupération de vos services',
    });
  }
};
