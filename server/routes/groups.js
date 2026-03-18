import { Router } from 'express';
import { createGroup, getGroups, getGroup, joinGroup, leaveGroup, getMembers } from '../controllers/groupController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.post('/', verifyToken, createGroup);
router.get('/', verifyToken, getGroups);
router.get('/:id', verifyToken, getGroup);
router.post('/:id/join', verifyToken, joinGroup);
router.post('/:id/leave', verifyToken, leaveGroup);
router.get('/:id/members', verifyToken, getMembers);

export default router;
