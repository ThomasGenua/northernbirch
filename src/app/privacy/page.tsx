import { colors as C, fonts as F } from "@/lib/theme";

const SECTIONS = [{ title: "Information We Collect", body: "We collect personal information necessary to provide banking and insurance services, including your name, contact details, date of birth, Social Insurance Number (where required by law), financial information, and identification documents for KYC compliance." }, { title: "How We Use Your Information", body: "Your information is used to provide and administer your accounts, assess insurance applications, comply with legal and regulatory obligations including FINTRAC requirements, prevent fraud, and (with your consent) offer relevant products and services." }, { title: "Insurance Referrals", body: "When you request insurance products, we share necessary information with our insurance partners (The Personal, CUMIS, Manulife) only with your explicit consent. You may withdraw consent at any time. Health information is collected and shared only with separate explicit consent." }, { title: "Data Storage and Security", body: "All member data is stored on servers located in Canada. We use bank-grade encryption, access controls, and continuous monitoring. We never sell your personal information to third parties." }, { title: "Your Rights", body: "You have the right to access your personal information, request corrections, withdraw consent for optional uses, and file a complaint. To exercise these rights, contact our Privacy Officer at privacy@northernbirchcu.com or 416-465-4659." }, { title: "Cookies", body: "Our digital banking platform uses essential cookies for security and session management. Optional analytics cookies require your consent. You can manage preferences through our cookie banner." }];

export default function Page() {
  return (
    <section style={{ background: C.cream, padding: "120px 16px 80px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: C.navy, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Privacy Policy</span>
          <h1 style={{ fontFamily: F.serif, fontSize: 34, color: C.navy, margin: "12px 0 16px" }}>How we protect your information</h1>
          <p style={{ fontFamily: F.sans, fontSize: 15, color: "#555", lineHeight: 1.8 }}>Northern Birch Credit Union is committed to protecting your personal information in accordance with Canada's Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial legislation.</p>
          <p style={{ fontFamily: F.sans, fontSize: 12, color: "#999", marginTop: 12 }}>Last updated: {new Date().toLocaleDateString("en-CA", { month: "long", year: "numeric" })}</p>
        </div>
        <div style={{ background: "#fff", borderRadius: 20, padding: 36, border: "1px solid #eee" }}>
          {SECTIONS.map((s, i) => (
            <div key={i} style={{ marginBottom: i < SECTIONS.length - 1 ? 28 : 0, paddingBottom: i < SECTIONS.length - 1 ? 28 : 0, borderBottom: i < SECTIONS.length - 1 ? "1px solid #f5f5f5" : "none" }}>
              <h2 style={{ fontFamily: F.serif, fontSize: 20, color: C.navy, margin: "0 0 10px" }}>{s.title}</h2>
              <p style={{ fontFamily: F.sans, fontSize: 14, color: "#555", lineHeight: 1.8, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
