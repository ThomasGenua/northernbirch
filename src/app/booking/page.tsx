"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { colors as C, fonts as F } from "@/lib/theme";

const SERVICES = [
  ["INSURANCE_QUOTE", "Insurance Quote & Advisory"],
  ["MORTGAGE_CONSULTATION", "Mortgage Consultation"],
  ["WEALTH_REVIEW", "Investment & Wealth Review"],
  ["ESTATE_PLANNING", "Estate Planning"],
  ["BUSINESS_INSURANCE", "Business Insurance & Benefits"],
  ["INTL_TRANSFERS", "International Transfers Setup"],
  ["FINANCIAL_CHECKUP", "Financial Check-Up"],
  ["NEW_MEMBER", "New Member Onboarding"],
] as const;

const TIMES = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30"];

export default function BookingPage() {
  const router = useRouter();
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
  const [branchId, setBranchId] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/branches").then((r) => r.json()).then((d) => setBranches(d.branches ?? []));
  }, []);

  const submit = async () => {
    setSubmitting(true); setError("");
    try {
      const scheduledAt = new Date(`${date}T${time}:00`).toISOString();
      const res = await fetch("/api/appointments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, branchId, scheduledAt }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { router.push("/login"); return; }
        setError(data.error || "Failed to book"); setSubmitting(false); return;
      }
      setSubmitted(true);
    } catch {
      setError("Connection error"); setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section style={{ background: C.cream, padding: "120px 16px 80px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: `${C.green}15`, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: C.green }}>✓</div>
          <h1 style={{ fontFamily: F.serif, fontSize: 32, color: C.navy }}>Appointment Booked</h1>
          <p style={{ fontFamily: F.sans, fontSize: 14, color: "#777", lineHeight: 1.7 }}>
            Your appointment is confirmed for <strong>{date}</strong> at <strong>{time}</strong>. You'll receive a confirmation email shortly.
          </p>
          <button onClick={() => { setSubmitted(false); setBranchId(""); setService(""); setDate(""); setTime(""); }} style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontFamily: F.sans, fontSize: 13, fontWeight: 600 }}>Book Another</button>
        </div>
      </section>
    );
  }

  return (
    <section style={{ background: C.cream, padding: "120px 16px 80px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: C.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Book an Appointment</span>
          <h1 style={{ fontFamily: F.serif, fontSize: 36, color: C.navy, margin: "12px 0" }}>Meet with an advisor</h1>
        </div>

        <div style={{ background: "#fff", borderRadius: 24, padding: 32, border: "1px solid #eee" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: F.sans, fontSize: 12, color: "#999", display: "block", marginBottom: 6 }}>Service Needed</label>
            <select value={service} onChange={(e) => setService(e.target.value)} style={{ width: "100%", border: "1px solid #ddd", borderRadius: 8, padding: 12, fontFamily: F.sans, fontSize: 13, background: "#fff" }}>
              <option value="">Select service...</option>
              {SERVICES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: F.sans, fontSize: 12, color: "#999", display: "block", marginBottom: 6 }}>Branch</label>
            <select value={branchId} onChange={(e) => setBranchId(e.target.value)} style={{ width: "100%", border: "1px solid #ddd", borderRadius: 8, padding: 12, fontFamily: F.sans, fontSize: 13, background: "#fff" }}>
              <option value="">Select branch...</option>
              {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ fontFamily: F.sans, fontSize: 12, color: "#999", display: "block", marginBottom: 6 }}>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} style={{ width: "100%", border: "1px solid #ddd", borderRadius: 8, padding: 12, fontFamily: F.sans, fontSize: 13 }} />
            </div>
            <div>
              <label style={{ fontFamily: F.sans, fontSize: 12, color: "#999", display: "block", marginBottom: 6 }}>Time</label>
              <select value={time} onChange={(e) => setTime(e.target.value)} style={{ width: "100%", border: "1px solid #ddd", borderRadius: 8, padding: 12, fontFamily: F.sans, fontSize: 13, background: "#fff" }}>
                <option value="">Select...</option>
                {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          {error && <div style={{ background: `${C.red}10`, color: C.red, padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}
          <button onClick={submit} disabled={submitting || !service || !branchId || !date || !time} style={{ width: "100%", background: submitting || !service || !branchId || !date || !time ? "#ccc" : C.green, color: "#fff", border: "none", borderRadius: 12, padding: 16, fontFamily: F.sans, fontSize: 14, fontWeight: 700 }}>
            {submitting ? "Booking..." : "Confirm Appointment"}
          </button>
        </div>
      </div>
    </section>
  );
}
