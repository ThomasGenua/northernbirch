import { colors as C, fonts as F } from "@/lib/theme";

const BRANCHES = [
  { name: "Latvian Centre Branch", addr: "4 Credit Union Drive, North York, ON M4A 2N8", phone: "416-465-4659", hours: "Mon-Fri 10-3, Thu 10-7, Sat 9-1" },
  { name: "Tartu College Branch", addr: "310 Bloor Street West, Toronto, ON M5S 1W4", phone: "416-922-2551", hours: "Mon-Fri 10-3" },
  { name: "Hamilton Branch", addr: "16 Queen Street North, Hamilton, ON L8R 2T9", phone: "905-527-4344", hours: "Tue-Fri 10-3, Thu 10-7" },
  { name: "KESKUS Branch", addr: "Madison Avenue, Toronto (Coming 2026)", phone: "416-465-4659", hours: "Opening soon" },
];

export default function Page() {
  return (
    <section style={{ background: C.cream, padding: "120px 16px 80px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: C.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Contact & Branches</span>
          <h1 style={{ fontFamily: F.serif, fontSize: 36, color: C.navy, margin: "12px 0" }}>We&apos;re here for you</h1>
          <p style={{ fontFamily: F.sans, fontSize: 15, color: "#777" }}>Call 416-465-4659 · info@northernbirchcu.com</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {BRANCHES.map((b) => (
            <div key={b.name} style={{ background: "#fff", borderRadius: 20, padding: 24, border: "1px solid #eee" }}>
              <h3 style={{ fontFamily: F.serif, fontSize: 18, color: C.navy, margin: "0 0 12px" }}>{b.name}</h3>
              <p style={{ fontFamily: F.sans, fontSize: 13, color: "#777", lineHeight: 1.7, margin: "0 0 8px" }}>{b.addr}</p>
              <p style={{ fontFamily: F.sans, fontSize: 13, color: C.accent, fontWeight: 600, margin: "0 0 4px" }}>{b.phone}</p>
              <p style={{ fontFamily: F.sans, fontSize: 12, color: "#999", margin: 0 }}>{b.hours}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
