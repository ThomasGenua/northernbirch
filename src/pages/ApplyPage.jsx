import React, { useState } from "react";
import { Btn, C, CONSENT_VERSION, ConsentNotice, errBox, exportToPDF, ff, fs, readApplyIntent, SH, submitForm, useMob } from '../ui.jsx';

// Until now every "Open an Account", "Apply for a Credit Card" and "Get
// Pre-Approved" button on the site led to the same generic appointment form.
// This is the application itself.
//
// What it deliberately does NOT do: open an account. Northern Birch verifies
// identity in person, and nothing here should imply otherwise. It collects
// what a branch needs to pick up the file and call you back, and says so.
const PRODUCTS = [
  ["Chequing account", "No-fee everyday banking"],
  ["Savings account or GIC", "High-interest savings, or a term from 90 days to 5 years"],
  ["Registered plan (TFSA, RRSP, FHSA, RESP)", "Opened alongside a savings or investment account"],
  ["Mortgage pre-approval", "Fixed, variable, high-ratio, or co-op financing"],
  ["Credit card", "Collabria cash back, low rate, or travel rewards"],
  ["Personal loan or line of credit", "Including HELOCs"],
  ["Business account or lending", "Accounts, payroll, commercial lending"],
  ["Membership only", "Join Northern Birch first, choose products later"],
];

const BRANCHES = ["Latvian Centre (HQ) -- North York", "Tartu College -- Bloor St W", "Hamilton -- Queen St N", "No preference"];

const label = { fontFamily: fs, fontSize: 12, color: "#6B6B6B", display: "block", marginBottom: 6 };
const field = { width: "100%", border: "1px solid #ddd", borderRadius: 10, padding: "12px 16px", fontFamily: fs, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff" };

export default function ApplyPage({ setPage }) {
  const mob = useMob();
  // set by whichever product page sent you here, so the form arrives filled in
  const [product, setProduct] = useState(() => readApplyIntent() || "");
  const [member, setMember] = useState("");
  const [branch, setBranch] = useState("");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState("");
  const [reach, setReach] = useState(""); const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false); const [error, setError] = useState(""); const [submitted, setSubmitted] = useState(false);

  const canSubmit = product && member && name.trim() && email.trim() && phone.trim() && consent;
  // A greyed-out button that will not say why is both a dead end and a
  // contrast failure. This one stays live and names what is missing.
  const missing = () => [
    [!product, "what you are applying for"], [!member, "whether you are already a member"],
    [!name.trim(), "your name"], [!email.trim(), "your email"], [!phone.trim(), "your phone number"],
    [!consent, "your consent to be contacted"],
  ].filter(([m]) => m).map(([, l]) => l);
  const submit = async () => {
    if (!canSubmit) { setError(`Before we can send this we still need ${missing().join(", ").replace(/, ([^,]*)$/, " and $1")}.`); return; }
    setError(""); setSending(true);
    const ok = await submitForm("application", { product, member, branch, name, email, phone, reach, notes, consent: "yes", consentVersion: CONSENT_VERSION });
    setSending(false);
    if (ok) setSubmitted(true);
    else setError("We could not send your application just now. Nothing has been submitted. Please try again, or call 416-465-4659 and we will take it over the phone.");
  };

  if (submitted) return (
    <section className="sec" style={{ background: C.cream, }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div id="application-confirmation">
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: `${C.greenFill}12`, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 36, color: C.greenText }}>&#10003;</span></div>
            <h2 style={{ fontFamily: ff, fontSize: 32, color: C.navy, margin: "0 0 12px" }}>Application started</h2>
            <p style={{ fontFamily: fs, fontSize: 16, color: "#666", lineHeight: 1.7, margin: "0 0 24px" }}>
              We have your request for a {product.toLowerCase()}{branch && branch !== "No preference" ? `, for the ${branch.split(" -- ")[0]} branch` : ""}. Nothing is open yet -- an advisor picks it up from here.
            </p>
          </div>
          <ol style={{ fontFamily: fs, fontSize: 14, color: "#555", lineHeight: 1.8, textAlign: "left", margin: 0, paddingLeft: 20 }}>
            <li>A Northern Birch advisor calls you, normally within one business day.</li>
            <li>They confirm what you need and what to bring.</li>
            <li>You finish in branch or by video, where your identity is verified and the account is opened.</li>
          </ol>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
          <Btn onClick={() => exportToPDF("application-confirmation", "Application Request")} color={C.accentText}>&#128190; Download a copy (PDF)</Btn>
          <Btn outline color={C.navy} onClick={() => { setSubmitted(false); setProduct(""); setNotes(""); }}>Apply for something else</Btn>
        </div>
      </div>
    </section>
  );

  return (
    <section className="sec" style={{ background: C.cream, }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <SH tag="Apply" tagColor={C.greenText} title="Start your application"
            desc="Tell us what you need and an advisor calls you back, normally within one business day. Takes about two minutes." />

        {/* A form that asks for a SIN is indistinguishable from a phishing page.
            This one does not, and says so where people can see it. */}
        <div style={{ background: `${C.accentText}08`, borderRadius: 14, padding: "16px 20px", borderLeft: `4px solid ${C.accent}`, marginBottom: 24 }}>
          <p style={{ fontFamily: fs, fontSize: 13.5, color: "#555", margin: 0, lineHeight: 1.7 }}>
            <strong>We never ask for your SIN, date of birth, banking details or passwords on this page.</strong> Those are collected in person or by video when you finish your application, and only then. If a page claiming to be Northern Birch asks for them, call us at <a href="tel:+14164654659" style={{ color: C.accentText, fontWeight: 600 }}>416-465-4659</a>.
          </p>
        </div>

        <div style={{ background: "#fff", borderRadius: 24, padding: mob ? 24 : 40, border: "1px solid #eee" }}>
          {error && <div style={errBox} role="alert">{error}</div>}

          <div style={{ marginBottom: 20 }}>
            <label htmlFor="apply-product" style={label}>What are you applying for</label>
            <select id="apply-product" value={product} onChange={e => setProduct(e.target.value)} style={field}>
              <option value="">Choose a product...</option>
              {PRODUCTS.map(([p]) => <option key={p}>{p}</option>)}
            </select>
            {product && <p style={{ fontFamily: fs, fontSize: 12.5, color: "#6B6B6B", margin: "8px 0 0" }}>{(PRODUCTS.find(([p]) => p === product) || [])[1]}</p>}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label htmlFor="apply-member" style={label}>Are you already a member</label>
            <select id="apply-member" value={member} onChange={e => setMember(e.target.value)} style={field}>
              <option value="">Choose one...</option>
              <option>Yes, I bank with Northern Birch</option>
              <option>No, I would be joining</option>
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label htmlFor="apply-branch" style={label}>Preferred branch (optional)</label>
            <select id="apply-branch" value={branch} onChange={e => setBranch(e.target.value)} style={field}>
              <option value="">No preference</option>
              {BRANCHES.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label htmlFor="apply-name" style={label}>Your name</label>
            <input id="apply-name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" style={field} />
          </div>

          <div className="grid-2-1" style={{  gap: 16, marginBottom: 20 }}>
            <div>
              <label htmlFor="apply-email" style={label}>Email</label>
              <input id="apply-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={field} />
            </div>
            <div>
              <label htmlFor="apply-phone" style={label}>Phone</label>
              <input id="apply-phone" type="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="416-XXX-XXXX" style={field} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label htmlFor="apply-reach" style={label}>Best time to reach you (optional)</label>
            <select id="apply-reach" value={reach} onChange={e => setReach(e.target.value)} style={field}>
              <option value="">Any time during branch hours</option>
              <option>Morning</option><option>Afternoon</option><option>After 5pm (Thursdays)</option><option>Saturday morning</option>
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label htmlFor="apply-notes" style={label}>Anything we should know (optional)</label>
            <textarea id="apply-notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                      placeholder="A closing date, a rate you were quoted, a language you would rather be served in"
                      style={{ ...field, resize: "vertical" }} />
          </div>

          <ConsentNotice id="apply-consent" checked={consent} onChange={setConsent}
                         purpose="so an advisor can contact me about the product I selected"
                         extra="It is not a credit application and no credit check is run from this form." />

          <Btn color={C.greenFill} onClick={() => !sending && submit()}>
            {sending ? "Sending..." : "Submit application →"}
          </Btn>
        </div>

        <p style={{ fontFamily: fs, fontSize: 13, color: "#666", lineHeight: 1.75, margin: "20px 0 0" }}>
          Would rather talk first? <button onClick={() => setPage("booking")} style={{ background: "none", border: "none", padding: "6px 2px", minHeight: 24, cursor: "pointer", fontFamily: fs, fontSize: 13, color: C.accentText, fontWeight: 600, textDecoration: "underline" }}>Book an appointment</button> or call <a href="tel:+14164654659" style={{ color: C.accentText, fontWeight: 600 }}>416-465-4659</a>.
        </p>
      </div>
    </section>
  );
}
