import Link from "next/link";
import { colors as C, fonts as F } from "@/lib/theme";

const FEATURES = [{ name: "Business Banking", desc: "Chequing, savings, and lending built for small business.", icon: "\ud83c\udfe6" }, { name: "Group Benefits", desc: "Health, dental, and vision plans via Manulife for 2-50 employees.", icon: "\ud83d\udc65" }, { name: "Commercial Insurance", desc: "Property, liability, and business interruption via Co-operators.", icon: "\ud83c\udfed" }, { name: "Key Person Insurance", desc: "Protect your business from the loss of critical talent.", icon: "\ud83d\udd11" }, { name: "Payroll Solutions", desc: "Integrated payroll and direct deposit for your team.", icon: "\ud83d\udcbc" }, { name: "Merchant Services", desc: "Accept payments in-store and online.", icon: "\ud83d\udcb3" }];

export default function Page() {
  return (
    <div style={{ background: C.cream, paddingTop: 64 }}>
      <section style={{ background: "linear-gradient(135deg, #0C1829, #1B2A4A)", color: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: C.birch, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Business Solutions</span>
          <h1 style={{ fontFamily: F.serif, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, margin: "16px 0" }}>Everything your business needs</h1>
          <p style={{ fontFamily: F.sans, fontSize: 16, color: "rgba(255,255,255,0.7)", maxWidth: 600, margin: "0 auto 32px" }}>Banking, group benefits, and commercial insurance for Toronto's entrepreneurs.</p>
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
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "#D4A54715", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16 }}>{f.icon}</div>
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
