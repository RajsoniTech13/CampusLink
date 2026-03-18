import * as Group from '../models/Group.js';
import { AppError } from '../middleware/errorHandler.js';

export const createGroup = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) throw new AppError('Group name is required');
    const cover_pic = req.file ? `/uploads/${req.file.filename}` : undefined;
    const groupId = await Group.createGroup({ name, description, cover_pic, created_by: req.user.id });
    const group = await Group.getGroupById(groupId, req.user.id);
    res.status(201).json(group);
  } catch (err) { next(err); }
};

export const getGroups = async (req, res, next) => {
  try {
    const groups = await Group.getAllGroups(req.user.id);
    res.json(groups);
  } catch (err) { next(err); }
};

export const getGroup = async (req, res, next) => {
  try {
    const group = await Group.getGroupById(parseInt(req.params.id), req.user.id);
    if (!group) throw new AppError('Group not found', 404);
    res.json(group);
  } catch (err) { next(err); }
};

export const joinGroup = async (req, res, next) => {
  try {
    await Group.joinGroup(parseInt(req.params.id), req.user.id);
    res.json({ message: 'Joined group' });
  } catch (err) { next(err); }
};

export const leaveGroup = async (req, res, next) => {
  try {
    await Group.leaveGroup(parseInt(req.params.id), req.user.id);
    res.json({ message: 'Left group' });
  } catch (err) { next(err); }
};

export const getMembers = async (req, res, next) => {
  try {
    const members = await Group.getMembers(parseInt(req.params.id));
    res.json(members);
  } catch (err) { next(err); }
};
