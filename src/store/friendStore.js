import { create } from 'zustand';
import api from '../services/api.js';

const useFriendStore = create((set) => ({
  friends: [],
  requests: [],
  loading: false,

  fetchFriends: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/friends/list');
      set({ friends: data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchRequests: async () => {
    try {
      const { data } = await api.get('/friends/requests');
      set({ requests: data });
    } catch { /* ignore */ }
  },

  sendRequest: async (receiverId) => {
    await api.post('/friends/request', { receiverId });
  },

  acceptRequest: async (requestId) => {
    await api.post('/friends/accept', { requestId });
    set((state) => ({
      requests: state.requests.filter((r) => r.id !== requestId),
    }));
  },

  rejectRequest: async (requestId) => {
    await api.post('/friends/reject', { requestId });
    set((state) => ({
      requests: state.requests.filter((r) => r.id !== requestId),
    }));
  },

  removeFriend: async (friendId) => {
    await api.post('/friends/remove', { friendId });
    set((state) => ({
      friends: state.friends.filter((f) => f.id !== friendId),
    }));
  },
}));

export default useFriendStore;
