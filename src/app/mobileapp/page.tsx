"use client";

import { colors as C, fonts as F } from "@/lib/theme";
import { useToast } from "@/components/ToastProvider";

export default function Page() {
  const toast = useToast();
  const notify = () => toast("Northern Birch Mobile is coming soon — join the waitlist from your dashboard.", "info");

  return (
    <section style={{ background: "linear-gradient(135deg, #0C1829, #1B2A4A)", minHeight: "100vh", padding: "120px 16px 80px", color: "#fff" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <span style={{ fontFamily: F.sans, fontSize: 11, color: C.birch, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Mobile App</span>
        <h1 style={{ fontFamily: F.serif, fontSize: 40, fontWeight: 700, margin: "16px 0" }}>Banking in your pocket</h1>
        <p style={{ fontFamily: F.sans, fontSize: 16, color: "rgba(255,255,255,0.7)", maxWidth: 500, margin: "0 auto 32px" }}>Check balances, transfer money, deposit cheques, manage insurance, and chat with our AI assistant — all from your phone.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={notify} style={{ background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", padding: "14px 28px", borderRadius: 12, fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: "#fff" }}>📱 App Store</button>
          <button onClick={notify} style={{ background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", padding: "14px 28px", borderRadius: 12, fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: "#fff" }}>🤖 Google Play</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginTop: 60, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
          {[["Biometric Login", "🔐"], ["Mobile Deposit", "📸"], ["Instant Transfers", "⚡"], ["AI Assistant", "🤖"], ["Card Controls", "💳"], ["Bill Pay", "📄"]].map(([f, i]) => (
            <div key={f} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{i}</div>
              <div style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 600 }}>{f}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
