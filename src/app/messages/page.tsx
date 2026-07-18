"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { colors as C, fonts as F } from "@/lib/theme";

type Message = { id: string; fromType: string; fromName: string; content: string; createdAt: string };
type Thread = { id: string; advisorName: string; advisorRole: string; messages: Message[] };

export default function MessagesPage() {
  const router = useRouter();
  const [threads, setThreads] = useState<{ id: string; advisorName: string; advisorRole: string; messages: Message[] }[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [thread, setThread] = useState<Thread | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [mobileView, setMobileView] = useState<"threads" | "chat">("threads");
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = width <= 760;

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    fetch("/api/messages").then((r) => r.json()).then((d) => {
      if (d.error) { router.push("/login"); return; }
      setThreads(d.threads);
      if (d.threads[0]) setActiveId(d.threads[0].id);
    });
  }, [router]);

  useEffect(() => {
    if (!activeId) return;
    fetch(`/api/messages?threadId=${activeId}`).then((r) => r.json()).then((d) => {
      if (d.thread) setThread(d.thread);
    });
  }, [activeId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [thread]);

  const send = async () => {
    if (!input.trim() || sending || !activeId) return;
    setSending(true);
    const text = input;
    setInput("");
    // Optimistic update
    setThread((t) => t ? { ...t, messages: [...t.messages, { id: "tmp", fromType: "MEMBER", fromName: "You", content: text, createdAt: new Date().toISOString() }] } : t);
    try {
      const res = await fetch("/api/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId: activeId, content: text }),
      });
      const data = await res.json();
      if (data.reply) {
        // Refetch thread
        const r = await fetch(`/api/messages?threadId=${activeId}`);
        const d = await r.json();
        if (d.thread) setThread(d.thread);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <section style={{ background: "#f0f2f5", paddingTop: 64, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", height: "calc(100vh - 64px)", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "320px 1fr", background: "#fff" }}>
        <div style={{ borderRight: isMobile ? "none" : "1px solid #eee", overflow: "auto", background: "#fafafa", display: isMobile && mobileView === "chat" ? "none" : "block" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #eee" }}>
            <h3 style={{ fontFamily: F.serif, fontSize: 18, color: C.navy, margin: 0 }}>Messages</h3>
            <p style={{ fontFamily: F.sans, fontSize: 11, color: "#999", margin: "4px 0 0" }}>Direct line to your team</p>
          </div>
          {threads.map((t) => (
            <div key={t.id} onClick={() => { setActiveId(t.id); setMobileView("chat"); }} style={{
              padding: "14px 20px", cursor: "pointer",
              background: activeId === t.id ? "#fff" : "transparent",
              borderLeft: activeId === t.id ? `3px solid ${C.accent}` : "3px solid transparent",
              borderBottom: "1px solid #f5f5f5",
            }}>
              <div style={{ fontFamily: F.sans, fontSize: 13, color: C.navy, fontWeight: 700 }}>{t.advisorName}</div>
              <div style={{ fontFamily: F.sans, fontSize: 11, color: "#999" }}>{t.advisorRole}</div>
            </div>
          ))}
        </div>
        <div style={{ display: isMobile && mobileView === "threads" ? "none" : "flex", flexDirection: "column" }}>
          {thread && (
            <>
              <div style={{ padding: "14px 24px", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: 12 }}>
                {isMobile && (
                  <button onClick={() => setMobileView("threads")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#1B2A4A", padding: 4 }}>←</button>
                )}
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700 }}>
                  {thread.advisorName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontFamily: F.sans, fontSize: 14, color: C.navy, fontWeight: 700 }}>{thread.advisorName}</div>
                  <div style={{ fontFamily: F.sans, fontSize: 11, color: C.green }}>● Online</div>
                </div>
              </div>
              <div ref={scrollRef} style={{ flex: 1, overflow: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12, background: "#fafafa" }}>
                {thread.messages.map((m) => (
                  <div key={m.id} style={{ alignSelf: m.fromType === "MEMBER" ? "flex-end" : "flex-start", maxWidth: "75%" }}>
                    {m.fromType !== "MEMBER" && <div style={{ fontFamily: F.sans, fontSize: 10, color: "#999", marginBottom: 3 }}>{m.fromName}</div>}
                    <div style={{
                      background: m.fromType === "MEMBER" ? `linear-gradient(135deg, ${C.accent}, ${C.purple})` : "#fff",
                      color: m.fromType === "MEMBER" ? "#fff" : C.navy,
                      borderRadius: m.fromType === "MEMBER" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      padding: "10px 16px", fontSize: 13, lineHeight: 1.6,
                      boxShadow: m.fromType !== "MEMBER" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                    }}>{m.content}</div>
                  </div>
                ))}
                {sending && <div style={{ alignSelf: "flex-start", background: "#fff", borderRadius: "16px 16px 16px 4px", padding: "10px 16px", fontSize: 12, color: "#999" }}>{thread.advisorName} is typing...</div>}
              </div>
              <div style={{ padding: "12px 16px", borderTop: "1px solid #eee", display: "flex", gap: 8 }}>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a message..." disabled={sending} style={{ flex: 1, border: "1px solid #eee", borderRadius: 20, padding: "10px 18px", fontFamily: F.sans, fontSize: 13, outline: "none", background: "#f8f8f8" }} />
                <button onClick={send} disabled={sending || !input.trim()} style={{ background: sending || !input.trim() ? "#ddd" : `linear-gradient(135deg, ${C.accent}, ${C.purple})`, border: "none", borderRadius: 20, padding: "10px 20px", color: "#fff", fontSize: 13, fontWeight: 600 }}>Send</button>
              </div>
              <p style={{ fontFamily: F.sans, fontSize: 10, color: "#bbb", margin: 0, padding: "0 16px 12px", textAlign: "center" }}>Messages are encrypted. AI may assist advisors during off-hours.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
