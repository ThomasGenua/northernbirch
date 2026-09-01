import React from "react";
import { Btn, C, Fade, ff, fs, SH, useMob } from '../ui.jsx';

// Financial advisory was the one product area with no destination. The
// capability was described in half a dozen places -- the wealth team on the
// leadership page, Aviso and Qtrade in the terms, registered plans under
// Personal, estate planning on its own page -- and nowhere did a member find
// "here is the advice we give and here is how to get it". Everything below
// restates what the site already publishes; nothing new is claimed.
const SERVICES = [
  { t: "Financial Check-Up", c: C.greenFill, tc: C.greenText,
    d: "A no-cost review of your saving, borrowing, retirement and protection, with our wealth team led by Heili Orav, Manager of Wealth & Estate Services.",
    b: ["No cost to members", "In branch, by phone or by video", "You leave with a written plan"],
    go: ["booking", "Book a Financial Check-Up"] },
  { t: "Retirement & Registered Plans", c: C.accent, tc: C.accentText,
    d: "TFSA, RRSP, FHSA, RESP, RDSP and RRIF plans, and how to sequence contributions and withdrawals across them.",
    b: ["Contribution room and timing", "Spousal and family strategies", "Converting an RRSP to a RRIF"],
    go: ["accounts", "Compare registered plans"] },
  { t: "Investments", c: C.navy, tc: C.navy,
    d: "Mutual funds, Qtrade Direct Investing and VirtualWealth portfolios through our Aviso Wealth partnership, self-directed or advisor-managed.",
    b: ["Held in TFSA, RRSP or cash", "Self-directed or managed for you", "Aviso Wealth partnership"],
    go: ["personal", "Explore investing"] },
  { t: "Estate & Wealth Transfer", c: C.purple, tc: C.purple,
    d: "Wills, trusts, beneficiary designations and the insurance that funds them, planned around the stage you are actually at.",
    b: ["Beneficiary designations reviewed", "Trust and will referrals", "Insurance-funded estate plans"],
    go: ["estate", "Plan your estate"] },
  { t: "Tax Planning", c: C.amber, tc: C.amberText,
    d: "Where a contribution does the most good this year, across RRSP, TFSA, FHSA and RESP, and what it is worth to you.",
    b: ["Deduction timing", "Income splitting where it applies", "RESP grant maximisation"],
    go: ["tax", "Open the tax optimizer"] },
  { t: "Business Succession", c: C.red, tc: C.redText,
    d: "Funded buy-sell agreements, key person cover and ownership transitions for members who own a business.",
    b: ["Buy-sell funding", "Key person insurance", "Transition planning"],
    go: ["business", "Business solutions"] },
];

const TOOLS = [
  ["Financial Health Check", "healthcheck", "Ten questions, then where your gaps are."],
  ["Retirement Calculator", "calculators", "What your savings become, and what you will need."],
  ["Life Event Simulator", "lifesim", "How a house, a baby or a career change moves the plan."],
];

export default function AdvicePage({ setPage }) {
  const mob = useMob();
  return (
    <section style={{ background: C.cream, padding: mob ? "60px 16px" : "80px 24px", paddingTop: mob ? 80 : 100 }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <SH tag="Financial Advice" tagColor={C.greenText} title="Advice from people you can meet"
            desc="Planning, retirement, investments, estate and tax advice from Northern Birch's wealth team — starting with a Financial Check-Up that costs you nothing." />

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Btn color={C.greenFill} onClick={() => setPage("booking")}>Book a Financial Check-Up &rarr;</Btn>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(auto-fit,minmax(320px,1fr))", gap: 16, marginBottom: 40 }}>
          {SERVICES.map((s, i) => (
            <Fade key={i} delay={i * 0.05}>
              <div style={{ background: "#fff", borderRadius: 20, padding: 28, border: "1px solid #eee", borderTop: `3px solid ${s.c}`, height: "100%", display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontFamily: ff, fontSize: 21, color: C.navy, margin: "0 0 10px" }}>{s.t}</h3>
                <p style={{ fontFamily: fs, fontSize: 14, color: "#666", lineHeight: 1.7, margin: "0 0 14px" }}>{s.d}</p>
                <ul style={{ listStyle: "none", margin: "0 0 18px", padding: 0 }}>
                  {s.b.map((b, bi) => (
                    <li key={bi} style={{ fontFamily: fs, fontSize: 13, color: "#555", padding: "4px 0", display: "flex", gap: 8 }}>
                      <span aria-hidden="true" style={{ color: s.tc, fontWeight: 700 }}>&#10003;</span>{b}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: "auto" }}>
                  <Btn small outline color={s.tc} onClick={() => setPage(s.go[0])}>{s.go[1]} &rarr;</Btn>
                </div>
              </div>
            </Fade>
          ))}
        </div>

        <Fade>
          <div style={{ background: C.navy, borderRadius: 24, padding: mob ? 28 : 40, marginBottom: 32 }}>
            <h3 style={{ fontFamily: ff, fontSize: 24, color: "#fff", margin: "0 0 8px" }}>Work it out yourself first</h3>
            <p style={{ fontFamily: fs, fontSize: 14, color: "rgba(255,255,255,0.65)", margin: "0 0 20px", lineHeight: 1.7 }}>
              Every one of these is free, needs no personal information, and gives you something to bring to the conversation.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3,1fr)", gap: 12 }}>
              {TOOLS.map(([label, route, blurb], i) => (
                <button key={i} onClick={() => setPage(route)}
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "18px 20px", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ fontFamily: fs, fontSize: 15, color: "#fff", fontWeight: 700, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: fs, fontSize: 12.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 10 }}>{blurb}</div>
                  <span style={{ fontFamily: fs, fontSize: 12, color: C.accentOnDark, fontWeight: 600 }}>Open &rarr;</span>
                </button>
              ))}
            </div>
          </div>
        </Fade>

        <Fade>
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", border: "1px solid #eee", marginBottom: 24, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <h3 style={{ fontFamily: ff, fontSize: 22, color: C.navy, margin: "0 0 6px" }}>Talk to the wealth team</h3>
              <p style={{ fontFamily: fs, fontSize: 14, color: "#666", margin: 0, lineHeight: 1.7 }}>
                Heili Orav manages Wealth &amp; Estate Services at Northern Birch. Message her directly, or book a time at any branch.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Btn small color={C.accentText} onClick={() => setPage("messages")}>Message Heili &rarr;</Btn>
              <Btn small outline color={C.navy} onClick={() => setPage("contact")}>Find a branch &rarr;</Btn>
            </div>
          </div>
        </Fade>

        {/* The same disclosure the terms page carries. Advice pages are exactly
            where it needs to be visible, not only in the small print. */}
        <div style={{ background: `${C.navy}08`, borderRadius: 16, padding: "20px 24px", borderLeft: `4px solid ${C.navy}` }}>
          <p style={{ fontFamily: fs, fontSize: 13, color: "#555", margin: 0, lineHeight: 1.75 }}>
            Mutual funds and other investment products are offered through Aviso Wealth, Qtrade Direct Investing and VirtualWealth.
            Mutual funds, securities and other investment products <strong>are not deposits, are not insured by FSRA, are not guaranteed
            by Northern Birch Credit Union, and may fluctuate in value</strong>. Commissions, trailing commissions, management fees and
            expenses may all be associated with mutual fund investments. Please read the prospectus before investing.
          </p>
        </div>
      </div>
    </section>
  );
}
