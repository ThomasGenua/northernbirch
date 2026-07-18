"use client";

import { useState, useRef, useEffect } from "react";
import { colors as C, fonts as F } from "@/lib/theme";

type Msg = { from: "user" | "bot"; text: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "👋 Hi! I'm Northern Birch's AI assistant. Ask me anything about insurance, banking, or your accounts." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Msg = { from: "user", text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: "CHAT",
          messages: newMessages.map((m) => ({ role: m.from === "user" ? "user" : "assistant", content: m.text })),
          maxTokens: 400,
        }),
      });
      const data = await res.json();
      setMessages((p) => [...p, { from: "bot", text: data.reply || "Sorry, I had trouble processing that." }]);
    } catch {
      setMessages((p) => [...p, { from: "bot", text: "I'm having trouble connecting. Please call 416-465-4659." }]);
    }
    setLoading(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)} style={{
        position: "fixed", bottom: 20, right: 20, width: 56, height: 56, borderRadius: "50%",
        background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, border: "none",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)", fontSize: 24, color: "#fff", zIndex: 800,
        display: open ? "none" : "flex", alignItems: "center", justifyContent: "center",
      }}>💬</button>
      {open && (
        <div style={{
          position: "fixed", bottom: 20, right: 20, width: 380, maxWidth: "calc(100vw - 32px)",
          height: 560, maxHeight: "calc(100vh - 80px)", background: "#fff", borderRadius: 20,
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column",
          zIndex: 800, overflow: "hidden", fontFamily: F.sans,
        }}>
          <div style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, padding: 16, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Northern Birch AI</div>
              <div style={{ fontSize: 11, opacity: 0.9 }}>Powered by Claude</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 30, height: 30, color: "#fff", fontSize: 16 }}>✕</button>
          </div>
          <div ref={scrollRef} style={{ flex: 1, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                background: m.from === "user" ? `linear-gradient(135deg, ${C.accent}, ${C.purple})` : "#f0f2f5",
                color: m.from === "user" ? "#fff" : C.navy, padding: "10px 14px",
                borderRadius: m.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                maxWidth: "80%", fontSize: 13, lineHeight: 1.5,
              }}>{m.text}</div>
            ))}
            {loading && <div style={{ alignSelf: "flex-start", background: "#f0f2f5", padding: "10px 14px", borderRadius: "16px 16px 16px 4px", fontSize: 13, color: "#999" }}>Thinking...</div>}
          </div>
          <div style={{ padding: 12, borderTop: "1px solid #eee", display: "flex", gap: 6 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask anything..." disabled={loading}
              style={{ flex: 1, border: "1px solid #eee", borderRadius: 18, padding: "8px 14px", fontSize: 13, outline: "none" }} />
            <button onClick={send} disabled={loading || !input.trim()} style={{ background: loading || !input.trim() ? "#ddd" : `linear-gradient(135deg, ${C.accent}, ${C.purple})`, border: "none", borderRadius: 18, padding: "8px 16px", color: "#fff", fontSize: 13, fontWeight: 600 }}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
