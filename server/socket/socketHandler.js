import jwt from 'jsonwebtoken';
import * as Chat from '../models/Chat.js';
import * as User from '../models/User.js';
import * as Notification from '../models/Notification.js';

// Track online users: userId -> Set of socketIds
const onlineUsers = new Map();

export const setupSocket = (io) => {
  // Auth middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.cookie?.split('token=')[1]?.split(';')[0];
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.userId;
    console.log(`🟢 User ${userId} connected (socket: ${socket.id})`);

    // Track online status
    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);
    await User.setOnlineStatus(userId, true);

    // Join personal room for notifications
    socket.join(`user_${userId}`);

    // Broadcast online status to friends
    socket.broadcast.emit('user-online', { userId });

    // ─── Join a chat room ───
    socket.on('join-chat', (chatId) => {
      socket.join(`chat_${chatId}`);
      console.log(`User ${userId} joined chat_${chatId}`);
    });

    // ─── Leave a chat room ───
    socket.on('leave-chat', (chatId) => {
      socket.leave(`chat_${chatId}`);
    });

    // ─── Send message ───
    socket.on('send-message', async (data, callback) => {
      try {
        const { chatId, content } = data;
        if (!chatId || !content) return;

        // Verify participant
        const isParticipant = await Chat.isParticipant(chatId, userId);
        if (!isParticipant) return;

        // Save to DB
        const message = await Chat.saveMessage({
          chat_id: chatId,
          sender_id: userId,
          content,
        });

        // Broadcast to chat room
        io.to(`chat_${chatId}`).emit('new-message', message);

        // Send notification to offline participants
        // (skip sender)
        const sender = await User.findById(userId);
        // We rely on the chat room for real-time, but also push notifs
        io.to(`chat_${chatId}`).except(socket.id).emit('message-notification', {
          chatId,
          senderName: sender?.username,
          content: content.substring(0, 50),
        });

        if (callback) callback({ success: true, message });
      } catch (err) {
        console.error('send-message error:', err.message);
        if (callback) callback({ success: false, error: err.message });
      }
    });

    // ─── Typing indicators ───
    socket.on('typing', (chatId) => {
      socket.to(`chat_${chatId}`).emit('user-typing', { userId, chatId });
    });
    socket.on('stop-typing', (chatId) => {
      socket.to(`chat_${chatId}`).emit('user-stop-typing', { userId, chatId });
    });

    // ─── Get online users ───
    socket.on('get-online-users', (callback) => {
      const online = Array.from(onlineUsers.keys());
      if (callback) callback(online);
    });

    // ─── Disconnect ───
    socket.on('disconnect', async () => {
      console.log(`🔴 User ${userId} disconnected (socket: ${socket.id})`);
      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          await User.setOnlineStatus(userId, false);
          socket.broadcast.emit('user-offline', { userId });
        }
      }
    });
  });
};

export const getOnlineUsers = () => Array.from(onlineUsers.keys());
