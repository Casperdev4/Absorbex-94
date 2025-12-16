import { Router } from 'express';
import {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
  getUserListings,
  getMyListings,
} from '../controllers/listingController';
import { protect, optionalAuth } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/', getListings);
router.get('/my', protect, getMyListings);
router.get('/user/:userId', optionalAuth, getUserListings);
router.get('/:id', optionalAuth, getListing);
router.post('/', protect, upload.array('images', 10), createListing);
router.put('/:id', protect, upload.array('images', 10), updateListing);
router.delete('/:id', protect, deleteListing);

export default router;
