"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { colors as C, fonts as F } from "@/lib/theme";

const INDEX = [
  { title: "Home", href: "/", cat: "Pages" },
  { title: "Dashboard", href: "/dashboard", cat: "Member" },
  { title: "Become a Member", href: "/register", cat: "Member" },
  { title: "Invest", href: "/invest", cat: "Member" },
  { title: "Trade", href: "/trade", cat: "Member" },
  { title: "Messages", href: "/messages", cat: "Member" },
  { title: "Insurance Products", href: "/insurance", cat: "Insurance" },
  { title: "Get a Quote", href: "/quote", cat: "Tools" },
  { title: "Compare Coverage", href: "/compare", cat: "Tools" },
  { title: "Calculators", href: "/calculators", cat: "Tools" },
  { title: "File a Claim", href: "/claims", cat: "Tools" },
  { title: "Book Appointment", href: "/booking", cat: "Tools" },
  { title: "AI Insurance Advisor", href: "/ai-advisor", cat: "AI" },
  { title: "Coverage Gap Analyzer", href: "/analyzer", cat: "AI" },
  { title: "Financial Health Check", href: "/healthcheck", cat: "AI" },
  { title: "Life Event Simulator", href: "/life-event", cat: "AI" },
  { title: "Policy Document Reader", href: "/doc-reader", cat: "AI" },
  { title: "Tax & Savings Optimizer", href: "/tax", cat: "AI" },
  { title: "Travel & Transfers", href: "/travel", cat: "Banking" },
  { title: "Business Solutions", href: "/business", cat: "Banking" },
  { title: "Digital Banking", href: "/digital", cat: "Banking" },
  { title: "Estate Planning", href: "/estate", cat: "Banking" },
  { title: "Personal Banking", href: "/personal", cat: "Banking" },
  { title: "Rates", href: "/rates", cat: "About" },
  { title: "Community", href: "/community", cat: "About" },
  { title: "Contact & Branches", href: "/contact", cat: "About" },
  { title: "Blog", href: "/blog", cat: "About" },
  { title: "Glossary", href: "/glossary", cat: "About" },
  { title: "Business Case (Leadership)", href: "/leadership", cat: "Leadership" },
];

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  useEffect(() => { if (!open) setQ(""); }, [open]);

  if (!open) return null;
  const results = q ? INDEX.filter((i) => i.title.toLowerCase().includes(q.toLowerCase()) || i.cat.toLowerCase().includes(q.toLowerCase())) : INDEX.slice(0, 8);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(12,24,41,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 100 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560, margin: "0 16px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #f0f0f0", gap: 12 }}>
          <span style={{ fontSize: 18 }}>🔍</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, services, tools..." autoFocus style={{ flex: 1, border: "none", outline: "none", fontFamily: F.sans, fontSize: 16, color: C.navy }} />
          <span style={{ fontFamily: F.sans, fontSize: 11, color: "#bbb", background: "#f0f0f0", padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>esc</span>
        </div>
        <div style={{ maxHeight: 400, overflow: "auto" }}>
          {results.length === 0 && <div style={{ padding: 40, textAlign: "center", fontFamily: F.sans, fontSize: 14, color: "#999" }}>No results for &quot;{q}&quot;</div>}
          {results.map((r) => (
            <div key={r.href} onClick={() => { router.push(r.href as never); onClose(); }} style={{ padding: "14px 24px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f8f8f8" }}>
              <span style={{ fontFamily: F.sans, fontSize: 14, color: C.navy }}>{r.title}</span>
              <span style={{ fontFamily: F.sans, fontSize: 11, color: "#bbb", background: "#f5f5f5", padding: "2px 8px", borderRadius: 6 }}>{r.cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
