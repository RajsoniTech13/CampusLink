import pool from '../config/db.js';

// ─── Create group ───
export const createGroup = async ({ name, description, cover_pic, created_by }) => {
  const [result] = await pool.query(
    'INSERT INTO `groups` (name, description, cover_pic, created_by) VALUES (?, ?, ?, ?)',
    [name, description || '', cover_pic || '/uploads/default-group.jpg', created_by]
  );
  // Auto-add creator as admin
  await pool.query(
    'INSERT INTO group_members (group_id, user_id, role) VALUES (?, ?, "admin")',
    [result.insertId, created_by]
  );
  // Create associated group chat
  const [chat] = await pool.query(
    'INSERT INTO chats (type, group_id) VALUES ("group", ?)',
    [result.insertId]
  );
  await pool.query(
    'INSERT INTO chat_participants (chat_id, user_id) VALUES (?, ?)',
    [chat.insertId, created_by]
  );
  return result.insertId;
};

// ─── List groups ───
export const getAllGroups = async (userId) => {
  const [rows] = await pool.query(
    `SELECT g.*,
       (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) AS member_count,
       EXISTS(SELECT 1 FROM group_members WHERE group_id = g.id AND user_id = ?) AS is_member,
       u.username AS creator_name
     FROM \`groups\` g
     JOIN users u ON g.created_by = u.id
     ORDER BY g.created_at DESC`,
    [userId]
  );
  return rows;
};

// ─── Get group by ID ───
export const getGroupById = async (groupId, userId) => {
  const [rows] = await pool.query(
    `SELECT g.*,
       (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) AS member_count,
       EXISTS(SELECT 1 FROM group_members WHERE group_id = g.id AND user_id = ?) AS is_member,
       u.username AS creator_name
     FROM \`groups\` g
     JOIN users u ON g.created_by = u.id
     WHERE g.id = ?`,
    [userId, groupId]
  );
  return rows[0];
};

// ─── Join group ───
export const joinGroup = async (groupId, userId) => {
  await pool.query(
    'INSERT IGNORE INTO group_members (group_id, user_id) VALUES (?, ?)',
    [groupId, userId]
  );
  // Add user to group chat
  const [chat] = await pool.query('SELECT id FROM chats WHERE group_id = ?', [groupId]);
  if (chat.length > 0) {
    await pool.query(
      'INSERT IGNORE INTO chat_participants (chat_id, user_id) VALUES (?, ?)',
      [chat[0].id, userId]
    );
  }
};

// ─── Leave group ───
export const leaveGroup = async (groupId, userId) => {
  await pool.query(
    'DELETE FROM group_members WHERE group_id = ? AND user_id = ? AND role != "admin"',
    [groupId, userId]
  );
};

// ─── Get members ───
export const getMembers = async (groupId) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.username, u.profile_pic, gm.role
     FROM group_members gm
     JOIN users u ON gm.user_id = u.id
     WHERE gm.group_id = ?`,
    [groupId]
  );
  return rows;
};
