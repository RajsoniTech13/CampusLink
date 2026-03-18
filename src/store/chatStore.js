import { create } from 'zustand';
import api from '../services/api.js';
import { getSocket } from '../services/socket.js';

const useChatStore = create((set, get) => ({
  chats: [],
  activeChat: null,
  messages: [],
  messagesPage: 1,
  hasMoreMessages: true,
  loadingChats: false,
  loadingMessages: false,
  onlineUsers: [],
  typingUsers: {},

  fetchChats: async () => {
    set({ loadingChats: true });
    try {
      const { data } = await api.get('/chats');
      set({ chats: data, loadingChats: false });
    } catch {
      set({ loadingChats: false });
    }
  },

  openChat: async (chatId) => {
    set({ activeChat: chatId, messages: [], messagesPage: 1, hasMoreMessages: true });
    const socket = getSocket();
    if (socket) socket.emit('join-chat', chatId);
    await get().fetchMessages(chatId);
  },

  closeChat: () => {
    const { activeChat } = get();
    if (activeChat) {
      const socket = getSocket();
      if (socket) socket.emit('leave-chat', activeChat);
    }
    set({ activeChat: null, messages: [] });
  },

  startPrivateChat: async (userId) => {
    const { data } = await api.post('/chats/private', { userId });
    await get().fetchChats();
    await get().openChat(data.chatId);
    return data.chatId;
  },

  fetchMessages: async (chatId) => {
    const { messagesPage, hasMoreMessages, loadingMessages } = get();
    if (loadingMessages || !hasMoreMessages) return;
    set({ loadingMessages: true });
    try {
      const { data } = await api.get(`/chats/${chatId}/messages?page=${messagesPage}`);
      set((state) => ({
        messages: [...data.messages, ...state.messages],
        messagesPage: state.messagesPage + 1,
        hasMoreMessages: data.hasMore,
        loadingMessages: false,
      }));
    } catch {
      set({ loadingMessages: false });
    }
  },

  sendMessage: (chatId, content) => {
    const socket = getSocket();
    if (socket) {
      socket.emit('send-message', { chatId, content }, (response) => {
        if (!response?.success) console.error('Failed to send message');
      });
    }
  },

  addMessage: (message) => {
    set((state) => {
      if (state.messages.some(m => m.id === message.id)) return state;
      return { messages: [...state.messages, message] };
    });
  },

  setOnlineUsers: (users) => set({ onlineUsers: users }),
  addOnlineUser: (userId) => set((state) => ({
    onlineUsers: state.onlineUsers.includes(userId) ? state.onlineUsers : [...state.onlineUsers, userId]
  })),
  removeOnlineUser: (userId) => set((state) => ({
    onlineUsers: state.onlineUsers.filter((id) => id !== userId)
  })),

  setTyping: (chatId, userId) => set((state) => ({
    typingUsers: { ...state.typingUsers, [`${chatId}_${userId}`]: true }
  })),
  clearTyping: (chatId, userId) => set((state) => {
    const copy = { ...state.typingUsers };
    delete copy[`${chatId}_${userId}`];
    return { typingUsers: copy };
  }),
}));

export default useChatStore;
