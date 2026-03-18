import * as Club from '../models/Club.js';
import * as Post from '../models/Post.js';
import { AppError } from '../middleware/errorHandler.js';

export const createClub = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) throw new AppError('Club name is required');
    const cover_pic = req.file ? `/uploads/${req.file.filename}` : undefined;
    const clubId = await Club.createClub({ name, description, cover_pic, created_by: req.user.id });
    const club = await Club.getClubById(clubId, req.user.id);
    res.status(201).json(club);
  } catch (err) { next(err); }
};

export const getClubs = async (req, res, next) => {
  try {
    const clubs = await Club.getAllClubs(req.user.id);
    res.json(clubs);
  } catch (err) { next(err); }
};

export const getClub = async (req, res, next) => {
  try {
    const club = await Club.getClubById(parseInt(req.params.id), req.user.id);
    if (!club) throw new AppError('Club not found', 404);
    res.json(club);
  } catch (err) { next(err); }
};

export const joinClub = async (req, res, next) => {
  try {
    await Club.joinClub(parseInt(req.params.id), req.user.id);
    res.json({ message: 'Joined club' });
  } catch (err) { next(err); }
};

export const leaveClub = async (req, res, next) => {
  try {
    await Club.leaveClub(parseInt(req.params.id), req.user.id);
    res.json({ message: 'Left club' });
  } catch (err) { next(err); }
};

export const getClubPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const posts = await Post.getClubPosts(parseInt(req.params.id), req.user.id, page);
    res.json({ posts, page, hasMore: posts.length === 10 });
  } catch (err) { next(err); }
};

export const getMembers = async (req, res, next) => {
  try {
    const members = await Club.getMembers(parseInt(req.params.id));
    res.json(members);
  } catch (err) { next(err); }
};

export const searchClubs = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const clubs = await Club.searchClubs(q, req.user.id);
    res.json(clubs);
  } catch (err) { next(err); }
};
