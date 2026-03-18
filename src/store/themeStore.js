import { create } from 'zustand';

const useThemeStore = create((set) => ({
  theme: localStorage.getItem('campuslink-theme') || 'dark',

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('campuslink-theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      return { theme: next };
    }),

  initTheme: () =>
    set((state) => {
      document.documentElement.classList.toggle('dark', state.theme === 'dark');
      return state;
    }),
}));

export default useThemeStore;
