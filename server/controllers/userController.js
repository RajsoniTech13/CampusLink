import * as User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.getFullProfile(parseInt(req.params.id));
    if (!user) throw new AppError('User not found', 404);
    res.json(user);
  } catch (err) { next(err); }
};

export const updateProfile = async (req, res, next) => {
  try {
    await User.updateUser(req.user.id, req.body);
    const user = await User.getFullProfile(req.user.id);
    res.json({ message: 'Profile updated', user });
  } catch (err) { next(err); }
};

export const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json([]);
    const users = await User.searchUsers(q);
    res.json(users);
  } catch (err) { next(err); }
};

export const updateProfilePic = async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('No file uploaded');
    const picPath = `/uploads/${req.file.filename}`;
    await User.updateUser(req.user.id, { profile_pic: picPath });
    res.json({ message: 'Profile picture updated', profile_pic: picPath });
  } catch (err) { next(err); }
};

export const updateCoverPic = async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('No file uploaded');
    const picPath = `/uploads/${req.file.filename}`;
    await User.updateUser(req.user.id, { cover_pic: picPath });
    res.json({ message: 'Cover picture updated', cover_pic: picPath });
  } catch (err) { next(err); }
};
