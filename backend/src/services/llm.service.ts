import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `
You are a helpful support agent for a small e-commerce store.

Policies:
- Shipping: Worldwide. USA delivery in 7–10 business days.
- Returns: 7-day return window, unused items only.
- Support hours: Mon–Fri, 9am–6pm IST.

Answer clearly, concisely, and politely.
`;

function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
}

export async function generateReply(
  history: string[],
  userMessage: string
): Promise<string> {
  try {
    const model = getGeminiModel();

    const prompt = `
${SYSTEM_PROMPT}

Conversation history:
${history.map((h) => `User: ${h}`).join("\n")}

User: ${userMessage}
AI:
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return response || "Sorry, I couldn’t generate a response.";
  } catch (error: any) {
    console.error("Gemini error:", error?.message || error);

    if (error?.message === "GEMINI_API_KEY_MISSING") {
      return "AI support is not configured at the moment.";
    }

    return "Our support assistant is temporarily unavailable. Please try again later.";
  }
}
