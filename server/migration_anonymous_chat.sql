-- Run this migration if you already have the campuslink database
-- This adds the anonymous_messages table for Campus Hub anonymous chat

USE campuslink;

CREATE TABLE IF NOT EXISTS anonymous_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  anonymous_alias VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  is_vanish BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_anon_messages_created ON anonymous_messages(created_at DESC);
