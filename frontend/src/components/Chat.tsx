import { useState, useRef, useEffect } from "react";
import { sendMessage } from "../api";

type Msg = { sender: "user" | "ai"; text: string };

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const submit = async () => {
    if (!input.trim() || loading) return;

    setMessages(m => [...m, { sender: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage(input, sessionId);
      setSessionId(res.sessionId);
      setMessages(m => [...m, { sender: "ai", text: res.reply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>💬 Spur Support</div>

      <div style={styles.chatBox}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.messageRow,
              justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                ...styles.bubble,
                ...(m.sender === "user"
                  ? styles.userBubble
                  : styles.aiBubble),
              }}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.messageRow, justifyContent: "flex-start" }}>
            <div style={{ ...styles.bubble, ...styles.aiBubble }}>
              <i>Agent is typing…</i>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div style={styles.inputBar}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="Type your message…"
          style={styles.input}
        />
        <button onClick={submit} disabled={loading} style={styles.sendBtn}>
          Send
        </button>
      </div>
    </div>
  );
}
const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    width: 380,
    margin: "60px auto",
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
  },

  header: {
    padding: "14px 16px",
    borderBottom: "1px solid #eee",
    fontWeight: 600,
    background: "#f9fafb",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  chatBox: {
    padding: 16,
    height: 360,
    overflowY: "auto",
    background: "#f5f7fa",
  },

  messageRow: {
    display: "flex",
    marginBottom: 10,
  },

  bubble: {
    maxWidth: "75%",
    padding: "10px 14px",
    borderRadius: 16,
    fontSize: 14,
    lineHeight: 1.4,
  },

  userBubble: {
    background: "#2563eb",
    color: "#fff",
    borderBottomRightRadius: 4,
  },

  aiBubble: {
    background: "#e5e7eb",
    color: "#111827",
    borderBottomLeftRadius: 4,
  },

  inputBar: {
    display: "flex",
    padding: 12,
    borderTop: "1px solid #eee",
    background: "#fff",
  },

  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: 14,
  },

  sendBtn: {
    marginLeft: 8,
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 500,
    cursor: "pointer",
    opacity: 1,
  },
};
