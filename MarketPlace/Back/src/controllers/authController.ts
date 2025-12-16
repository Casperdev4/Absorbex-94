import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/generateToken';

// @desc    Inscription d'un utilisateur
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, phone, city } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé',
      });
      return;
    }

    // Créer l'utilisateur
    const user = await User.create({
      email,
      password,
      name,
      phone,
      city,
    });

    // Générer le token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          city: user.city,
          avatar: user.avatar,
          role: user.role,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de l\'inscription',
    });
  }
};

// @desc    Connexion d'un utilisateur
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Vérifier que l'email et le mot de passe sont fournis
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Veuillez fournir un email et un mot de passe',
      });
      return;
    }

    // Trouver l'utilisateur et inclure le mot de passe
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect',
      });
      return;
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect',
      });
      return;
    }

    // Générer le token
    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          city: user.city,
          avatar: user.avatar,
          role: user.role,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la connexion',
    });
  }
};

// @desc    Obtenir le profil de l'utilisateur connecté
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        id: user!._id,
        email: user!.email,
        name: user!.name,
        phone: user!.phone,
        city: user!.city,
        avatar: user!.avatar,
        role: user!.role,
        createdAt: user!.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération du profil',
    });
  }
};

// @desc    Mettre à jour le profil de l'utilisateur
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, city, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { name, phone, city, avatar },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: {
        id: user!._id,
        email: user!.email,
        name: user!.name,
        phone: user!.phone,
        city: user!.city,
        avatar: user!.avatar,
        role: user!.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour du profil',
    });
  }
};

// @desc    Changer le mot de passe
// @route   PUT /api/auth/password
// @access  Private
export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user!._id).select('+password');

    // Vérifier le mot de passe actuel
    const isMatch = await user!.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Mot de passe actuel incorrect',
      });
      return;
    }

    user!.password = newPassword;
    await user!.save();

    const token = generateToken(user!._id.toString());

    res.status(200).json({
      success: true,
      message: 'Mot de passe mis à jour avec succès',
      token,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors du changement de mot de passe',
    });
  }
};
