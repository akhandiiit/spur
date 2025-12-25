export async function sendMessage(message: string, sessionId?: string) {
  const res = await fetch("http://localhost:3001/chat/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  });

  return res.json();
}
