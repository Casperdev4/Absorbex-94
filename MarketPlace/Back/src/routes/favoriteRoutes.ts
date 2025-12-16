import { Router } from 'express';
import {
  addFavorite,
  removeFavorite,
  getMyFavorites,
  checkFavorite,
} from '../controllers/favoriteController';
import { protect } from '../middlewares/auth';

const router = Router();

router.get('/', protect, getMyFavorites);
router.get('/check/:listingId', protect, checkFavorite);
router.post('/:listingId', protect, addFavorite);
router.delete('/:listingId', protect, removeFavorite);

export default router;
