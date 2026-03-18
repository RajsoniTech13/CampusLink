import * as Chat from '../models/Chat.js';
import { AppError } from '../middleware/errorHandler.js';

export const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.getUserChats(req.user.id);
    res.json(chats);
  } catch (err) { next(err); }
};

export const getOrCreateChat = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) throw new AppError('User ID is required');
    const chatId = await Chat.getOrCreatePrivateChat(req.user.id, userId);
    res.json({ chatId });
  } catch (err) { next(err); }
};

export const getMessages = async (req, res, next) => {
  try {
    const chatId = parseInt(req.params.id);
    // Verify participant
    const isParticipant = await Chat.isParticipant(chatId, req.user.id);
    if (!isParticipant) throw new AppError('Not a participant of this chat', 403);

    const page = parseInt(req.query.page) || 1;
    const messages = await Chat.getMessages(chatId, page);
    res.json({ messages, page, hasMore: messages.length === 50 });
  } catch (err) { next(err); }
};

export const getGroupChatId = async (req, res, next) => {
  try {
    const chatId = await Chat.getGroupChatId(parseInt(req.params.groupId));
    if (!chatId) throw new AppError('Group chat not found', 404);
    res.json({ chatId });
  } catch (err) { next(err); }
};
