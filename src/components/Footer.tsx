import Link from "next/link";
import { colors as C, fonts as F } from "@/lib/theme";

export default function Footer() {
  const cols = [
    { title: "Personal", links: [["Insurance", "/insurance"], ["Travel & Transfers", "/travel"], ["Personal Banking", "/personal"], ["Get a Quote", "/quote"]] },
    { title: "Business", links: [["Business Solutions", "/business"], ["Group Benefits", "/business"], ["Commercial Insurance", "/business"]] },
    { title: "Tools", links: [["Quote Calculator", "/quote"], ["Compare Coverage", "/compare"], ["Claims Centre", "/claims"], ["Calculators", "/calculators"], ["Glossary", "/glossary"]] },
    { title: "Member", links: [["Dashboard", "/dashboard"], ["Messages", "/messages"], ["Book Appointment", "/booking"], ["Mobile App", "/mobileapp"]] },
    { title: "About", links: [["Community", "/community"], ["Contact & Branches", "/contact"], ["Rates", "/rates"], ["Blog", "/blog"], ["Business Case", "/leadership"]] },
    { title: "Legal", links: [["Privacy Policy", "/privacy"], ["Terms of Use", "/terms"], ["Accessibility", "/accessibility"], ["Complaints", "/complaints"]] },
  ];
  return (
    <footer style={{ background: C.dark, color: "#fff", padding: "60px 24px 30px" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 32, marginBottom: 40 }}>
          <div style={{ gridColumn: "span 2" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${C.birch}, ${C.navy})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>NB</span>
              </div>
              <div>
                <div style={{ fontFamily: F.serif, fontSize: 18, fontWeight: 700 }}>Northern Birch</div>
                <div style={{ fontFamily: F.sans, fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: 1, textTransform: "uppercase" }}>Credit Union</div>
              </div>
            </div>
            <p style={{ fontFamily: F.sans, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
              Toronto's heritage credit union since 1954. Now expanding into insurance, wealth, and digital services for the next generation.
            </p>
            <p style={{ fontFamily: F.sans, fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 16 }}>📞 416-465-4659<br />✉ info@northernbirchcu.com</p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: F.sans, fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, fontWeight: 700 }}>{col.title}</div>
              {col.links.map(([label, href]) => (
                <Link key={label} href={href as never} style={{ display: "block", fontFamily: F.sans, fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>{label}</Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontFamily: F.sans, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>© 2026 Northern Birch Credit Union Limited. FSRA Insured.</p>
          <p style={{ fontFamily: F.sans, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Insurance via The Personal, CUMIS, and Manulife. Authorized FSRA distributor.</p>
        </div>
      </div>
    </footer>
  );
}
