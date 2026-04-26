import jwt from 'jsonwebtoken';
import * as Chat from '../models/Chat.js';
import * as User from '../models/User.js';
import * as AnonymousChat from '../models/AnonymousChat.js';
import * as Notification from '../models/Notification.js';

// Track online users: userId -> Set of socketIds
const onlineUsers = new Map();

// Random animal names for anonymous aliases
const ANIMALS = [
  'Panda', 'Phoenix', 'Wolf', 'Eagle', 'Dolphin', 'Falcon', 'Tiger', 'Fox',
  'Owl', 'Hawk', 'Bear', 'Lion', 'Raven', 'Shark', 'Cobra', 'Lynx',
  'Jaguar', 'Panther', 'Bison', 'Stag', 'Crane', 'Viper', 'Orca', 'Drake',
];
const ADJECTIVES = [
  'Swift', 'Silent', 'Brave', 'Mystic', 'Shadow', 'Cosmic', 'Neon', 'Stormy',
  'Frost', 'Solar', 'Thunder', 'Crystal', 'Iron', 'Lunar', 'Blaze', 'Cyber',
];

// Per-session anonymous alias map: socketId -> alias
const anonymousAliases = new Map();

const generateAlias = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = Math.floor(Math.random() * 100);
  return `${adj}${animal}${num}`;
};

export const setupSocket = (io) => {
  // Auth middleware for socket connections
  io.use((socket, next) => {
    // Try auth token first, then cookie
    let token = socket.handshake.auth?.token;
    if (!token) {
      const cookieHeader = socket.handshake.headers?.cookie || '';
      const match = cookieHeader.match(/(?:^|;\s*)token=([^;]*)/);
      token = match ? match[1] : null;
    }
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

    // ─── Send message (DM + Group) ───
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

    // ─── Anonymous Hub ───
    socket.on('join-hub', (callback) => {
      socket.join('campus_hub');
      // Assign a random alias for this session
      if (!anonymousAliases.has(socket.id)) {
        anonymousAliases.set(socket.id, generateAlias());
      }
      const alias = anonymousAliases.get(socket.id);
      console.log(`User ${userId} joined campus_hub as ${alias}`);
      if (callback) callback({ success: true, alias });
    });

    socket.on('leave-hub', () => {
      socket.leave('campus_hub');
    });

    socket.on('hub-message', async (data, callback) => {
      try {
        const { content, isVanish = false } = data;
        if (!content || !content.trim()) return;

        const alias = anonymousAliases.get(socket.id) || generateAlias();

        // Save to DB
        const message = await AnonymousChat.saveMessage({
          sender_id: userId,
          anonymous_alias: alias,
          content: content.trim(),
          is_vanish: isVanish
        });

        // Broadcast to everyone in hub
        io.to('campus_hub').emit('hub-new-message', message);

        if (callback) callback({ success: true, message });
      } catch (err) {
        console.error('hub-message error:', err.message);
        if (callback) callback({ success: false, error: err.message });
      }
    });

    socket.on('hub-typing', () => {
      const alias = anonymousAliases.get(socket.id) || 'Someone';
      socket.to('campus_hub').emit('hub-user-typing', { alias });
    });

    socket.on('hub-stop-typing', () => {
      const alias = anonymousAliases.get(socket.id) || 'Someone';
      socket.to('campus_hub').emit('hub-user-stop-typing', { alias });
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
      anonymousAliases.delete(socket.id);
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
