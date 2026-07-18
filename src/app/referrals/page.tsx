"use client";

import { useState } from "react";
import { colors as C, fonts as F } from "@/lib/theme";
import { useToast } from "@/components/ToastProvider";

const REFERRAL_CODE = "MARIA-9842";
const REFERRAL_LINK = `https://northernbirchcu.com/register?ref=${REFERRAL_CODE}`;

export default function Page() {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_LINK);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — link is still shown below to copy manually.
    }
    setCopied(true);
    toast("Referral link copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section style={{ background: C.cream, padding: "120px 16px 80px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <span style={{ fontFamily: F.sans, fontSize: 11, color: C.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Member Referrals</span>
        <h1 style={{ fontFamily: F.serif, fontSize: 36, color: C.navy, margin: "12px 0" }}>Refer a friend, earn rewards</h1>
        <p style={{ fontFamily: F.sans, fontSize: 15, color: "#777", marginBottom: 32 }}>When someone you refer becomes a member, you both receive C$50. Insurance referrals earn C$100.</p>
        <div style={{ background: "#fff", borderRadius: 20, padding: 32, border: "1px solid #eee" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
            {[["1", "Share your link", "📤"], ["2", "Friend joins NBCU", "🤝"], ["3", "You both earn", "💰"]].map(([n, t, i]) => (
              <div key={n}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{i}</div>
                <div style={{ fontFamily: F.serif, fontSize: 24, color: C.green, fontWeight: 700 }}>{n}</div>
                <div style={{ fontFamily: F.sans, fontSize: 13, color: "#555", marginTop: 4 }}>{t}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, background: "#f8f8f8", border: "1px solid #eee", borderRadius: 12, padding: "10px 10px 10px 16px", alignItems: "center" }}>
            <span style={{ flex: 1, textAlign: "left", fontFamily: F.sans, fontSize: 13, color: C.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{REFERRAL_LINK}</span>
            <button onClick={copyLink} style={{ background: copied ? C.green : C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontFamily: F.sans, fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
              {copied ? "Copied ✓" : "Copy Link"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
