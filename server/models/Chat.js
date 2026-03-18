import pool from '../config/db.js';

// ─── Get or create private chat ───
export const getOrCreatePrivateChat = async (userId1, userId2) => {
  // Find existing private chat between these two users
  const [existing] = await pool.query(
    `SELECT cp1.chat_id FROM chat_participants cp1
     JOIN chat_participants cp2 ON cp1.chat_id = cp2.chat_id
     JOIN chats c ON c.id = cp1.chat_id
     WHERE cp1.user_id = ? AND cp2.user_id = ? AND c.type = 'private'`,
    [userId1, userId2]
  );
  if (existing.length > 0) return existing[0].chat_id;

  // Create new private chat
  const [chat] = await pool.query('INSERT INTO chats (type) VALUES ("private")');
  await pool.query(
    'INSERT INTO chat_participants (chat_id, user_id) VALUES (?, ?), (?, ?)',
    [chat.insertId, userId1, chat.insertId, userId2]
  );
  return chat.insertId;
};

// ─── Get user's chats ───
export const getUserChats = async (userId) => {
  const [rows] = await pool.query(
    `SELECT c.id, c.type, c.group_id,
       g.name AS group_name, g.cover_pic AS group_pic,
       (SELECT content FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message,
       (SELECT created_at FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message_time,
       (SELECT sender_id FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_sender_id
     FROM chats c
     JOIN chat_participants cp ON c.id = cp.chat_id
     LEFT JOIN \`groups\` g ON c.group_id = g.id
     WHERE cp.user_id = ?
     ORDER BY last_message_time DESC`,
    [userId]
  );

  // For private chats, fetch the other participant's info
  for (const chat of rows) {
    if (chat.type === 'private') {
      const [participants] = await pool.query(
        `SELECT u.id, u.username, u.profile_pic, u.is_online, u.last_seen
         FROM chat_participants cp
         JOIN users u ON cp.user_id = u.id
         WHERE cp.chat_id = ? AND cp.user_id != ?`,
        [chat.id, userId]
      );
      chat.participant = participants[0] || null;
    }
  }
  return rows;
};

// ─── Get messages for a chat ───
export const getMessages = async (chatId, page = 1, limit = 50) => {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `SELECT m.*, u.username, u.profile_pic
     FROM messages m
     JOIN users u ON m.sender_id = u.id
     WHERE m.chat_id = ?
     ORDER BY m.created_at DESC
     LIMIT ? OFFSET ?`,
    [chatId, limit, offset]
  );
  return rows.reverse(); // Return chronological order
};

// ─── Save message ───
export const saveMessage = async ({ chat_id, sender_id, content }) => {
  const [result] = await pool.query(
    'INSERT INTO messages (chat_id, sender_id, content) VALUES (?, ?, ?)',
    [chat_id, sender_id, content]
  );
  // Return the full message with user info
  const [rows] = await pool.query(
    `SELECT m.*, u.username, u.profile_pic
     FROM messages m
     JOIN users u ON m.sender_id = u.id
     WHERE m.id = ?`,
    [result.insertId]
  );
  return rows[0];
};

// ─── Check if user is in chat ───
export const isParticipant = async (chatId, userId) => {
  const [rows] = await pool.query(
    'SELECT 1 FROM chat_participants WHERE chat_id = ? AND user_id = ?',
    [chatId, userId]
  );
  return rows.length > 0;
};

// ─── Get group chat ID ───
export const getGroupChatId = async (groupId) => {
  const [rows] = await pool.query('SELECT id FROM chats WHERE group_id = ?', [groupId]);
  return rows[0]?.id;
};
