import pool from '../config/db.js';

// ─── Create club ───
export const createClub = async ({ name, description, cover_pic, created_by }) => {
  const [result] = await pool.query(
    'INSERT INTO clubs (name, description, cover_pic, created_by) VALUES (?, ?, ?, ?)',
    [name, description || '', cover_pic || '/uploads/default-club.jpg', created_by]
  );
  // Auto-add creator as admin member
  await pool.query(
    'INSERT INTO club_members (club_id, user_id, role) VALUES (?, ?, "admin")',
    [result.insertId, created_by]
  );
  return result.insertId;
};

// ─── List all clubs ───
export const getAllClubs = async (userId) => {
  const [rows] = await pool.query(
    `SELECT c.*,
       (SELECT COUNT(*) FROM club_members WHERE club_id = c.id) AS member_count,
       EXISTS(SELECT 1 FROM club_members WHERE club_id = c.id AND user_id = ?) AS is_member,
       u.username AS creator_name
     FROM clubs c
     JOIN users u ON c.created_by = u.id
     ORDER BY c.created_at DESC`,
    [userId]
  );
  return rows;
};

// ─── Get club by ID ───
export const getClubById = async (clubId, userId) => {
  const [rows] = await pool.query(
    `SELECT c.*,
       (SELECT COUNT(*) FROM club_members WHERE club_id = c.id) AS member_count,
       EXISTS(SELECT 1 FROM club_members WHERE club_id = c.id AND user_id = ?) AS is_member,
       u.username AS creator_name
     FROM clubs c
     JOIN users u ON c.created_by = u.id
     WHERE c.id = ?`,
    [userId, clubId]
  );
  return rows[0];
};

// ─── Join club ───
export const joinClub = async (clubId, userId) => {
  await pool.query(
    'INSERT IGNORE INTO club_members (club_id, user_id) VALUES (?, ?)',
    [clubId, userId]
  );
};

// ─── Leave club ───
export const leaveClub = async (clubId, userId) => {
  await pool.query(
    'DELETE FROM club_members WHERE club_id = ? AND user_id = ? AND role != "admin"',
    [clubId, userId]
  );
};

// ─── Get club members ───
export const getMembers = async (clubId) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.username, u.profile_pic, cm.role
     FROM club_members cm
     JOIN users u ON cm.user_id = u.id
     WHERE cm.club_id = ?`,
    [clubId]
  );
  return rows;
};

// ─── Search clubs ───
export const searchClubs = async (query, userId) => {
  const [rows] = await pool.query(
    `SELECT c.*,
       (SELECT COUNT(*) FROM club_members WHERE club_id = c.id) AS member_count,
       EXISTS(SELECT 1 FROM club_members WHERE club_id = c.id AND user_id = ?) AS is_member
     FROM clubs c
     WHERE c.name LIKE ?
     LIMIT 20`,
    [userId, `%${query}%`]
  );
  return rows;
};
