import { Router } from 'express';
import {
  getWorkers,
  getWorker,
  getTopRatedWorkers,
  becomeWorker,
  updateWorkerProfile,
} from '../controllers/workerController';
import { protect } from '../middlewares/auth';

const router = Router();

router.get('/', getWorkers);
router.get('/top-rated', getTopRatedWorkers);
router.get('/:id', getWorker);
router.put('/become-worker', protect, becomeWorker);
router.put('/profile', protect, updateWorkerProfile);

export default router;
