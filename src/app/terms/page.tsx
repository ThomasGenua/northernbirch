import { colors as C, fonts as F } from "@/lib/theme";

const SECTIONS = [{ title: "Membership", body: "Membership in Northern Birch Credit Union is open to eligible individuals. Each member holds a membership share and has voting rights. Members are owners of the credit union." }, { title: "Account Services", body: "We provide chequing, savings, registered accounts, mortgages, lending, and investment services subject to applicable account agreements, rates, and fees disclosed separately." }, { title: "Insurance Distribution", body: "Northern Birch acts as a distributor of insurance products underwritten by licensed insurers. We are not the insurer. Coverage, claims, and policy terms are governed by the insurer's policy documents. We receive referral compensation disclosed in accordance with FSRA requirements." }, { title: "Investment Services", body: "Investment products are not deposits and are not guaranteed by deposit insurance. Self-directed trading carries risk of loss. Past performance does not guarantee future results. Consider your risk tolerance before investing." }, { title: "Electronic Communications", body: "By providing your contact information, you consent to receive electronic communications. Marketing communications comply with Canada's Anti-Spam Legislation (CASL) and require opt-in consent." }, { title: "Limitation of Liability", body: "We provide services with reasonable care but are not liable for losses arising from circumstances beyond our reasonable control, including market fluctuations on investment products." }];

export default function Page() {
  return (
    <section style={{ background: C.cream, padding: "120px 16px 80px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: C.navy, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Terms of Use</span>
          <h1 style={{ fontFamily: F.serif, fontSize: 34, color: C.navy, margin: "12px 0 16px" }}>Member agreement and disclosures</h1>
          <p style={{ fontFamily: F.sans, fontSize: 15, color: "#555", lineHeight: 1.8 }}>These terms govern your use of Northern Birch Credit Union's digital banking platform and services. By using our services, you agree to these terms.</p>
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
