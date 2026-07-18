"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { colors as C, fonts as F } from "@/lib/theme";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; message: string; type: ToastType };
type ToastContextValue = (message: string, type?: ToastType) => void;

const ToastContext = createContext<ToastContextValue>(() => {});

export function useToast() { return useContext(ToastContext); }

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div style={{ position: "fixed", top: 80, right: 24, zIndex: 3000, display: "flex", flexDirection: "column", gap: 10 }}>
        {toasts.map((t) => (
          <div key={t.id} style={{
            background: "#fff", borderRadius: 12, padding: "14px 20px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            borderLeft: `4px solid ${t.type === "success" ? C.green : t.type === "error" ? C.red : C.accent}`,
            minWidth: 280, maxWidth: 380, display: "flex", alignItems: "center", gap: 10,
            fontFamily: F.sans, animation: "nbSlideIn 0.3s ease-out",
          }}>
            <span style={{ fontSize: 16 }}>{t.type === "success" ? "✓" : t.type === "error" ? "⚠" : "ℹ"}</span>
            <span style={{ fontSize: 13, color: C.navy, flex: 1, lineHeight: 1.5 }}>{t.message}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes nbSlideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </ToastContext.Provider>
  );
}
