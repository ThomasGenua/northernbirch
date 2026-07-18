"use client";
import { useState } from "react";
import { colors as C, fonts as F } from "@/lib/theme";
const TERMS = [
  ["Premium", "The amount you pay for insurance coverage, typically monthly or annually."],
  ["Deductible", "The amount you pay out of pocket before insurance covers a claim."],
  ["Beneficiary", "The person or entity who receives the payout from a life insurance policy."],
  ["Term Life", "Life insurance that provides coverage for a specific period (e.g., 20 years)."],
  ["Permanent Life", "Life insurance that lasts your entire life and builds cash value."],
  ["Critical Illness", "Insurance that pays a lump sum if you're diagnosed with a covered condition."],
  ["Liability Coverage", "Protection against claims for injury or damage you cause to others."],
  ["Rider", "An add-on that modifies or enhances your base insurance policy."],
  ["Underwriting", "The process insurers use to assess risk and determine your premium."],
  ["TFSA", "Tax-Free Savings Account — investment growth and withdrawals are tax-free."],
  ["RRSP", "Registered Retirement Savings Plan — contributions are tax-deductible."],
  ["FHSA", "First Home Savings Account — combines RRSP and TFSA benefits for home buyers."],
  ["GIC", "Guaranteed Investment Certificate — a fixed-rate, low-risk investment."],
  ["ETF", "Exchange-Traded Fund — a basket of securities traded like a stock."],
  ["Creditor Insurance", "Coverage that pays off a loan or mortgage if you die or become disabled."],
  ["Amortization", "The total time to pay off a mortgage through regular payments."],
  ["Equity", "The portion of your home you own outright (value minus mortgage)."],
  ["Probate", "The legal process of validating a will and distributing an estate."],
  ["Co-op Insurance", "Specialized coverage for cooperative housing structures."],
  ["Cash Value", "The savings component of a permanent life insurance policy."],
];
export default function Page() {
  const [q, setQ] = useState("");
  const filtered = TERMS.filter(([t, d]) => t.toLowerCase().includes(q.toLowerCase()) || d.toLowerCase().includes(q.toLowerCase()));
  return (
    <section style={{ background: C.cream, padding: "120px 16px 80px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: C.navy, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Glossary</span>
          <h1 style={{ fontFamily: F.serif, fontSize: 36, color: C.navy, margin: "12px 0" }}>Plain-language definitions</h1>
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search terms..." style={{ width: "100%", border: "1px solid #ddd", borderRadius: 12, padding: "14px 20px", fontFamily: F.sans, fontSize: 15, marginBottom: 24, boxSizing: "border-box" }} />
        {filtered.length === 0 && <p style={{ textAlign: "center", fontFamily: F.sans, color: "#999" }}>No terms match &quot;{q}&quot;</p>}
        {filtered.map(([term, def]) => (
          <div key={term} style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee", marginBottom: 10 }}>
            <h3 style={{ fontFamily: F.sans, fontSize: 15, color: C.navy, fontWeight: 700, margin: "0 0 4px" }}>{term}</h3>
            <p style={{ fontFamily: F.sans, fontSize: 13, color: "#777", lineHeight: 1.6, margin: 0 }}>{def}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
