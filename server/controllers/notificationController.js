import * as Notification from '../models/Notification.js';

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.getUserNotifications(req.user.id);
    const unreadCount = await Notification.getUnreadCount(req.user.id);
    res.json({ notifications, unreadCount });
  } catch (err) { next(err); }
};

export const markAllRead = async (req, res, next) => {
  try {
    await Notification.markAllRead(req.user.id);
    res.json({ message: 'All notifications marked as read' });
  } catch (err) { next(err); }
};

export const markRead = async (req, res, next) => {
  try {
    await Notification.markRead(parseInt(req.params.id), req.user.id);
    res.json({ message: 'Notification marked as read' });
  } catch (err) { next(err); }
};
