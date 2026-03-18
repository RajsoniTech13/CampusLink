import { Router } from 'express';
import { createPost, getFeed, getUserPosts, toggleLike, addComment, getComments, deletePost } from '../controllers/postController.js';
import { verifyToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|mp4/;
  cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
}});

const router = Router();

router.post('/', verifyToken, upload.single('image'), createPost);
router.get('/feed', verifyToken, getFeed);
router.get('/user/:id', verifyToken, getUserPosts);
router.post('/:id/like', verifyToken, toggleLike);
router.post('/:id/comment', verifyToken, addComment);
router.get('/:id/comments', verifyToken, getComments);
router.delete('/:id', verifyToken, deletePost);

export default router;
