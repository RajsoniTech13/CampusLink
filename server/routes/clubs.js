import { Router } from 'express';
import { createClub, getClubs, getClub, joinClub, leaveClub, getClubPosts, getMembers, searchClubs } from '../controllers/clubController.js';
import { verifyToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();

router.post('/', verifyToken, upload.single('cover'), createClub);
router.get('/', verifyToken, getClubs);
router.get('/search', verifyToken, searchClubs);
router.get('/:id', verifyToken, getClub);
router.post('/:id/join', verifyToken, joinClub);
router.post('/:id/leave', verifyToken, leaveClub);
router.get('/:id/posts', verifyToken, getClubPosts);
router.get('/:id/members', verifyToken, getMembers);

export default router;
