// ─── Shared config for API URL and image helpers ───
// Single source of truth — never hardcode API_URL elsewhere!

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=5c7cfa&color=fff&bold=true&size=200&name=';

/**
 * Build the full image src URL
 * Handles: server-relative paths (/uploads/...), full URLs, null/undefined
 */
export const imgSrc = (pic, fallbackName = 'U') => {
  if (!pic) return `${DEFAULT_AVATAR}${encodeURIComponent(fallbackName)}`;
  if (pic.startsWith('http')) return pic;
  if (pic.startsWith('/')) return `${API_URL}${pic}`;
  return pic;
};
