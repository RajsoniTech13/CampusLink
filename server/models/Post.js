import pool from '../config/db.js';

// ─── Create post ───
export const createPost = async ({ user_id, content, image, club_id }) => {
  const [result] = await pool.query(
    'INSERT INTO posts (user_id, content, image, club_id) VALUES (?, ?, ?, ?)',
    [user_id, content || null, image || null, club_id || null]
  );
  return result.insertId;
};

// ─── Get feed (friends' posts + own posts, paginated) ───
export const getFeed = async (userId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `SELECT p.*, u.username, u.profile_pic,
       (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
       (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count,
       EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ?) AS is_liked
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.club_id IS NULL
       AND (p.user_id = ? OR p.user_id IN (SELECT friend_id FROM friends WHERE user_id = ?))
     ORDER BY p.created_at DESC
     LIMIT ? OFFSET ?`,
    [userId, userId, userId, limit, offset]
  );
  return rows;
};

// ─── Get user posts ───
export const getUserPosts = async (userId, viewerId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `SELECT p.*, u.username, u.profile_pic,
       (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
       (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count,
       EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ?) AS is_liked
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id = ? AND p.club_id IS NULL
     ORDER BY p.created_at DESC
     LIMIT ? OFFSET ?`,
    [viewerId, userId, limit, offset]
  );
  return rows;
};

// ─── Get single post ───
export const getPostById = async (postId, userId) => {
  const [rows] = await pool.query(
    `SELECT p.*, u.username, u.profile_pic,
       (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
       (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count,
       EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ?) AS is_liked
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = ?`,
    [userId, postId]
  );
  return rows[0];
};

// ─── Toggle like ───
export const toggleLike = async (userId, postId) => {
  const [existing] = await pool.query(
    'SELECT id FROM likes WHERE user_id = ? AND post_id = ?', [userId, postId]
  );
  if (existing.length > 0) {
    await pool.query('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [userId, postId]);
    return false; // unliked
  } else {
    await pool.query('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [userId, postId]);
    return true; // liked
  }
};

// ─── Add comment ───
export const addComment = async ({ user_id, post_id, content }) => {
  const [result] = await pool.query(
    'INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)',
    [user_id, post_id, content]
  );
  return result.insertId;
};

// ─── Get comments for a post ───
export const getComments = async (postId) => {
  const [rows] = await pool.query(
    `SELECT c.*, u.username, u.profile_pic
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.post_id = ?
     ORDER BY c.created_at ASC`,
    [postId]
  );
  return rows;
};

// ─── Get club posts ───
export const getClubPosts = async (clubId, userId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `SELECT p.*, u.username, u.profile_pic,
       (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
       (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count,
       EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ?) AS is_liked
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.club_id = ?
     ORDER BY p.created_at DESC
     LIMIT ? OFFSET ?`,
    [userId, clubId, limit, offset]
  );
  return rows;
};

// ─── Delete post ───
export const deletePost = async (postId, userId) => {
  const [result] = await pool.query(
    'DELETE FROM posts WHERE id = ? AND user_id = ?', [postId, userId]
  );
  return result.affectedRows > 0;
};
