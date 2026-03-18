import pool from '../config/db.js';

// ─── Find by ID ───
export const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, username, email, role, profile_pic, cover_pic, bio, city, is_online, last_seen, created_at
     FROM users WHERE id = ?`, [id]
  );
  return rows[0];
};

// ─── Find by email (includes password for login) ───
export const findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

// ─── Find by username ───
export const findByUsername = async (username) => {
  const [rows] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
  return rows[0];
};

// ─── Create user ───
export const createUser = async ({ username, email, password, role = 'student' }) => {
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [username, email, password, role]
  );
  return result.insertId;
};

// ─── Create student record ───
export const createStudent = async (userId, { department = '', year = 1, enrollment_no = '' }) => {
  await pool.query(
    'INSERT INTO students (user_id, department, year, enrollment_no) VALUES (?, ?, ?, ?)',
    [userId, department, year, enrollment_no]
  );
};

// ─── Create faculty record ───
export const createFaculty = async (userId, { department = '', designation = '' }) => {
  await pool.query(
    'INSERT INTO faculties (user_id, department, designation) VALUES (?, ?, ?)',
    [userId, department, designation]
  );
};

// ─── Update user ───
export const updateUser = async (id, fields) => {
  const allowed = ['username', 'bio', 'city', 'profile_pic', 'cover_pic'];
  const updates = [];
  const values = [];
  for (const key of allowed) {
    if (fields[key] !== undefined) {
      updates.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }
  if (updates.length === 0) return;
  values.push(id);
  await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
};

// ─── Search users ───
export const searchUsers = async (query, limit = 20) => {
  const [rows] = await pool.query(
    `SELECT id, username, profile_pic, role FROM users WHERE username LIKE ? LIMIT ?`,
    [`%${query}%`, limit]
  );
  return rows;
};

// ─── Update online status ───
export const setOnlineStatus = async (id, isOnline) => {
  await pool.query(
    'UPDATE users SET is_online = ?, last_seen = CURRENT_TIMESTAMP WHERE id = ?',
    [isOnline, id]
  );
};

// ─── Get user with student/faculty details ───
export const getFullProfile = async (id) => {
  const user = await findById(id);
  if (!user) return null;
  if (user.role === 'student' || user.role === 'club_admin') {
    const [rows] = await pool.query('SELECT department, year, enrollment_no FROM students WHERE user_id = ?', [id]);
    user.details = rows[0] || {};
  } else if (user.role === 'faculty') {
    const [rows] = await pool.query('SELECT department, designation FROM faculties WHERE user_id = ?', [id]);
    user.details = rows[0] || {};
  }
  // Friend count
  const [fc] = await pool.query('SELECT COUNT(*) as count FROM friends WHERE user_id = ?', [id]);
  user.friendCount = fc[0].count;
  // Post count
  const [pc] = await pool.query('SELECT COUNT(*) as count FROM posts WHERE user_id = ?', [id]);
  user.postCount = pc[0].count;
  return user;
};
