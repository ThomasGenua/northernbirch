import Link from "next/link";
import { colors as C, fonts as F } from "@/lib/theme";

const FEATURES = [{ name: "Chequing Accounts", desc: "No-fee everyday banking for members.", icon: "\ud83d\udcb3" }, { name: "High-Interest Savings", desc: "Earn 2.0% on your savings, no minimums.", icon: "\ud83d\udcc8" }, { name: "Mortgages", desc: "Competitive rates including co-op apartment financing.", icon: "\ud83c\udfe0" }, { name: "RRSP / TFSA / FHSA", desc: "Tax-advantaged registered accounts.", icon: "\ud83c\udfaf" }, { name: "Collabria Mastercard", desc: "Rewards credit cards with no annual fee options.", icon: "\ud83d\udc8e" }, { name: "Personal Loans", desc: "Flexible borrowing for life's moments.", icon: "\ud83d\udcb5" }];

export default function Page() {
  return (
    <div style={{ background: C.cream, paddingTop: 64 }}>
      <section style={{ background: "linear-gradient(135deg, #0C1829, #1B2A4A)", color: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: C.birch, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Personal Banking</span>
          <h1 style={{ fontFamily: F.serif, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, margin: "16px 0" }}>Banking that works for you</h1>
          <p style={{ fontFamily: F.sans, fontSize: 16, color: "rgba(255,255,255,0.7)", maxWidth: 600, margin: "0 auto 32px" }}>Everyday accounts, competitive savings, mortgages, and credit — with a human touch.</p>
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
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "#1B2A4A15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16 }}>{f.icon}</div>
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
