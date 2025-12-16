import { Request, Response } from 'express';
import User from '../models/User';
import Service from '../models/Service';

// @desc    Obtenir tous les workers avec filtres
// @route   GET /api/workers
// @access  Public
export const getWorkers = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      city,
      minRate,
      maxRate,
      search,
      verified,
      sort = '-rating',
    } = req.query;

    // Construire le filtre
    const filter: any = { role: 'worker' };

    if (city) filter.city = { $regex: city, $options: 'i' };
    if (verified === 'true') filter.verified = true;

    if (minRate || maxRate) {
      filter.hourlyRate = {};
      if (minRate) filter.hourlyRate.$gte = Number(minRate);
      if (maxRate) filter.hourlyRate.$lte = Number(maxRate);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search as string, 'i')] } },
      ];
    }

    if (category) {
      filter.skills = { $in: [new RegExp(category as string, 'i')] };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Exécuter la requête
    const [workers, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort(sort as string)
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: workers,
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
      message: error.message || 'Erreur lors de la récupération des travailleurs',
    });
  }
};

// @desc    Obtenir un worker par ID
// @route   GET /api/workers/:id
// @access  Public
export const getWorker = async (req: Request, res: Response): Promise<void> => {
  try {
    const worker = await User.findById(req.params.id).select('-password');

    if (!worker) {
      res.status(404).json({
        success: false,
        message: 'Travailleur non trouvé',
      });
      return;
    }

    // Récupérer les services du worker
    const services = await Service.find({
      owner: worker._id,
      status: 'active'
    }).limit(10);

    res.status(200).json({
      success: true,
      data: {
        ...worker.toObject(),
        services,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération du travailleur',
    });
  }
};

// @desc    Obtenir les workers les mieux notés
// @route   GET /api/workers/top-rated
// @access  Public
export const getTopRatedWorkers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 10, category } = req.query;

    const filter: any = {
      role: 'worker',
      rating: { $gt: 0 },
    };

    if (category) {
      filter.skills = { $in: [new RegExp(category as string, 'i')] };
    }

    const workers = await User.find(filter)
      .select('-password')
      .sort('-rating -reviewCount')
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: workers,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération des meilleurs travailleurs',
    });
  }
};

// @desc    Devenir worker (upgrade son compte)
// @route   PUT /api/workers/become-worker
// @access  Private
export const becomeWorker = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bio, skills, hourlyRate } = req.body;

    if (!bio || !skills || skills.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Bio et compétences sont requis pour devenir travailleur',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      {
        role: 'worker',
        bio,
        skills: typeof skills === 'string' ? JSON.parse(skills) : skills,
        hourlyRate: hourlyRate || 0,
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user,
      message: 'Félicitations ! Vous êtes maintenant un travailleur',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour du compte',
    });
  }
};

// @desc    Mettre à jour le profil worker
// @route   PUT /api/workers/profile
// @access  Private (worker only)
export const updateWorkerProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user!.role !== 'worker') {
      res.status(403).json({
        success: false,
        message: 'Vous devez être un travailleur pour accéder à cette fonctionnalité',
      });
      return;
    }

    const { bio, skills, hourlyRate } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      {
        bio,
        skills: typeof skills === 'string' ? JSON.parse(skills) : skills,
        hourlyRate,
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour du profil',
    });
  }
};
