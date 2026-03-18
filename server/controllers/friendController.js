import * as Friend from '../models/Friend.js';
import * as Notification from '../models/Notification.js';
import * as User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

export const sendRequest = async (req, res, next) => {
  try {
    const { receiverId } = req.body;
    if (!receiverId) throw new AppError('Receiver ID is required');
    if (receiverId === req.user.id) throw new AppError('Cannot send request to yourself');

    const reqId = await Friend.sendRequest(req.user.id, receiverId);

    // Notify receiver
    const sender = await User.findById(req.user.id);
    await Notification.createNotification({
      user_id: receiverId,
      type: 'friend_request',
      reference_id: reqId,
      content: `${sender.username} sent you a friend request`,
    });
    const io = req.app.get('io');
    if (io) io.to(`user_${receiverId}`).emit('notification', { type: 'friend_request' });

    res.status(201).json({ message: 'Friend request sent', requestId: reqId });
  } catch (err) { next(err); }
};

export const acceptRequest = async (req, res, next) => {
  try {
    const { requestId } = req.body;
    if (!requestId) throw new AppError('Request ID is required');
    const { sender_id } = await Friend.acceptRequest(requestId, req.user.id);

    // Notify sender that request was accepted
    const accepter = await User.findById(req.user.id);
    await Notification.createNotification({
      user_id: sender_id,
      type: 'friend_accept',
      reference_id: req.user.id,
      content: `${accepter.username} accepted your friend request`,
    });
    const io = req.app.get('io');
    if (io) io.to(`user_${sender_id}`).emit('notification', { type: 'friend_accept' });

    res.json({ message: 'Friend request accepted' });
  } catch (err) { next(err); }
};

export const rejectRequest = async (req, res, next) => {
  try {
    const { requestId } = req.body;
    await Friend.rejectRequest(requestId, req.user.id);
    res.json({ message: 'Friend request rejected' });
  } catch (err) { next(err); }
};

export const getFriends = async (req, res, next) => {
  try {
    const friends = await Friend.getFriends(req.user.id);
    res.json(friends);
  } catch (err) { next(err); }
};

export const getPendingRequests = async (req, res, next) => {
  try {
    const requests = await Friend.getPendingRequests(req.user.id);
    res.json(requests);
  } catch (err) { next(err); }
};

export const removeFriend = async (req, res, next) => {
  try {
    const { friendId } = req.body;
    await Friend.removeFriend(req.user.id, friendId);
    res.json({ message: 'Friend removed' });
  } catch (err) { next(err); }
};
