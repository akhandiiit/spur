const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function sendMessage(message: string, sessionId?: string) {
  const res = await fetch(`${BASE_URL}/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  });

  return res.json();
}
