import pool from '../config/db.js';

// ─── Get recent anonymous messages ───
export const getRecentMessages = async (page = 1, limit = 50) => {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `SELECT id, anonymous_alias, content, created_at
     FROM anonymous_messages
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  return rows.reverse(); // Return chronological order
};

// ─── Save anonymous message ───
export const saveMessage = async ({ sender_id, anonymous_alias, content }) => {
  const [result] = await pool.query(
    'INSERT INTO anonymous_messages (sender_id, anonymous_alias, content) VALUES (?, ?, ?)',
    [sender_id, anonymous_alias, content]
  );
  // Return the message WITHOUT the real sender_id (anonymous!)
  const [rows] = await pool.query(
    `SELECT id, anonymous_alias, content, created_at
     FROM anonymous_messages WHERE id = ?`,
    [result.insertId]
  );
  return rows[0];
};

// ─── Count messages ───
export const getMessageCount = async () => {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM anonymous_messages');
  return rows[0].total;
};
