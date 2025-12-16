import { Router } from 'express';
import {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
  getUserServices,
  getMyServices,
} from '../controllers/serviceController';
import { protect, optionalAuth } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/', getServices);
router.get('/my', protect, getMyServices);
router.get('/user/:userId', optionalAuth, getUserServices);
router.get('/:id', optionalAuth, getService);
router.post('/', protect, upload.array('images', 10), createService);
router.put('/:id', protect, upload.array('images', 10), updateService);
router.delete('/:id', protect, deleteService);

export default router;
