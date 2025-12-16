import multer from 'multer';
import { Request } from 'express';

// Configuration de multer pour le stockage en mémoire
const storage = multer.memoryStorage();

// Filtrer les fichiers pour n'accepter que les images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Seuls JPEG, PNG, GIF et WebP sont acceptés.'));
  }
};

// Export du middleware multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 10, // Maximum 10 fichiers
  },
});
