import { Router } from 'express';
import {
  createConversation,
  getMyConversations,
  getConversation,
  getMessages,
  sendMessage,
  getUnreadCount,
} from '../controllers/conversationController';
import { protect } from '../middlewares/auth';

const router = Router();

router.get('/', protect, getMyConversations);
router.get('/unread/count', protect, getUnreadCount);
router.get('/:id', protect, getConversation);
router.get('/:id/messages', protect, getMessages);
router.post('/', protect, createConversation);
router.post('/:id/messages', protect, sendMessage);

export default router;
