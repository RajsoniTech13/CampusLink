import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as User from '../models/User.js';
import { validateRegister, validateLogin } from '../utils/validators.js';
import { AppError } from '../middleware/errorHandler.js';

export const register = async (req, res, next) => {
  try {
    validateRegister(req.body);
    const { username, email, password, role, department, year, enrollment_no, designation } = req.body;

    // Check existing
    if (await User.findByEmail(email)) throw new AppError('Email already registered');
    if (await User.findByUsername(username)) throw new AppError('Username already taken');

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await User.createUser({ username, email, password: hashedPassword, role: role || 'student' });

    // Create role-specific record
    if (role === 'faculty') {
      await User.createFaculty(userId, { department, designation });
    } else {
      await User.createStudent(userId, { department, year, enrollment_no });
    }

    const token = jwt.sign({ id: userId, role: role || 'student' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const user = await User.findById(userId);
    res.status(201).json({ message: 'Registered successfully', user });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    validateLogin(req.body);
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) throw new AppError('Invalid email or password', 401);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new AppError('Invalid email or password', 401);

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userData } = user;
    res.json({ message: 'Logged in successfully', user: userData });
  } catch (err) { next(err); }
};

export const logout = (_req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

export const me = async (req, res, next) => {
  try {
    const user = await User.getFullProfile(req.user.id);
    if (!user) throw new AppError('User not found', 404);
    res.json(user);
  } catch (err) { next(err); }
};
