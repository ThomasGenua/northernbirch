"use client";

import { useState } from "react";
import Link from "next/link";
import { colors as C, fonts as F } from "@/lib/theme";

type Tab = "overview" | "costs" | "legal" | "roi" | "competitive" | "implementation";

export default function LeadershipPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "costs", label: "Costs" },
    { id: "legal", label: "Legal & Regulatory" },
    { id: "roi", label: "Value & ROI" },
    { id: "competitive", label: "Competitive Edge" },
    { id: "implementation", label: "Implementation" },
  ];

  return (
    <section style={{ background: C.cream, padding: "120px 16px 80px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: C.navy, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>For Northern Birch Leadership</span>
          <h1 style={{ fontFamily: F.serif, fontSize: 36, color: C.navy, margin: "12px 0 12px" }}>The business case for digital transformation</h1>
          <p style={{ fontFamily: F.sans, fontSize: 14, color: "#777", maxWidth: 640, margin: "0 auto" }}>Everything Anita Saar and the Board need to evaluate this partnership.</p>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 32, flexWrap: "wrap", justifyContent: "center" }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? C.navy : "#fff", color: tab === t.id ? "#fff" : C.navy, border: tab === t.id ? "none" : "1px solid #ddd", borderRadius: 10, padding: "10px 18px", fontFamily: F.sans, fontSize: 13, fontWeight: tab === t.id ? 700 : 500 }}>{t.label}</button>
          ))}
        </div>

        {tab === "overview" && <Overview />}
        {tab === "costs" && <Costs />}
        {tab === "legal" && <Legal />}
        {tab === "roi" && <ROI />}
        {tab === "competitive" && <Competitive />}
        {tab === "implementation" && <Implementation />}
      </div>
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ background: "#fff", borderRadius: 20, padding: 32, border: "1px solid #eee", marginBottom: 16 }}>{children}</div>;
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontFamily: F.serif, fontSize: 22, color: C.navy, margin: "0 0 16px" }}>{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontFamily: F.sans, fontSize: 14, color: "#555", lineHeight: 1.8, marginBottom: 12 }}>{children}</p>;
}

function Overview() {
  const metrics = [
    { v: "C$4.05M", l: "5-Year Net Revenue", c: C.green },
    { v: "C$56K", l: "3-Year Total Cost", c: C.accent },
    { v: "Day 1", l: "Profitable From", c: C.amber },
    { v: "1%", l: "Year 5 Cost-to-Revenue", c: C.purple },
  ];
  return (
    <>
      <Card>
        <H3>The Opportunity</H3>
        <P>Northern Birch offers zero insurance products. Every competitor of meaningful size — Desjardins, Meridian, DUCA, FirstOntario — offers insurance. NBCU members who need life, home, auto, or travel insurance must leave the credit union entirely.</P>
        <P>This platform adds insurance distribution, international transfers, AI-powered financial tools, estate planning, and business services — turning a ~$200M credit union into a comprehensive financial services provider that competes with institutions 100x its size.</P>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginTop: 24 }}>
          {metrics.map((m) => (
            <div key={m.l} style={{ background: `${m.c}06`, borderRadius: 16, padding: 20, textAlign: "center", borderTop: `3px solid ${m.c}` }}>
              <div style={{ fontFamily: F.serif, fontSize: 28, color: m.c, fontWeight: 700 }}>{m.v}</div>
              <div style={{ fontFamily: F.sans, fontSize: 11, color: "#888", marginTop: 4 }}>{m.l}</div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ background: `${C.navy}06`, borderRadius: 20, padding: 32, border: `1px solid ${C.navy}12` }}>
        <H3>What This Platform Demonstrates</H3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
          {["7 AI features powered by Claude (real conversations)", "Self-directed investing & managed portfolios", "Real-time insurance quote calculator", "Trilingual experience (EN/EST/LAT)", "International transfers with live FX", "Full Canadian regulatory compliance", "Credit score monitoring & budgeting", "Estate planning & business benefits"].map((f) => (
            <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color: C.green, fontSize: 14 }}>✓</span>
              <span style={{ fontFamily: F.sans, fontSize: 13, color: "#555", lineHeight: 1.6 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Costs() {
  const rows = [
    ["Oodler Technology & Consulting", "C$0", "C$0", "C$0", "C$0 (pro bono)", true],
    ["Insurance Partners", "C$0", "C$0", "C$0", "C$0", true],
    ["RIBO Licensing", "C$3,000", "C$2,000", "C$2,000", "C$7,000", false],
    ["One-Time Legal Counsel", "C$5,000", "-", "-", "C$5,000", false],
    ["Launch Marketing", "C$5,000", "C$3,000", "C$3,000", "C$11,000", false],
    ["E&O Insurance", "-", "C$2,500", "C$2,500", "C$5,000", false],
    ["Staff Time", "C$8,000", "C$10,000", "C$10,000", "C$28,000", false],
  ];
  return (
    <>
      <Card>
        <H3>What Northern Birch Actually Pays</H3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: F.sans, fontSize: 13 }}>
            <thead>
              <tr style={{ background: C.navy }}>
                {["Cost Item", "Year 1", "Year 2", "Year 3", "3-Yr Total"].map((h) => <th key={h} style={{ color: "#fff", padding: "12px 14px", textAlign: "left", fontWeight: 700 }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ background: r[5] ? `${C.green}06` : i % 2 ? "#fafafa" : "#fff" }}>
                  {r.slice(0, 5).map((cell, j) => <td key={j} style={{ padding: "10px 14px", color: r[5] ? C.green : C.navy, fontWeight: j === 4 || r[5] ? 700 : 400, borderBottom: "1px solid #f0f0f0" }}>{cell as string}</td>)}
                </tr>
              ))}
              <tr style={{ background: `${C.navy}08` }}>
                <td style={{ padding: "12px 14px", fontWeight: 700, color: C.navy }}>TOTAL</td>
                <td style={{ padding: "12px 14px", fontWeight: 700, color: C.navy }}>C$21,000</td>
                <td style={{ padding: "12px 14px", fontWeight: 700, color: C.navy }}>C$17,500</td>
                <td style={{ padding: "12px 14px", fontWeight: 700, color: C.navy }}>C$17,500</td>
                <td style={{ padding: "12px 14px", fontWeight: 700, color: C.navy }}>C$56,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
      <div style={{ background: `${C.green}08`, borderRadius: 16, padding: "20px 28px", borderLeft: `4px solid ${C.green}` }}>
        <P><strong style={{ color: C.navy }}>Bottom line:</strong> Total 3-year cost is C$56,000 for projected revenue of C$1.49M annually by Year 5. That&apos;s a 26x return. Profitable from Day 1 because both Oodler and the insurer provide services at no cost.</P>
      </div>
    </>
  );
}

function Legal() {
  const sections = [
    { title: "Insurance Distribution Model", color: C.accent, content: "Northern Birch becomes an insurance DISTRIBUTOR, not an insurance company. No underwriting risk, no claims liability, no insurance capital requirements, no impact on capital adequacy ratios.", items: ["No underwriting risk", "No claims liability", "No capital requirements", "No impact on capital ratios"] },
    { title: "FSRA (Ontario Regulator)", color: C.green, content: "FSRA permits credit unions to distribute insurance through referral arrangements or licensed subsidiaries. Start with referral (6-8 weeks, no RIBO license), then transition to RIBO subsidiary as volume grows.", items: ["Referral model: 6-8 weeks", "No RIBO license for referrals", "FSRA notification (not approval)", "Subsidiary as volume grows"] },
    { title: "RIBO (Broker Regulator)", color: C.amber, content: "Under referral, staff refer members to the insurer's licensed agents — no RIBO license needed. Under subsidiary, NBCU creates a RIBO-licensed entity. CUMIS and The Personal provide full navigation support.", items: ["Phase 1: Referral (no RIBO)", "Phase 2: Licensed subsidiary", "CUMIS provides guidance", "Annual fees ~C$2,000-3,000"] },
    { title: "PIPEDA (Privacy)", color: C.purple, content: "All member data handling complies with PIPEDA. Insurance referrals require consent. Members can opt out anytime. Health data requires explicit consent. All data stored in Canada.", items: ["Consent before data sharing", "Opt-out anytime", "Explicit health consent", "Data stored in Canada"] },
  ];
  return (
    <>
      {sections.map((s) => (
        <div key={s.title} style={{ background: "#fff", borderRadius: 20, padding: 32, border: "1px solid #eee", marginBottom: 16, borderLeft: `4px solid ${s.color}` }}>
          <h3 style={{ fontFamily: F.sans, fontSize: 18, color: C.navy, margin: "0 0 10px", fontWeight: 700 }}>{s.title}</h3>
          <P>{s.content}</P>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
            {s.items.map((item) => <div key={item} style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ color: s.color, fontSize: 12 }}>✓</span><span style={{ fontFamily: F.sans, fontSize: 13, color: "#555" }}>{item}</span></div>)}
          </div>
        </div>
      ))}
    </>
  );
}

function ROI() {
  const years = [["Year 1", "C$165K", "C$144K"], ["Year 2", "C$465K", "C$447K"], ["Year 3", "C$860K", "C$842K"], ["Year 4", "C$1.17M", "C$1.15M"], ["Year 5", "C$1.49M", "C$1.47M"]];
  return (
    <>
      <Card>
        <H3>Five-Year Revenue Projection</H3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: F.sans, fontSize: 13 }}>
            <thead><tr style={{ background: C.navy }}>{["Year", "Insurance Revenue", "Net Impact"].map((h) => <th key={h} style={{ color: "#fff", padding: "12px 14px", textAlign: "left" }}>{h}</th>)}</tr></thead>
            <tbody>
              {years.map((r, i) => (
                <tr key={i} style={{ background: i % 2 ? "#fafafa" : "#fff" }}>
                  <td style={{ padding: "10px 14px", color: C.navy, fontWeight: 600, borderBottom: "1px solid #f0f0f0" }}>{r[0]}</td>
                  <td style={{ padding: "10px 14px", color: C.navy, borderBottom: "1px solid #f0f0f0" }}>{r[1]}</td>
                  <td style={{ padding: "10px 14px", color: C.green, fontWeight: 700, borderBottom: "1px solid #f0f0f0" }}>{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <H3>The Real ROI: Member Retention</H3>
        <P>Members with 3+ products have 97%+ retention. Without insurance, retention drops to 60-70%. For a C$200M credit union, a 10% retention improvement preserves C$2-4M in deposits and lending revenue over 5 years — on top of insurance revenue.</P>
      </Card>
    </>
  );
}

function Competitive() {
  const diffs = [
    { title: "AI Insurance Advisor in Estonian & Latvian", desc: "No bank, credit union, or insurer in Canada has an AI advisor that speaks Estonian and Latvian with cultural context.", color: C.purple },
    { title: "Co-op Apartment Insurance", desc: "One of the few Ontario institutions with both co-op mortgage expertise AND co-op insurance products.", color: C.accent },
    { title: "Baltic Travel + Transfers", desc: "Annual multi-trip coverage for Baltic travel, combined with in-app transfers to Estonia and Latvia.", color: C.amber },
    { title: "Multi-Generational Intelligence", desc: "NBCU knows members' parents, children, and grandchildren across 70+ years. No big bank has this depth.", color: C.green },
  ];
  return (
    <Card>
      <H3>What No Competitor Can Replicate</H3>
      {diffs.map((d, i) => (
        <div key={d.title} style={{ padding: "16px 0", borderBottom: i < diffs.length - 1 ? "1px solid #f0f0f0" : "none" }}>
          <h4 style={{ fontFamily: F.sans, fontSize: 16, color: d.color, margin: "0 0 6px", fontWeight: 700 }}>{d.title}</h4>
          <P>{d.desc}</P>
        </div>
      ))}
    </Card>
  );
}

function Implementation() {
  const phases = [
    { phase: "Month 1-2", title: "Discovery & Partner Selection", color: C.accent },
    { phase: "Month 2-3", title: "Licensing & Compliance", color: C.green },
    { phase: "Month 3-6", title: "Phase 1: Creditor & Life Insurance", color: C.amber },
    { phase: "Month 6-10", title: "Phase 2: Home, Auto & Travel", color: C.purple },
    { phase: "Month 10-14", title: "Phase 3: Group Benefits & Digital", color: C.navy },
    { phase: "Month 14-18", title: "Optimization & RIBO Subsidiary", color: C.red },
  ];
  return (
    <>
      <Card>
        <H3>18-Month Implementation Roadmap</H3>
        {phases.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 20, marginBottom: i < phases.length - 1 ? 20 : 0, paddingBottom: i < phases.length - 1 ? 20 : 0, borderBottom: i < phases.length - 1 ? "1px solid #f0f0f0" : "none" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: p.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff", fontFamily: F.sans, fontWeight: 800 }}>{i + 1}</div>
            <div>
              <div style={{ fontFamily: F.sans, fontSize: 12, color: p.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{p.phase}</div>
              <h4 style={{ fontFamily: F.sans, fontSize: 16, color: C.navy, margin: "4px 0 0", fontWeight: 700 }}>{p.title}</h4>
            </div>
          </div>
        ))}
      </Card>
      <div style={{ textAlign: "center" }}>
        <Link href="/booking" style={{ display: "inline-block", background: C.green, color: "#fff", padding: "14px 32px", borderRadius: 12, fontFamily: F.sans, fontSize: 14, fontWeight: 700 }}>Schedule Strategic Meeting</Link>
      </div>
    </>
  );
}
