import { create } from 'zustand';
import api from '../services/api.js';

const usePostStore = create((set, get) => ({
  posts: [],
  page: 1,
  hasMore: true,
  loading: false,

  fetchFeed: async (reset = false) => {
    const { loading, hasMore, page } = get();
    if (loading || (!hasMore && !reset)) return;
    
    const targetPage = reset ? 1 : page;
    set({ loading: true });

    try {
      const { data } = await api.get(`/posts/feed?page=${targetPage}&limit=10`);
      set((state) => ({
        posts: reset ? data.posts : [...state.posts, ...data.posts],
        page: targetPage + 1,
        hasMore: data.hasMore,
        loading: false,
      }));
    } catch {
      set({ loading: false });
    }
  },

  createPost: async (formData) => {
    const { data } = await api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    set((state) => ({ posts: [data, ...state.posts] }));
    return data;
  },

  toggleLike: async (postId) => {
    const { data } = await api.post(`/posts/${postId}/like`);
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? { ...p, is_liked: data.liked ? 1 : 0, like_count: p.like_count + (data.liked ? 1 : -1) }
          : p
      ),
    }));
  },

  addComment: async (postId, content) => {
    await api.post(`/posts/${postId}/comment`, { content });
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, comment_count: p.comment_count + 1 } : p
      ),
    }));
  },

  deletePost: async (postId) => {
    await api.delete(`/posts/${postId}`);
    set((state) => ({ posts: state.posts.filter((p) => p.id !== postId) }));
  },

  reset: () => set({ posts: [], page: 1, hasMore: true, loading: false }),
}));

export default usePostStore;
