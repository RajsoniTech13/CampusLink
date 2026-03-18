import { Router } from 'express';
import { getProfile, updateProfile, searchUsers, updateProfilePic, updateCoverPic } from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
}});

const router = Router();

router.get('/search', verifyToken, searchUsers);
router.get('/:id', verifyToken, getProfile);
router.put('/update', verifyToken, updateProfile);
router.put('/profile-pic', verifyToken, upload.single('image'), updateProfilePic);
router.put('/cover-pic', verifyToken, upload.single('image'), updateCoverPic);

export default router;
