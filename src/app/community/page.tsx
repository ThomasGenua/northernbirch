import Link from "next/link";
import { colors as C, fonts as F } from "@/lib/theme";

const FEATURES = [{ name: "Member-Owned", desc: "Every member is an owner with a voice and a vote.", icon: "\ud83e\udd1d" }, { name: "Estonian & Latvian Roots", desc: "Serving the Baltic diaspora for three generations.", icon: "\ud83c\udf33" }, { name: "Community Events", desc: "Sponsoring cultural events and scholarships.", icon: "\ud83c\udfad" }, { name: "Local Decisions", desc: "Lending and decisions made here, not in a distant tower.", icon: "\ud83c\udfdb\ufe0f" }, { name: "KESKUS Partnership", desc: "Proud financial partner of the new Estonian centre.", icon: "\ud83c\udfe2" }, { name: "Profit Sharing", desc: "Surplus returned to members, not outside shareholders.", icon: "\ud83d\udcb0" }];

export default function Page() {
  return (
    <div style={{ background: C.cream, paddingTop: 64 }}>
      <section style={{ background: "linear-gradient(135deg, #0C1829, #1B2A4A)", color: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: C.birch, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Our Community</span>
          <h1 style={{ fontFamily: F.serif, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, margin: "16px 0" }}>70 years of trust</h1>
          <p style={{ fontFamily: F.sans, fontSize: 16, color: "rgba(255,255,255,0.7)", maxWidth: 600, margin: "0 auto 32px" }}>Founded in 1954 to serve Toronto's Estonian and Latvian communities. Still member-owned, still community-first.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/booking" style={{ background: C.birch, color: C.dark, padding: "14px 28px", borderRadius: 10, fontFamily: F.sans, fontSize: 14, fontWeight: 700 }}>Book an Appointment</Link>
            <Link href="/quote" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "14px 28px", borderRadius: 10, fontFamily: F.sans, fontSize: 14, fontWeight: 600 }}>Get a Quote</Link>
          </div>
        </div>
      </section>
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {FEATURES.map((f) => (
              <div key={f.name} style={{ background: "#fff", borderRadius: 20, padding: 28, border: "1px solid #eee" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "#27AE6015", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontFamily: F.sans, fontSize: 17, color: C.navy, fontWeight: 700, margin: "0 0 8px" }}>{f.name}</h3>
                <p style={{ fontFamily: F.sans, fontSize: 14, color: "#777", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
