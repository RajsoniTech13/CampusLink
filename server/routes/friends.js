import { Router } from 'express';
import { sendRequest, acceptRequest, rejectRequest, getFriends, getPendingRequests, removeFriend } from '../controllers/friendController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.post('/request', verifyToken, sendRequest);
router.post('/accept', verifyToken, acceptRequest);
router.post('/reject', verifyToken, rejectRequest);
router.get('/list', verifyToken, getFriends);
router.get('/requests', verifyToken, getPendingRequests);
router.post('/remove', verifyToken, removeFriend);

export default router;
