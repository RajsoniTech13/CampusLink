import { AppError } from '../middleware/errorHandler.js';

export const validateRegister = (data) => {
  const { username, email, password } = data;
  if (!username || username.length < 3) throw new AppError('Username must be at least 3 characters');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AppError('Valid email is required');
  if (!password || password.length < 6) throw new AppError('Password must be at least 6 characters');
};

export const validateLogin = (data) => {
  const { email, password } = data;
  if (!email) throw new AppError('Email is required');
  if (!password) throw new AppError('Password is required');
};

export const validatePost = (data) => {
  const { content, image } = data;
  if (!content && !image) throw new AppError('Post must have content or an image');
};
