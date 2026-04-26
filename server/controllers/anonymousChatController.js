import * as AnonymousChat from '../models/AnonymousChat.js';
import { AppError } from '../middleware/errorHandler.js';

export const getMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const messages = await AnonymousChat.getRecentMessages(page);
    const total = await AnonymousChat.getMessageCount();
    res.json({ messages, page, hasMore: messages.length === 50, total });
  } catch (err) { next(err); }
};
