import Link from "next/link";
import { colors as C, fonts as F } from "@/lib/theme";

const SERVICES = [
  { title: "Insurance Distribution", desc: "Term life, critical illness, home, auto, travel via The Personal & CUMIS", href: "/insurance", icon: "🛡️", color: C.accent },
  { title: "AI Insurance Advisor", desc: "Get personalized recommendations powered by Claude AI", href: "/ai-advisor", icon: "🤖", color: C.purple },
  { title: "Travel & Transfers", desc: "International wires to Estonia, Latvia, and beyond", href: "/travel", icon: "✈️", color: C.green },
  { title: "Business Solutions", desc: "Group benefits, commercial insurance, business banking", href: "/business", icon: "💼", color: C.amber },
  { title: "Digital Banking", desc: "Mobile-first experience with smart automation", href: "/digital", icon: "📱", color: C.navy },
  { title: "Estate Planning", desc: "Multi-generational wealth and family protection", href: "/estate", icon: "🏛️", color: C.red },
];

const STATS = [
  { value: "70+", label: "Years of Heritage" },
  { value: "4", label: "Branches incl. KESKUS" },
  { value: "12+", label: "Insurance Products" },
  { value: "24/7", label: "AI Advisor Available" },
];

export default function Home() {
  return (
    <div style={{ background: C.cream }}>
      {/* Hero */}
      <section style={{
        minHeight: "100vh", background: `linear-gradient(135deg, ${C.dark}, ${C.navy})`,
        color: "#fff", display: "flex", alignItems: "center", padding: "120px 24px 80px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2, width: "100%" }}>
          <div style={{ display: "inline-block", padding: "6px 14px", background: "rgba(200,184,138,0.15)", borderRadius: 20, marginBottom: 20 }}>
            <span style={{ fontFamily: F.sans, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: C.birch, fontWeight: 700 }}>The Future of Member Financial Wellness</span>
          </div>
          <h1 style={{ fontFamily: F.serif, fontSize: "clamp(2rem, 6vw, 5rem)", fontWeight: 700, lineHeight: 1.05, marginBottom: 24 }}>
            Your whole financial life.<br /><span style={{ color: C.birch, fontStyle: "italic" }}>Under one Birch.</span>
          </h1>
          <p style={{ fontFamily: F.sans, fontSize: 18, color: "rgba(255,255,255,0.7)", maxWidth: 700, lineHeight: 1.6, marginBottom: 36 }}>
            Insurance. Investments. International transfers. Estate planning. Business benefits. 70+ years of community trust.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/quote" style={{ background: C.birch, color: C.dark, padding: "16px 32px", borderRadius: 12, fontFamily: F.sans, fontSize: 14, fontWeight: 700 }}>Get an Insurance Quote</Link>
            <Link href="/ai-advisor" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", padding: "16px 32px", borderRadius: 12, fontFamily: F.sans, fontSize: 14, fontWeight: 600, border: "1px solid rgba(255,255,255,0.15)" }}>AI Insurance Advisor</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 24, marginTop: 80 }}>
            {STATS.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: F.serif, fontSize: 36, color: C.birch, fontWeight: 700 }}>{s.value}</div>
                <div style={{ fontFamily: F.sans, fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: "100px 24px", background: C.cream }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ fontFamily: F.sans, fontSize: 11, color: C.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Comprehensive Financial Services</span>
            <h2 style={{ fontFamily: F.serif, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: C.navy, margin: "12px 0 16px", fontWeight: 700 }}>Everything your members need</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {SERVICES.map((s) => (
              <Link key={s.href} href={s.href as never} style={{ background: "#fff", borderRadius: 20, padding: 32, border: "1px solid #eee", display: "block" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 20 }}>{s.icon}</div>
                <h3 style={{ fontFamily: F.serif, fontSize: 20, color: C.navy, margin: "0 0 8px" }}>{s.title}</h3>
                <p style={{ fontFamily: F.sans, fontSize: 14, color: "#777", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* For Leadership Banner */}
      <section style={{ padding: "60px 24px", background: C.navy }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", color: "#fff" }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: C.birch, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>For Northern Birch Leadership</span>
          <h2 style={{ fontFamily: F.serif, fontSize: 28, margin: "12px 0 16px" }}>The business case for digital transformation</h2>
          <p style={{ fontFamily: F.sans, fontSize: 14, color: "rgba(255,255,255,0.7)", margin: "0 auto 24px", maxWidth: 600 }}>
            5-year revenue projection of C$4.05M against 3-year cost of C$56K. Pro bono technology partnership with Oodler.
          </p>
          <Link href="/leadership" style={{ display: "inline-block", background: C.birch, color: C.dark, padding: "14px 32px", borderRadius: 12, fontFamily: F.sans, fontSize: 13, fontWeight: 700 }}>View Business Case →</Link>
        </div>
      </section>
    </div>
  );
}
