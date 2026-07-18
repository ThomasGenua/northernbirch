"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { colors as C, fonts as F } from "@/lib/theme";

export default function NotificationsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetch("/api/notifications").then((r) => r.json()).then((d) => {
        setNotes(d.notifications ?? []);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [open]);

  const markAllRead = async () => {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ markAllRead: true }) });
    setNotes((p) => p.map((n) => ({ ...n, read: true })));
  };

  const handleClick = async (n: any) => {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: [n.id] }) });
    if (n.actionUrl) { router.push(n.actionUrl); onClose(); }
  };

  if (!open) return null;
  const unread = notes.filter((n) => !n.read).length;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1500, background: "rgba(0,0,0,0.3)", display: "flex", justifyContent: "flex-end", alignItems: "flex-start", paddingTop: 64 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, boxShadow: "0 8px 40px rgba(0,0,0,0.15)", width: 420, maxWidth: "calc(100vw - 32px)", maxHeight: "calc(100vh - 100px)", margin: "0 24px", display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: F.sans }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3 style={{ fontFamily: F.serif, fontSize: 18, color: C.navy, margin: 0 }}>Notifications</h3>
            {unread > 0 && <span style={{ background: C.red, color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>{unread}</span>}
          </div>
          <button onClick={markAllRead} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: C.accent, fontWeight: 600 }}>Mark all read</button>
        </div>
        <div style={{ overflow: "auto", flex: 1 }}>
          {loading && <div style={{ padding: 40, textAlign: "center", fontSize: 13, color: "#999" }}>Loading...</div>}
          {!loading && notes.length === 0 && <div style={{ padding: 40, textAlign: "center", fontSize: 13, color: "#999" }}>All caught up!</div>}
          {notes.map((n) => (
            <div key={n.id} onClick={() => handleClick(n)} style={{ padding: "14px 20px", borderBottom: "1px solid #f5f5f5", cursor: "pointer", background: n.read ? "transparent" : `${C.accent}04`, display: "flex", gap: 12 }}>
              <div style={{ fontSize: 18, flexShrink: 0 }}>{n.iconKey ?? "🔔"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ fontSize: 13, color: C.navy, fontWeight: n.read ? 500 : 700, lineHeight: 1.4 }}>{n.title}</div>
                  {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent, flexShrink: 0, marginTop: 5 }} />}
                </div>
                <div style={{ fontSize: 12, color: "#777", marginTop: 4, lineHeight: 1.5 }}>{n.body}</div>
                {n.actionLabel && <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, marginTop: 6 }}>{n.actionLabel} →</div>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 20px", borderTop: "1px solid #f0f0f0", textAlign: "center" }}>
          <button onClick={() => { router.push("/dashboard"); onClose(); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: C.accent, fontWeight: 600 }}>View dashboard →</button>
        </div>
      </div>
    </div>
  );
}
