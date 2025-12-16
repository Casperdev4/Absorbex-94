import { Request, Response } from 'express';
import Review from '../models/Review';
import User from '../models/User';
import Task from '../models/Task';

// @desc    Créer un avis
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reviewedId, serviceId, taskId, rating, comment } = req.body;

    // Vérifier qu'on ne s'évalue pas soi-même
    if (reviewedId === req.user!._id.toString()) {
      res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas vous évaluer vous-même',
      });
      return;
    }

    // Vérifier que l'utilisateur évalué existe
    const reviewedUser = await User.findById(reviewedId);
    if (!reviewedUser) {
      res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
      return;
    }

    // Si c'est une évaluation liée à une tâche, vérifier qu'elle existe et est terminée
    if (taskId) {
      const task = await Task.findById(taskId);
      if (!task) {
        res.status(404).json({
          success: false,
          message: 'Mission non trouvée',
        });
        return;
      }
      if (task.status !== 'completed') {
        res.status(400).json({
          success: false,
          message: 'La mission doit être terminée pour laisser un avis',
        });
        return;
      }
      // Vérifier que l'utilisateur est impliqué dans la mission
      const isClient = task.client.toString() === req.user!._id.toString();
      const isWorker = task.worker?.toString() === req.user!._id.toString();
      if (!isClient && !isWorker) {
        res.status(403).json({
          success: false,
          message: 'Vous devez être impliqué dans la mission pour laisser un avis',
        });
        return;
      }
    }

    // Vérifier si un avis existe déjà
    const existingReview = await Review.findOne({
      reviewer: req.user!._id,
      reviewed: reviewedId,
      ...(serviceId && { service: serviceId }),
      ...(taskId && { task: taskId }),
    });

    if (existingReview) {
      res.status(400).json({
        success: false,
        message: 'Vous avez déjà laissé un avis',
      });
      return;
    }

    // Créer l'avis
    const review = await Review.create({
      reviewer: req.user!._id,
      reviewed: reviewedId,
      service: serviceId,
      task: taskId,
      rating,
      comment,
    });

    // Mettre à jour la note moyenne de l'utilisateur évalué
    const allReviews = await Review.find({ reviewed: reviewedId });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(reviewedId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length,
    });

    // Populer les données
    await review.populate('reviewer', 'name avatar');
    await review.populate('reviewed', 'name avatar');

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la création de l\'avis',
    });
  }
};

// @desc    Obtenir les avis d'un utilisateur
// @route   GET /api/reviews/user/:userId
// @access  Public
export const getUserReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ reviewed: req.params.userId })
        .populate('reviewer', 'name avatar')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments({ reviewed: req.params.userId }),
    ]);

    // Calculer les statistiques
    const allReviews = await Review.find({ reviewed: req.params.userId });
    const stats = {
      average: allReviews.length > 0
        ? Math.round((allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length) * 10) / 10
        : 0,
      total: allReviews.length,
      distribution: {
        5: allReviews.filter(r => r.rating === 5).length,
        4: allReviews.filter(r => r.rating === 4).length,
        3: allReviews.filter(r => r.rating === 3).length,
        2: allReviews.filter(r => r.rating === 2).length,
        1: allReviews.filter(r => r.rating === 1).length,
      },
    };

    res.status(200).json({
      success: true,
      data: reviews,
      stats,
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
      message: error.message || 'Erreur lors de la récupération des avis',
    });
  }
};

// @desc    Obtenir les avis d'un service
// @route   GET /api/reviews/service/:serviceId
// @access  Public
export const getServiceReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ service: req.params.serviceId })
        .populate('reviewer', 'name avatar')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments({ service: req.params.serviceId }),
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
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
      message: error.message || 'Erreur lors de la récupération des avis',
    });
  }
};

// @desc    Obtenir un avis par ID
// @route   GET /api/reviews/:id
// @access  Public
export const getReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('reviewer', 'name avatar')
      .populate('reviewed', 'name avatar');

    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Avis non trouvé',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération de l\'avis',
    });
  }
};

// @desc    Mettre à jour un avis
// @route   PUT /api/reviews/:id
// @access  Private (reviewer only)
export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Avis non trouvé',
      });
      return;
    }

    // Vérifier que l'utilisateur est l'auteur de l'avis
    if (review.reviewer.toString() !== req.user!._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cet avis',
      });
      return;
    }

    const { rating, comment } = req.body;

    review = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment },
      { new: true, runValidators: true }
    ).populate('reviewer', 'name avatar').populate('reviewed', 'name avatar');

    // Mettre à jour la note moyenne de l'utilisateur évalué
    const reviewedId = review!.reviewed._id;
    const allReviews = await Review.find({ reviewed: reviewedId });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(reviewedId, {
      rating: Math.round(avgRating * 10) / 10,
    });

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour de l\'avis',
    });
  }
};

// @desc    Supprimer un avis
// @route   DELETE /api/reviews/:id
// @access  Private (reviewer or admin)
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Avis non trouvé',
      });
      return;
    }

    // Vérifier que l'utilisateur est l'auteur ou admin
    if (review.reviewer.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer cet avis',
      });
      return;
    }

    const reviewedId = review.reviewed;
    await review.deleteOne();

    // Mettre à jour la note moyenne de l'utilisateur évalué
    const allReviews = await Review.find({ reviewed: reviewedId });
    const avgRating = allReviews.length > 0
      ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
      : 0;

    await User.findByIdAndUpdate(reviewedId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length,
    });

    res.status(200).json({
      success: true,
      message: 'Avis supprimé avec succès',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la suppression de l\'avis',
    });
  }
};

// @desc    Obtenir mes avis laissés
// @route   GET /api/reviews/my
// @access  Private
export const getMyReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ reviewer: req.user!._id })
        .populate('reviewed', 'name avatar')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments({ reviewer: req.user!._id }),
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
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
      message: error.message || 'Erreur lors de la récupération de vos avis',
    });
  }
};
