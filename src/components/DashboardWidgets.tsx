"use client";

import { useState } from "react";
import { colors as C, fonts as F } from "@/lib/theme";
import { useToast } from "./ToastProvider";

export function TransferWidget({ accounts }: { accounts: any[] }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id ?? "");
  const [recipientName, setRecipientName] = useState("");
  const [recipientCity, setRecipientCity] = useState("");
  const [recipientCountry, setRecipientCountry] = useState("Latvia");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const RATE = 0.6821;
  const FEE = 4.99;
  const eur = amount ? (parseFloat(amount) * RATE).toFixed(2) : "0.00";

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/transfers", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromAccountId, recipientName, recipientCity, recipientCountry, amountCAD: parseFloat(amount), currency: "EUR" }),
      });
      const data = await res.json();
      if (!res.ok) { toast(data.error || "Transfer failed", "error"); }
      else {
        toast(`Transfer of C$${amount} to ${recipientName} initiated. Tracking: ${data.transfer.trackingId}`, "success");
        setOpen(false); setRecipientName(""); setRecipientCity(""); setAmount("");
      }
    } catch { toast("Connection error", "error"); }
    setSubmitting(false);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{ width: "100%", background: `${C.green}10`, border: `1px dashed ${C.green}`, borderRadius: 12, padding: 16, fontFamily: F.sans, fontSize: 13, color: C.green, fontWeight: 600, cursor: "pointer" }}>
        🌐 Send International Transfer
      </button>
    );
  }

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h4 style={{ fontFamily: F.sans, fontSize: 14, color: C.navy, fontWeight: 700, margin: 0 }}>International Transfer</h4>
        <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 16 }}>✕</button>
      </div>
      <select value={fromAccountId} onChange={(e) => setFromAccountId(e.target.value)} style={{ width: "100%", border: "1px solid #ddd", borderRadius: 8, padding: 10, fontFamily: F.sans, fontSize: 13, marginBottom: 10, boxSizing: "border-box", background: "#fff" }}>
        {accounts.filter((a) => Number(a.balance) > 0).map((a) => <option key={a.id} value={a.id}>{a.type.replace("_", " ")} - C${Number(a.balance).toFixed(2)}</option>)}
      </select>
      <input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Recipient name" style={{ width: "100%", border: "1px solid #ddd", borderRadius: 8, padding: 10, fontFamily: F.sans, fontSize: 13, marginBottom: 10, boxSizing: "border-box" }} />
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input value={recipientCity} onChange={(e) => setRecipientCity(e.target.value)} placeholder="City (e.g. Riga)" style={{ flex: 1, border: "1px solid #ddd", borderRadius: 8, padding: 10, fontFamily: F.sans, fontSize: 13, boxSizing: "border-box" }} />
        <select value={recipientCountry} onChange={(e) => setRecipientCountry(e.target.value)} style={{ flex: 1, border: "1px solid #ddd", borderRadius: 8, padding: 10, fontFamily: F.sans, fontSize: 13, background: "#fff" }}>
          <option>Latvia</option><option>Estonia</option><option>Lithuania</option><option>Germany</option>
        </select>
      </div>
      <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="Amount (CAD)" style={{ width: "100%", border: "1px solid #ddd", borderRadius: 8, padding: 10, fontFamily: F.sans, fontSize: 13, marginBottom: 10, boxSizing: "border-box" }} />
      {amount && (
        <div style={{ background: "#f8f8f8", borderRadius: 8, padding: 12, marginBottom: 12, fontFamily: F.sans, fontSize: 12, color: "#555" }}>
          Recipient gets <strong style={{ color: C.navy }}>€{eur}</strong> · Rate 1 CAD = {RATE} EUR · Fee C${FEE}
        </div>
      )}
      <button onClick={submit} disabled={submitting || !recipientName || !recipientCity || !amount} style={{ width: "100%", background: submitting || !recipientName || !amount ? "#ccc" : C.green, color: "#fff", border: "none", borderRadius: 10, padding: 12, fontFamily: F.sans, fontSize: 13, fontWeight: 700 }}>
        {submitting ? "Processing..." : "Send Transfer"}
      </button>
    </div>
  );
}

export function SpendingBreakdown({ transactions }: { transactions: any[] }) {
  const spending = transactions.filter((t) => Number(t.amount) < 0);
  const byCategory: Record<string, number> = {};
  spending.forEach((t) => {
    const cat = t.category || "Other";
    byCategory[cat] = (byCategory[cat] || 0) + Math.abs(Number(t.amount));
  });
  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const total = sorted.reduce((s, [, v]) => s + v, 0);
  const palette = [C.accent, C.green, C.amber, C.purple, C.red, C.navy];

  if (sorted.length === 0) return null;

  return (
    <div>
      {sorted.map(([cat, amt], i) => {
        const pct = (amt / total) * 100;
        return (
          <div key={cat} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontFamily: F.sans, fontSize: 12, color: C.navy }}>{cat}</span>
              <span style={{ fontFamily: F.sans, fontSize: 12, color: "#777", fontWeight: 600 }}>C${amt.toFixed(2)}</span>
            </div>
            <div style={{ height: 6, background: "#f0f0f0", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: palette[i % palette.length] }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CreditScoreGauge({ score, history }: { score: number; history: any[] }) {
  const pct = ((score - 300) / (900 - 300)) * 100;
  const rating = score >= 800 ? "Excellent" : score >= 740 ? "Very Good" : score >= 670 ? "Good" : score >= 580 ? "Fair" : "Poor";
  const color = score >= 740 ? C.green : score >= 670 ? C.amber : C.red;

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontFamily: F.serif, fontSize: 48, color, fontWeight: 700, lineHeight: 1 }}>{score}</div>
        <div style={{ fontFamily: F.sans, fontSize: 13, color, fontWeight: 600, marginTop: 4 }}>{rating}</div>
      </div>
      <div style={{ height: 8, background: "linear-gradient(90deg, #E74C3C, #D4A547, #27AE60)", borderRadius: 4, position: "relative", marginBottom: 16 }}>
        <div style={{ position: "absolute", left: `${pct}%`, top: -3, width: 14, height: 14, borderRadius: "50%", background: "#fff", border: `3px solid ${color}`, transform: "translateX(-50%)" }} />
      </div>
      {history && history.length > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: 40, gap: 4 }}>
          {history.map((h: any, i: number) => {
            const hpct = ((h.score - 700) / 200) * 100;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: "100%", height: Math.max(8, hpct * 0.35), background: `${color}40`, borderRadius: 3 }} />
                <span style={{ fontFamily: F.sans, fontSize: 9, color: "#bbb" }}>{h.score}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
