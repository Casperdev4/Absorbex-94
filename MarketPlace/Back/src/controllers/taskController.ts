import { Request, Response } from 'express';
import Task from '../models/Task';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';

// @desc    Créer une tâche/mission
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, category, budget, budgetType, city, address, scheduledDate, scheduledTime } = req.body;

    // Upload des images si présentes
    let images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      const uploadPromises = req.files.map((file: Express.Multer.File) =>
        uploadToCloudinary(file.buffer, 'service/tasks')
      );
      const results = await Promise.all(uploadPromises);
      images = results.map((r) => r.url);
    }

    const task = await Task.create({
      client: req.user!._id,
      title,
      description,
      category,
      budget,
      budgetType: budgetType || 'fixed',
      city,
      address,
      scheduledDate,
      scheduledTime,
      images,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la création de la mission',
    });
  }
};

// @desc    Obtenir toutes les tâches avec filtres
// @route   GET /api/tasks
// @access  Public
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      city,
      minBudget,
      maxBudget,
      status = 'pending',
      sort = '-createdAt',
    } = req.query;

    // Construire le filtre
    const filter: any = { status };

    if (category) filter.category = category;
    if (city) filter.city = { $regex: city, $options: 'i' };

    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = Number(minBudget);
      if (maxBudget) filter.budget.$lte = Number(maxBudget);
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Exécuter la requête
    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('client', 'name city avatar rating')
        .sort(sort as string)
        .skip(skip)
        .limit(Number(limit)),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: tasks,
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
      message: error.message || 'Erreur lors de la récupération des missions',
    });
  }
};

// @desc    Obtenir une tâche par ID
// @route   GET /api/tasks/:id
// @access  Public
export const getTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('client', 'name city avatar phone rating reviewCount')
      .populate('worker', 'name city avatar phone rating reviewCount');

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Mission non trouvée',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération de la mission',
    });
  }
};

// @desc    Mettre à jour une tâche
// @route   PUT /api/tasks/:id
// @access  Private (client only)
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Mission non trouvée',
      });
      return;
    }

    // Vérifier que l'utilisateur est le client
    if (task.client.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cette mission',
      });
      return;
    }

    const { title, description, category, budget, budgetType, city, address, scheduledDate, scheduledTime, status } = req.body;

    // Upload des nouvelles images si présentes
    let images = task.images || [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadPromises = req.files.map((file: Express.Multer.File) =>
        uploadToCloudinary(file.buffer, 'service/tasks')
      );
      const results = await Promise.all(uploadPromises);
      images = [...images, ...results.map((r) => r.url)];
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        budget,
        budgetType,
        city,
        address,
        scheduledDate,
        scheduledTime,
        status,
        images,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour de la mission',
    });
  }
};

// @desc    Supprimer une tâche
// @route   DELETE /api/tasks/:id
// @access  Private (client only)
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Mission non trouvée',
      });
      return;
    }

    // Vérifier que l'utilisateur est le client ou admin
    if (task.client.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer cette mission',
      });
      return;
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Mission supprimée avec succès',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la suppression de la mission',
    });
  }
};

// @desc    Obtenir mes missions (en tant que client)
// @route   GET /api/tasks/my
// @access  Private
export const getMyTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = { client: req.user!._id };
    if (status) filter.status = status;

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('worker', 'name avatar rating')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: tasks,
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
      message: error.message || 'Erreur lors de la récupération de vos missions',
    });
  }
};

// @desc    Accepter une mission (en tant que worker)
// @route   PUT /api/tasks/:id/accept
// @access  Private (worker only)
export const acceptTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Mission non trouvée',
      });
      return;
    }

    if (task.status !== 'pending') {
      res.status(400).json({
        success: false,
        message: 'Cette mission n\'est plus disponible',
      });
      return;
    }

    // Ne pas permettre au client d'accepter sa propre mission
    if (task.client.toString() === req.user!._id.toString()) {
      res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas accepter votre propre mission',
      });
      return;
    }

    task.worker = req.user!._id;
    task.status = 'accepted';
    await task.save();

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de l\'acceptation de la mission',
    });
  }
};

// @desc    Marquer une mission comme terminée
// @route   PUT /api/tasks/:id/complete
// @access  Private
export const completeTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Mission non trouvée',
      });
      return;
    }

    // Seul le client ou le worker peut marquer comme terminée
    const isClient = task.client.toString() === req.user!._id.toString();
    const isWorker = task.worker?.toString() === req.user!._id.toString();

    if (!isClient && !isWorker && req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Non autorisé',
      });
      return;
    }

    if (task.status !== 'in_progress' && task.status !== 'accepted') {
      res.status(400).json({
        success: false,
        message: 'Cette mission ne peut pas être marquée comme terminée',
      });
      return;
    }

    task.status = 'completed';
    await task.save();

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la complétion de la mission',
    });
  }
};

// @desc    Annuler une mission
// @route   PUT /api/tasks/:id/cancel
// @access  Private
export const cancelTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Mission non trouvée',
      });
      return;
    }

    // Seul le client peut annuler
    if (task.client.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Non autorisé à annuler cette mission',
      });
      return;
    }

    if (task.status === 'completed' || task.status === 'cancelled') {
      res.status(400).json({
        success: false,
        message: 'Cette mission ne peut pas être annulée',
      });
      return;
    }

    task.status = 'cancelled';
    await task.save();

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de l\'annulation de la mission',
    });
  }
};
