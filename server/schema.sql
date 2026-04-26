-- ============================================================
-- CampusLink Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS campuslink;
USE campuslink;

-- ======================== USERS ========================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student','faculty','club_admin','admin') DEFAULT 'student',
  profile_pic VARCHAR(500) DEFAULT '/uploads/default-avatar.png',
  cover_pic VARCHAR(500) DEFAULT '/uploads/default-cover.jpg',
  bio VARCHAR(500) DEFAULT '',
  city VARCHAR(100) DEFAULT '',
  is_online BOOLEAN DEFAULT FALSE,
  last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================== STUDENTS ========================
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  department VARCHAR(100) DEFAULT '',
  year INT DEFAULT 1,
  enrollment_no VARCHAR(50) DEFAULT '',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ======================== FACULTIES ========================
CREATE TABLE faculties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  department VARCHAR(100) DEFAULT '',
  designation VARCHAR(100) DEFAULT '',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ======================== FRIENDS ========================
CREATE TABLE friends (
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, friend_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ======================== FRIEND REQUESTS ========================
CREATE TABLE friend_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  status ENUM('pending','accepted','rejected') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_request (sender_id, receiver_id)
);

-- ======================== POSTS ========================
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  content TEXT,
  image VARCHAR(500) DEFAULT NULL,
  club_id INT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ======================== LIKES ========================
CREATE TABLE likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  UNIQUE KEY unique_like (user_id, post_id)
);

-- ======================== COMMENTS ========================
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- ======================== STORIES ========================
CREATE TABLE stories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  image VARCHAR(500) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME DEFAULT (CURRENT_TIMESTAMP + INTERVAL 24 HOUR),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ======================== CLUBS ========================
CREATE TABLE clubs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  cover_pic VARCHAR(500) DEFAULT '/uploads/default-club.jpg',
  created_by INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- ======================== CLUB MEMBERS ========================
CREATE TABLE club_members (
  club_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('admin','moderator','member') DEFAULT 'member',
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (club_id, user_id),
  FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add foreign key for posts.club_id after clubs table exists
ALTER TABLE posts ADD FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL;

-- ======================== GROUPS ========================
CREATE TABLE `groups` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  cover_pic VARCHAR(500) DEFAULT '/uploads/default-group.jpg',
  created_by INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- ======================== GROUP MEMBERS ========================
CREATE TABLE group_members (
  group_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('admin','member') DEFAULT 'member',
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (group_id, user_id),
  FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ======================== CHATS ========================
CREATE TABLE chats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('private','group') DEFAULT 'private',
  group_id INT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE SET NULL
);

-- ======================== CHAT PARTICIPANTS ========================
CREATE TABLE chat_participants (
  chat_id INT NOT NULL,
  user_id INT NOT NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (chat_id, user_id),
  FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ======================== MESSAGES ========================
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chat_id INT NOT NULL,
  sender_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ======================== ANONYMOUS MESSAGES (Campus Hub) ========================
CREATE TABLE anonymous_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  anonymous_alias VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  is_vanish BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_anon_messages_created ON anonymous_messages(created_at DESC);

-- ======================== NOTIFICATIONS ========================
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('like','comment','friend_request','friend_accept','message','club_invite','group_invite') NOT NULL,
  reference_id INT DEFAULT NULL,
  content VARCHAR(500) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ======================== INDEXES ========================
CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_posts_club ON posts(club_id);
CREATE INDEX idx_likes_post ON likes(post_id);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_messages_chat ON messages(chat_id);
CREATE INDEX idx_messages_created ON messages(created_at);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_friend_requests_receiver ON friend_requests(receiver_id, status);
CREATE INDEX idx_stories_expires ON stories(expires_at);

-- ======================== SEED DATA ========================
-- Insert a demo user (password: "password123" hashed with bcrypt)
INSERT INTO users (username, email, password, role, bio, city) VALUES
('demo_user', 'demo@campus.edu', '$2a$10$8KzaNdKIMyOkASIiy3JO5u0ALnOj6RqHnCB9UR9Gf.Y7jR0xIGy16', 'student', 'Hello! I am a CampusLink demo user.', 'Gandhinagar'),
('rajsoni', 'raj@campus.edu', '$2a$10$8KzaNdKIMyOkASIiy3JO5u0ALnOj6RqHnCB9UR9Gf.Y7jR0xIGy16', 'student', 'Developer & Creator of CampusLink', 'Gandhinagar'),
('prof_smith', 'smith@campus.edu', '$2a$10$8KzaNdKIMyOkASIiy3JO5u0ALnOj6RqHnCB9UR9Gf.Y7jR0xIGy16', 'faculty', 'Computer Science Professor', 'Ahmedabad');

INSERT INTO students (user_id, department, year, enrollment_no) VALUES
(1, 'Computer Science', 3, 'CS2023001'),
(2, 'Computer Science', 3, 'CS2023002');

INSERT INTO faculties (user_id, department, designation) VALUES
(3, 'Computer Science', 'Professor');

-- Make demo users friends
INSERT INTO friends (user_id, friend_id) VALUES (1, 2), (2, 1);

-- Sample posts
INSERT INTO posts (user_id, content, image) VALUES
(1, 'Welcome to CampusLink! 🎓 The best campus social network.', NULL),
(2, 'Excited to connect with fellow students! 🚀', NULL),
(3, 'Office hours are 2-4 PM every Tuesday and Thursday.', NULL);

-- Sample club
INSERT INTO clubs (name, description, created_by) VALUES
('Coding Club', 'Learn, build and collaborate on amazing projects!', 2);

INSERT INTO club_members (club_id, user_id, role) VALUES
(1, 2, 'admin'), (1, 1, 'member');

-- Sample group
INSERT INTO `groups` (name, description, created_by) VALUES
('CS Batch 2023', 'Official group for CS batch 2023 students', 2);

INSERT INTO group_members (group_id, user_id, role) VALUES
(1, 2, 'admin'), (1, 1, 'member');
