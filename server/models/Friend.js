import pool from '../config/db.js';

// ─── Send friend request ───
export const sendRequest = async (senderId, receiverId) => {
  // Check if already friends
  const [existing] = await pool.query(
    'SELECT 1 FROM friends WHERE user_id = ? AND friend_id = ?', [senderId, receiverId]
  );
  if (existing.length > 0) throw new Error('Already friends');

  // Check for existing request
  const [req] = await pool.query(
    'SELECT id, status FROM friend_requests WHERE sender_id = ? AND receiver_id = ?',
    [senderId, receiverId]
  );
  if (req.length > 0) {
    if (req[0].status === 'pending') throw new Error('Request already sent');
    // Update rejected request to pending
    await pool.query('UPDATE friend_requests SET status = "pending" WHERE id = ?', [req[0].id]);
    return req[0].id;
  }

  // Check if the other person already sent us a request
  const [reverse] = await pool.query(
    'SELECT id FROM friend_requests WHERE sender_id = ? AND receiver_id = ? AND status = "pending"',
    [receiverId, senderId]
  );
  if (reverse.length > 0) {
    // Auto-accept
    await acceptRequest(reverse[0].id, senderId);
    return reverse[0].id;
  }

  const [result] = await pool.query(
    'INSERT INTO friend_requests (sender_id, receiver_id) VALUES (?, ?)',
    [senderId, receiverId]
  );
  return result.insertId;
};

// ─── Accept friend request ───
export const acceptRequest = async (requestId, userId) => {
  const [rows] = await pool.query(
    'SELECT * FROM friend_requests WHERE id = ? AND receiver_id = ? AND status = "pending"',
    [requestId, userId]
  );
  if (rows.length === 0) throw new Error('Request not found');

  const { sender_id, receiver_id } = rows[0];
  await pool.query('UPDATE friend_requests SET status = "accepted" WHERE id = ?', [requestId]);
  // Add bidirectional friendship
  await pool.query('INSERT IGNORE INTO friends (user_id, friend_id) VALUES (?, ?), (?, ?)',
    [sender_id, receiver_id, receiver_id, sender_id]);
  return { sender_id, receiver_id };
};

// ─── Reject friend request ───
export const rejectRequest = async (requestId, userId) => {
  await pool.query(
    'UPDATE friend_requests SET status = "rejected" WHERE id = ? AND receiver_id = ?',
    [requestId, userId]
  );
};

// ─── Get friend list ───
export const getFriends = async (userId) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.username, u.profile_pic, u.is_online, u.last_seen
     FROM friends f
     JOIN users u ON f.friend_id = u.id
     WHERE f.user_id = ?
     ORDER BY u.is_online DESC, u.username ASC`,
    [userId]
  );
  return rows;
};

// ─── Get pending requests received ───
export const getPendingRequests = async (userId) => {
  const [rows] = await pool.query(
    `SELECT fr.id, fr.created_at, u.id AS sender_id, u.username, u.profile_pic
     FROM friend_requests fr
     JOIN users u ON fr.sender_id = u.id
     WHERE fr.receiver_id = ? AND fr.status = 'pending'
     ORDER BY fr.created_at DESC`,
    [userId]
  );
  return rows;
};

// ─── Check if friends ───
export const areFriends = async (userId1, userId2) => {
  const [rows] = await pool.query(
    'SELECT 1 FROM friends WHERE user_id = ? AND friend_id = ?', [userId1, userId2]
  );
  return rows.length > 0;
};

// ─── Remove friend ───
export const removeFriend = async (userId, friendId) => {
  await pool.query('DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)',
    [userId, friendId, friendId, userId]);
};
