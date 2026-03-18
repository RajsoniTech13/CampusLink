import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

// ES module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import friendRoutes from './routes/friends.js';
import clubRoutes from './routes/clubs.js';
import groupRoutes from './routes/groups.js';
import chatRoutes from './routes/chats.js';
import notificationRoutes from './routes/notifications.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

// Import socket handler
import { setupSocket } from './socket/socketHandler.js';

// Import DB to trigger connection test
import './config/db.js';

const app = express();
const httpServer = createServer(app);

// Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Make io accessible to controllers
app.set('io', io);

// ─── Middleware ───
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files for uploads
app.use('/uploads', express.static(uploadsDir));

// Request logging
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Error Handler ───
app.use(errorHandler);

// ─── Socket.IO Setup ───
setupSocket(io);

// ─── Start Server ───
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`
  🚀 CampusLink Server running on port ${PORT}
  📡 Socket.IO enabled
  📁 Uploads directory: ${uploadsDir}
  🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}
  `);
});

export default app;
