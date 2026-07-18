"use client";
import { useState } from "react";
import Link from "next/link";
import { colors as C, fonts as F } from "@/lib/theme";

const PLANS = {
  life: { name: "Term Life", tiers: [
    { tier: "Essential", price: "C$25/mo", coverage: "C$250K", features: ["20-year term", "Guaranteed renewable", "No medical for under 40"] },
    { tier: "Family", price: "C$45/mo", coverage: "C$500K", features: ["20-year term", "Child coverage included", "Living benefit rider"], popular: true },
    { tier: "Legacy", price: "C$78/mo", coverage: "C$1M", features: ["30-year term", "Convertible to permanent", "Critical illness rider"] },
  ]},
  home: { name: "Home", tiers: [
    { tier: "Basic", price: "C$85/mo", coverage: "C$400K", features: ["Named perils", "C$1M liability", "C$1,000 deductible"] },
    { tier: "Comprehensive", price: "C$142/mo", coverage: "C$650K", features: ["All risks", "C$2M liability", "Water damage included"], popular: true },
    { tier: "Premier", price: "C$210/mo", coverage: "C$1M", features: ["All risks + extended", "C$3M liability", "Guaranteed replacement"] },
  ]},
};

export default function ComparePage() {
  const [type, setType] = useState<"life" | "home">("life");
  const plan = PLANS[type];
  return (
    <section style={{ background: C.cream, padding: "120px 16px 80px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: C.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Compare Coverage</span>
          <h1 style={{ fontFamily: F.serif, fontSize: 36, color: C.navy, margin: "12px 0" }}>Find the right level of protection</h1>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 32 }}>
          {(["life", "home"] as const).map((t) => (
            <button key={t} onClick={() => setType(t)} style={{ background: type === t ? C.navy : "#fff", color: type === t ? "#fff" : C.navy, border: type === t ? "none" : "1px solid #ddd", borderRadius: 12, padding: "12px 24px", fontFamily: F.sans, fontSize: 13, fontWeight: 600 }}>{PLANS[t].name}</button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {plan.tiers.map((t) => (
            <div key={t.tier} style={{ background: "#fff", borderRadius: 20, padding: 28, border: t.popular ? `2px solid ${C.accent}` : "1px solid #eee", position: "relative" }}>
              {t.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: C.accent, color: "#fff", fontFamily: F.sans, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 12 }}>MOST POPULAR</div>}
              <div style={{ fontFamily: F.sans, fontSize: 14, color: "#999", fontWeight: 600 }}>{t.tier}</div>
              <div style={{ fontFamily: F.serif, fontSize: 32, color: C.navy, fontWeight: 700, margin: "8px 0" }}>{t.price}</div>
              <div style={{ fontFamily: F.sans, fontSize: 13, color: C.accent, fontWeight: 600, marginBottom: 16 }}>{t.coverage} coverage</div>
              {t.features.map((f) => <div key={f} style={{ display: "flex", gap: 8, marginBottom: 8 }}><span style={{ color: C.green }}>✓</span><span style={{ fontFamily: F.sans, fontSize: 13, color: "#555" }}>{f}</span></div>)}
              <Link href="/quote" style={{ display: "block", textAlign: "center", background: t.popular ? C.accent : "#f5f5f5", color: t.popular ? "#fff" : C.navy, padding: 12, borderRadius: 10, fontFamily: F.sans, fontSize: 13, fontWeight: 600, marginTop: 16 }}>Get This Plan</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
