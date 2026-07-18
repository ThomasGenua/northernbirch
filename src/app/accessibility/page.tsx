import { colors as C, fonts as F } from "@/lib/theme";

const SECTIONS = [{ title: "Our Commitment", body: "We are committed to meeting the accessibility needs of people with disabilities in a timely manner, and to treating all members with dignity and independence." }, { title: "Digital Accessibility", body: "Our website and mobile app are designed to meet WCAG 2.1 Level AA standards. This includes keyboard navigation, screen reader compatibility, sufficient color contrast, resizable text, and descriptive labels." }, { title: "Branch Accessibility", body: "Our branches provide accessible service. We welcome service animals and support persons. Alternative formats of documents are available on request." }, { title: "Feedback", body: "We welcome feedback on the accessibility of our services. Contact us at accessibility@northernbirchcu.com or 416-465-4659. We will respond and address concerns promptly." }, { title: "Accommodations", body: "If you require accommodation to access any of our services, please let us know. We will work with you to meet your needs, including providing information in alternative formats." }];

export default function Page() {
  return (
    <section style={{ background: C.cream, padding: "120px 16px 80px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: C.navy, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Accessibility</span>
          <h1 style={{ fontFamily: F.serif, fontSize: 34, color: C.navy, margin: "12px 0 16px" }}>Accessible banking for everyone</h1>
          <p style={{ fontFamily: F.sans, fontSize: 15, color: "#555", lineHeight: 1.8 }}>Northern Birch Credit Union is committed to providing accessible services in accordance with the Accessibility for Ontarians with Disabilities Act (AODA) and the Integrated Accessibility Standards Regulation.</p>
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
