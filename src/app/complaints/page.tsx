import { colors as C, fonts as F } from "@/lib/theme";

const SECTIONS = [{ title: "Step 1: Contact Us", body: "Speak with a branch representative or call 416-465-4659. Most concerns are resolved at this stage. You can also email complaints@northernbirchcu.com." }, { title: "Step 2: Escalate to Management", body: "If your concern is not resolved, ask to escalate to a branch manager or our Member Experience team. We will acknowledge your complaint within 2 business days and aim to resolve it within 30 days." }, { title: "Step 3: Chief Executive Officer", body: "Unresolved complaints can be directed to the office of the CEO in writing. We will provide a final written response." }, { title: "External Resolution: Banking", body: "If you are not satisfied with our final response on a banking matter, you may contact the Ombudsman for Banking Services and Investments (OBSI) at 1-888-451-4519 or ombudsman@obsi.ca." }, { title: "External Resolution: Insurance", body: "For insurance-related complaints, you may contact the OmbudService for Life and Health Insurance (OLHI) at 1-888-295-8112, or the General Insurance OmbudService (GIO) for property and casualty matters." }, { title: "Regulatory Bodies", body: "You may also contact the Financial Services Regulatory Authority of Ontario (FSRA) at 1-800-668-0128, or the Financial Consumer Agency of Canada (FCAC) at 1-866-461-3222." }];

export default function Page() {
  return (
    <section style={{ background: C.cream, padding: "120px 16px 80px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: C.navy, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Complaint Resolution</span>
          <h1 style={{ fontFamily: F.serif, fontSize: 34, color: C.navy, margin: "12px 0 16px" }}>We're here to make things right</h1>
          <p style={{ fontFamily: F.sans, fontSize: 15, color: "#555", lineHeight: 1.8 }}>Northern Birch Credit Union takes complaints seriously. We have a clear process to resolve concerns fairly and promptly.</p>
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
