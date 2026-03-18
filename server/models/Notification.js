import pool from '../config/db.js';

// ─── Create notification ───
export const createNotification = async ({ user_id, type, reference_id, content }) => {
  const [result] = await pool.query(
    'INSERT INTO notifications (user_id, type, reference_id, content) VALUES (?, ?, ?, ?)',
    [user_id, type, reference_id || null, content]
  );
  return result.insertId;
};

// ─── Get user notifications ───
export const getUserNotifications = async (userId, limit = 30) => {
  const [rows] = await pool.query(
    `SELECT * FROM notifications
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT ?`,
    [userId, limit]
  );
  return rows;
};

// ─── Get unread count ───
export const getUnreadCount = async (userId) => {
  const [rows] = await pool.query(
    'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
    [userId]
  );
  return rows[0].count;
};

// ─── Mark all as read ───
export const markAllRead = async (userId) => {
  await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [userId]);
};

// ─── Mark single as read ───
export const markRead = async (notificationId, userId) => {
  await pool.query(
    'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
    [notificationId, userId]
  );
};

// ─── Delete old notifications ───
export const deleteOld = async (userId, days = 30) => {
  await pool.query(
    'DELETE FROM notifications WHERE user_id = ? AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)',
    [userId, days]
  );
};
