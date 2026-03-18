import { create } from 'zustand';
import api from '../services/api.js';
import { connectSocket, disconnectSocket } from '../services/socket.js';

const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,

  // Check session on app load
  checkAuth: async () => {
    try {
      set({ loading: true });
      const { data } = await api.get('/auth/me');
      set({ user: data, loading: false });
      connectSocket();
    } catch {
      set({ user: null, loading: false });
    }
  },

  login: async (email, password) => {
    try {
      set({ error: null });
      const { data } = await api.post('/auth/login', { email, password });
      set({ user: data.user, error: null });
      connectSocket();
      return data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      set({ error: msg });
      throw new Error(msg);
    }
  },

  register: async (formData) => {
    try {
      set({ error: null });
      const { data } = await api.post('/auth/register', formData);
      set({ user: data.user, error: null });
      connectSocket();
      return data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed';
      set({ error: msg });
      throw new Error(msg);
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch { /* ignore */ }
    disconnectSocket();
    set({ user: null });
  },

  updateUser: (updates) => {
    const { user } = get();
    if (user) set({ user: { ...user, ...updates } });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
