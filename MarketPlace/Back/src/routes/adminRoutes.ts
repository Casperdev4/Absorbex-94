import { Router } from 'express';
import {
  getStats,
  getUsers,
  getAllListings,
  updateListingStatus,
  deleteListingAdmin,
  updateUserRole,
} from '../controllers/adminController';
import { protect, admin } from '../middlewares/auth';

const router = Router();

// Toutes les routes admin sont protégées
router.use(protect);
router.use(admin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/listings', getAllListings);
router.put('/listings/:id/status', updateListingStatus);
router.delete('/listings/:id', deleteListingAdmin);

export default router;
