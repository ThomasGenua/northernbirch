"use client";

import { useState } from "react";
import { colors as C, fonts as F } from "@/lib/theme";
import type { AIFeature } from "@/types";

type Props = {
  feature: AIFeature;
  title: string;
  tag: string;
  description: string;
  placeholder: string;
  color: string;
  examples?: { label: string; prompt: string }[];
};

export default function AIFeaturePage({ feature, title, tag, description, placeholder, color, examples }: Props) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const send = async (text?: string) => {
    const content = text ?? input;
    if (!content.trim() || loading) return;
    setLoading(true); setError(""); setResult("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature, messages: [{ role: "user", content }], maxTokens: 1000 }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); }
      else { setResult(data.reply); }
    } catch { setError("Connection error"); }
    setLoading(false);
  };

  return (
    <section style={{ background: C.cream, padding: "120px 16px 80px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>{tag}</span>
          <h1 style={{ fontFamily: F.serif, fontSize: 36, color: C.navy, margin: "12px 0 12px" }}>{title}</h1>
          <p style={{ fontFamily: F.sans, fontSize: 14, color: "#777", maxWidth: 600, margin: "0 auto" }}>{description}</p>
        </div>

        {!result && examples && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 24 }}>
            {examples.map((ex) => (
              <button key={ex.label} onClick={() => { setInput(ex.prompt); send(ex.prompt); }} style={{
                background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 16, textAlign: "left",
              }}>
                <div style={{ fontFamily: F.sans, fontSize: 13, color: C.navy, fontWeight: 700, marginBottom: 4 }}>{ex.label}</div>
                <div style={{ fontFamily: F.sans, fontSize: 11, color: "#999" }}>{ex.prompt}</div>
              </button>
            ))}
          </div>
        )}

        {!result && (
          <div style={{ background: "#fff", borderRadius: 24, padding: 24, border: "1px solid #eee" }}>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder} rows={5} style={{
              width: "100%", border: "1px solid #eee", borderRadius: 12, padding: 14, fontFamily: F.sans, fontSize: 14, resize: "vertical", outline: "none",
            }} />
            {error && <div style={{ background: `${C.red}10`, color: C.red, padding: 12, borderRadius: 8, fontSize: 13, marginTop: 12 }}>{error}</div>}
            <button onClick={() => send()} disabled={loading || !input.trim()} style={{
              marginTop: 12, background: loading || !input.trim() ? "#ccc" : color, color: "#fff",
              border: "none", borderRadius: 10, padding: "12px 32px", fontFamily: F.sans, fontSize: 14, fontWeight: 700,
            }}>{loading ? "Analyzing..." : "Get Analysis"}</button>
          </div>
        )}

        {result && (
          <div>
            <div style={{ background: "#fff", borderRadius: 24, padding: 32, border: "1px solid #eee", marginBottom: 16 }}>
              <div style={{ fontFamily: F.sans, fontSize: 14, color: "#555", lineHeight: 1.85, whiteSpace: "pre-wrap" }}>{result}</div>
            </div>
            <button onClick={() => { setResult(""); setInput(""); }} style={{
              background: "#fff", border: "1px solid #ddd", borderRadius: 10, padding: "10px 24px",
              fontFamily: F.sans, fontSize: 13, color: C.navy, fontWeight: 600,
            }}>Try Another Question</button>
          </div>
        )}
      </div>
    </section>
  );
}
