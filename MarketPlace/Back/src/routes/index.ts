import { Router } from 'express';
import authRoutes from './authRoutes';
import listingRoutes from './listingRoutes';
import serviceRoutes from './serviceRoutes';
import workerRoutes from './workerRoutes';
import favoriteRoutes from './favoriteRoutes';
import conversationRoutes from './conversationRoutes';
import adminRoutes from './adminRoutes';
import taskRoutes from './taskRoutes';
import reviewRoutes from './reviewRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/listings', listingRoutes);
router.use('/services', serviceRoutes);
router.use('/workers', workerRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/conversations', conversationRoutes);
router.use('/admin', adminRoutes);
router.use('/tasks', taskRoutes);
router.use('/reviews', reviewRoutes);

export default router;
