import { Router } from 'express';
import { getChats, getOrCreateChat, getMessages, getGroupChatId } from '../controllers/chatController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, getChats);
router.post('/private', verifyToken, getOrCreateChat);
router.get('/group/:groupId', verifyToken, getGroupChatId);
router.get('/:id/messages', verifyToken, getMessages);

export default router;
