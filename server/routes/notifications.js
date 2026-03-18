import { Router } from 'express';
import { getNotifications, markAllRead, markRead } from '../controllers/notificationController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, getNotifications);
router.put('/read', verifyToken, markAllRead);
router.put('/:id/read', verifyToken, markRead);

export default router;
