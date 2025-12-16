import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getMyTasks,
  acceptTask,
  completeTask,
  cancelTask,
} from '../controllers/taskController';
import { protect } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

// Routes publiques
router.get('/', getTasks);
router.get('/:id', getTask);

// Routes protégées
router.post('/', protect, upload.array('images', 5), createTask);
router.get('/user/my', protect, getMyTasks);
router.put('/:id', protect, upload.array('images', 5), updateTask);
router.delete('/:id', protect, deleteTask);
router.put('/:id/accept', protect, acceptTask);
router.put('/:id/complete', protect, completeTask);
router.put('/:id/cancel', protect, cancelTask);

export default router;
