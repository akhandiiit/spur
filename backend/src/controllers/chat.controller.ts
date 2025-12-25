import { Request, Response } from "express";
import { db } from "../db";
import { v4 as uuid } from "uuid";
import { generateReply } from "../services/llm.service";

export async function sendMessage(req: Request, res: Response) {
  const { message, sessionId } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  const conversationId = sessionId || uuid();

  db.prepare(
    "INSERT OR IGNORE INTO conversations (id) VALUES (?)"
  ).run(conversationId);

  db.prepare(
    "INSERT INTO messages VALUES (?, ?, ?, ?, datetime('now'))"
  ).run(uuid(), conversationId, "user", message);

  const history = db
    .prepare(
      "SELECT text FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT 10"
    )
    .all(conversationId)
    .map((m: any) => m.text)
    .reverse();

  const reply = await generateReply(history, message);

  db.prepare(
    "INSERT INTO messages VALUES (?, ?, ?, ?, datetime('now'))"
  ).run(uuid(), conversationId, "ai", reply);

  res.json({ reply, sessionId: conversationId });
}
