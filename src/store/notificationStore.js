import { create } from 'zustand';
import api from '../services/api.js';

const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/notifications');
      set({ notifications: data.notifications, unreadCount: data.unreadCount, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  markAllRead: async () => {
    await api.put('/notifications/read');
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    }));
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
}));

export default useNotificationStore;
