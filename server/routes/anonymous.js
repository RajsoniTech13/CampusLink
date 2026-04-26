import { Router } from 'express';
import { getMessages } from '../controllers/anonymousChatController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/messages', verifyToken, getMessages);

export default router;
