import Database from "better-sqlite3";

export const db = new Database("chat.db");

db.exec(`
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT,
  sender TEXT,
  text TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);
