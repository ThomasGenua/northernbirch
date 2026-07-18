"use client";

import { useState } from "react";
import Link from "next/link";
import { colors as C, fonts as F } from "@/lib/theme";

const PRODUCTS = [
  { cat: "Life & Health", color: C.accent, items: [
    { name: "Term Life Insurance", provider: "CUMIS", desc: "Affordable coverage for a set term. From C$25/month.", icon: "❤️" },
    { name: "Permanent Life", provider: "CUMIS", desc: "Lifelong protection with cash value accumulation.", icon: "🛡️" },
    { name: "Critical Illness", provider: "CUMIS", desc: "Lump-sum payout on diagnosis of 25+ conditions.", icon: "🏥" },
    { name: "Disability Insurance", provider: "CUMIS", desc: "Income protection if you can't work.", icon: "🦽" },
  ]},
  { cat: "Property & Auto", color: C.green, items: [
    { name: "Home Insurance", provider: "The Personal", desc: "Exclusive group rates for NBCU members.", icon: "🏠" },
    { name: "Auto Insurance", provider: "The Personal", desc: "Save with bundled home + auto coverage.", icon: "🚗" },
    { name: "Tenant Insurance", provider: "The Personal", desc: "Protect your belongings as a renter.", icon: "🔑" },
    { name: "Co-op Apartment Insurance", provider: "The Personal", desc: "Specialized coverage for co-op structures. NBCU exclusive.", icon: "🏢" },
  ]},
  { cat: "Travel & Specialty", color: C.purple, items: [
    { name: "Travel Insurance", provider: "CUMIS", desc: "Emergency medical, trip cancellation. Baltic-focused.", icon: "✈️" },
    { name: "Pet Insurance", provider: "The Personal", desc: "Veterinary coverage for your furry family.", icon: "🐾" },
    { name: "Mortgage Protection", provider: "CUMIS", desc: "Pays off your mortgage if the unexpected happens.", icon: "🏡" },
  ]},
  { cat: "Business", color: C.amber, items: [
    { name: "Group Benefits", provider: "Manulife", desc: "Health, dental, vision for your employees.", icon: "👥" },
    { name: "Commercial Property", provider: "Co-operators", desc: "Protect your business premises and assets.", icon: "🏭" },
    { name: "Key Person Insurance", provider: "CUMIS", desc: "Protect your business from the loss of key talent.", icon: "🔑" },
  ]},
];

export default function InsurancePage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div style={{ background: C.cream, paddingTop: 64 }}>
      <section style={{ background: `linear-gradient(135deg, ${C.dark}, ${C.navy})`, color: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: C.birch, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Insurance Distribution</span>
          <h1 style={{ fontFamily: F.serif, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, margin: "16px 0" }}>Comprehensive protection for every stage of life</h1>
          <p style={{ fontFamily: F.sans, fontSize: 16, color: "rgba(255,255,255,0.7)", maxWidth: 600, margin: "0 auto 32px" }}>From your first apartment to your family legacy. Backed by The Personal, CUMIS, and Manulife.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/quote" style={{ background: C.birch, color: C.dark, padding: "14px 28px", borderRadius: 10, fontFamily: F.sans, fontSize: 14, fontWeight: 700 }}>Get a Quote</Link>
            <Link href="/ai-advisor" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "14px 28px", borderRadius: 10, fontFamily: F.sans, fontSize: 14, fontWeight: 600 }}>Ask the AI Advisor</Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {PRODUCTS.map((group) => (
            <div key={group.cat} style={{ marginBottom: 48 }}>
              <h2 style={{ fontFamily: F.serif, fontSize: 26, color: C.navy, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 4, height: 28, background: group.color, borderRadius: 2 }} />{group.cat}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                {group.items.map((item) => (
                  <div key={item.name} onClick={() => setExpanded(expanded === item.name ? null : item.name)} style={{ background: "#fff", borderRadius: 16, padding: 24, border: `1px solid ${expanded === item.name ? group.color : "#eee"}`, cursor: "pointer", transition: "all 0.2s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${group.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14 }}>{item.icon}</div>
                      <span style={{ fontFamily: F.sans, fontSize: 10, color: group.color, background: `${group.color}10`, padding: "3px 8px", borderRadius: 6, fontWeight: 700 }}>{item.provider}</span>
                    </div>
                    <h3 style={{ fontFamily: F.sans, fontSize: 16, color: C.navy, fontWeight: 700, margin: "0 0 6px" }}>{item.name}</h3>
                    <p style={{ fontFamily: F.sans, fontSize: 13, color: "#777", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                    {expanded === item.name && (
                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
                        <Link href="/quote" style={{ display: "inline-block", background: group.color, color: "#fff", padding: "8px 16px", borderRadius: 8, fontFamily: F.sans, fontSize: 12, fontWeight: 600, marginRight: 8 }}>Get Quote</Link>
                        <Link href="/booking" style={{ display: "inline-block", background: "#f5f5f5", color: C.navy, padding: "8px 16px", borderRadius: 8, fontFamily: F.sans, fontSize: 12, fontWeight: 600 }}>Talk to Advisor</Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
