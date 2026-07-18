"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { colors as C, fonts as F } from "@/lib/theme";

const TYPES = [
  { value: "HOME", label: "Home Insurance Claim", desc: "Property damage, theft, water damage, liability" },
  { value: "AUTO", label: "Auto Insurance Claim", desc: "Accident, collision, theft, vandalism" },
  { value: "TRAVEL", label: "Travel Insurance Claim", desc: "Emergency medical, trip cancellation, baggage" },
  { value: "LIFE", label: "Life / CI / Disability Claim", desc: "Death benefit, critical illness, disability" },
  { value: "MORTGAGE_PROTECTION", label: "Mortgage Protection Claim", desc: "Creditor life, disability, critical illness" },
  { value: "COMMERCIAL", label: "Commercial Insurance Claim", desc: "Business property, liability, business interruption" },
] as const;

export default function ClaimsPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [type, setType] = useState<string>("");
  const [description, setDescription] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [claimNumber, setClaimNumber] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/claims", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, description, incidentDate: incidentDate || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { router.push("/login"); return; }
        setError(data.error || "Failed to submit"); setSubmitting(false); return;
      }
      setClaimNumber(data.claim.claimNumber);
      setStep(2);
    } catch {
      setError("Connection error"); setSubmitting(false);
    }
  };

  return (
    <section style={{ background: C.cream, padding: "120px 16px 80px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: C.red, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Claims Centre</span>
          <h1 style={{ fontFamily: F.serif, fontSize: 36, color: C.navy, margin: "12px 0" }}>File an insurance claim</h1>
        </div>

        <div style={{ display: "flex", marginBottom: 32 }}>
          {["Select Type", "Provide Details", "Confirmation"].map((label, i) => (
            <div key={i} style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: i <= step ? C.accent : "#ddd", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{i + 1}</div>
              <div style={{ marginLeft: 8, fontFamily: F.sans, fontSize: 12, color: i <= step ? C.navy : "#bbb", fontWeight: i === step ? 700 : 400 }}>{label}</div>
              {i < 2 && <div style={{ flex: 1, height: 2, background: i < step ? C.accent : "#eee", margin: "0 12px" }} />}
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 24, padding: 32, border: "1px solid #eee" }}>
          {step === 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
              {TYPES.map((t) => (
                <div key={t.value} onClick={() => { setType(t.value); setStep(1); }} style={{
                  background: type === t.value ? `${C.accent}08` : "#fff",
                  border: type === t.value ? `2px solid ${C.accent}` : "1px solid #eee",
                  borderRadius: 12, padding: 20, cursor: "pointer",
                }}>
                  <h4 style={{ fontFamily: F.sans, fontSize: 14, color: C.navy, margin: "0 0 4px", fontWeight: 700 }}>{t.label}</h4>
                  <p style={{ fontFamily: F.sans, fontSize: 12, color: "#999", margin: 0 }}>{t.desc}</p>
                </div>
              ))}
            </div>
          )}

          {step === 1 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontFamily: F.sans, fontSize: 12, color: "#999", display: "block", marginBottom: 6 }}>Incident Date</label>
                <input type="date" value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} style={{ width: "100%", border: "1px solid #ddd", borderRadius: 8, padding: 12, fontFamily: F.sans, fontSize: 13 }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontFamily: F.sans, fontSize: 12, color: "#999", display: "block", marginBottom: 6 }}>Description of incident *</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder="Describe what happened in as much detail as possible..." style={{ width: "100%", border: "1px solid #ddd", borderRadius: 8, padding: 12, fontFamily: F.sans, fontSize: 13, resize: "vertical" }} />
                <div style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>{description.length}/5000 (minimum 10)</div>
              </div>
              {error && <div style={{ background: `${C.red}10`, color: C.red, padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setStep(0)} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 10, padding: "12px 24px", fontFamily: F.sans, fontSize: 13, color: C.navy, fontWeight: 600 }}>Back</button>
                <button onClick={submit} disabled={submitting || description.length < 10} style={{ flex: 1, background: submitting || description.length < 10 ? "#ccc" : C.accent, border: "none", borderRadius: 10, padding: "12px 24px", color: "#fff", fontFamily: F.sans, fontSize: 13, fontWeight: 700 }}>
                  {submitting ? "Submitting..." : "Submit Claim"}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: `${C.green}15`, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: C.green }}>✓</div>
              <h3 style={{ fontFamily: F.serif, fontSize: 28, color: C.navy, margin: "0 0 12px" }}>Claim Submitted</h3>
              <p style={{ fontFamily: F.sans, fontSize: 14, color: "#777", margin: "0 0 8px" }}>Reference number: <strong style={{ color: C.navy }}>{claimNumber}</strong></p>
              <p style={{ fontFamily: F.sans, fontSize: 13, color: "#999", maxWidth: 500, margin: "0 auto 24px" }}>An adjuster will contact you within 1-2 business days. Track status from your dashboard.</p>
              <button onClick={() => { setStep(0); setType(""); setDescription(""); setIncidentDate(""); }} style={{ background: C.accent, border: "none", borderRadius: 10, padding: "12px 24px", color: "#fff", fontFamily: F.sans, fontSize: 13, fontWeight: 600 }}>File Another Claim</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
