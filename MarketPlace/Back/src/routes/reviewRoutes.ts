import { Router } from 'express';
import {
  createReview,
  getUserReviews,
  getServiceReviews,
  getReview,
  updateReview,
  deleteReview,
  getMyReviews,
} from '../controllers/reviewController';
import { protect } from '../middlewares/auth';

const router = Router();

// Routes publiques
router.get('/user/:userId', getUserReviews);
router.get('/service/:serviceId', getServiceReviews);
router.get('/:id', getReview);

// Routes protégées
router.post('/', protect, createReview);
router.get('/user/my/reviews', protect, getMyReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
