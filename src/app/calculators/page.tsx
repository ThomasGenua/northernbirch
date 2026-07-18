"use client";

import { useState } from "react";
import { colors as C, fonts as F } from "@/lib/theme";
import { calculateMortgage, calculateRetirement, calculateInsuranceNeeds } from "@/lib/quotes";
import { exportToPDF } from "@/lib/pdf";

type Calc = "mortgage" | "retirement" | "insurance";

export default function CalculatorsPage() {
  const [calc, setCalc] = useState<Calc>("mortgage");
  const tabs: { id: Calc; label: string; icon: string }[] = [
    { id: "mortgage", label: "Mortgage", icon: "🏠" },
    { id: "retirement", label: "Retirement", icon: "🌅" },
    { id: "insurance", label: "Insurance Needs", icon: "🛡️" },
  ];

  return (
    <section style={{ background: C.cream, padding: "120px 16px 80px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: C.amber, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Financial Calculators</span>
          <h1 style={{ fontFamily: F.serif, fontSize: 36, color: C.navy, margin: "12px 0" }}>Plan with confidence</h1>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 24, justifyContent: "center", flexWrap: "wrap" }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setCalc(t.id)} style={{ background: calc === t.id ? C.navy : "#fff", color: calc === t.id ? "#fff" : C.navy, border: calc === t.id ? "none" : "1px solid #ddd", borderRadius: 12, padding: "12px 20px", fontFamily: F.sans, fontSize: 13, fontWeight: 600 }}>{t.icon} {t.label}</button>
          ))}
        </div>
        {calc === "mortgage" && <MortgageCalc />}
        {calc === "retirement" && <RetirementCalc />}
        {calc === "insurance" && <InsuranceCalc />}
      </div>
    </section>
  );
}

function Field({ label, value, setValue, prefix, suffix }: { label: string; value: number; setValue: (v: number) => void; prefix?: string; suffix?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontFamily: F.sans, fontSize: 12, color: "#999", display: "block", marginBottom: 6 }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: 10, padding: "0 14px" }}>
        {prefix && <span style={{ fontFamily: F.sans, fontSize: 14, color: "#999" }}>{prefix}</span>}
        <input type="number" value={value} onChange={(e) => setValue(+e.target.value)} style={{ flex: 1, border: "none", outline: "none", padding: "12px 8px", fontFamily: F.sans, fontSize: 15, fontWeight: 600, color: C.navy }} />
        {suffix && <span style={{ fontFamily: F.sans, fontSize: 14, color: "#999" }}>{suffix}</span>}
      </div>
    </div>
  );
}

function MortgageCalc() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(4.39);
  const [years, setYears] = useState(25);
  const r = calculateMortgage(amount, rate, years);
  return (
    <div style={{ background: "#fff", borderRadius: 24, padding: 32, border: "1px solid #eee" }}>
      <Field label="Mortgage Amount" value={amount} setValue={setAmount} prefix="C$" />
      <Field label="Interest Rate" value={rate} setValue={setRate} suffix="%" />
      <Field label="Amortization (years)" value={years} setValue={setYears} />
      <div id="mortgage-result" style={{ background: `${C.green}08`, borderRadius: 16, padding: 28, textAlign: "center", marginTop: 8 }}>
        <div style={{ fontFamily: F.sans, fontSize: 12, color: "#999", textTransform: "uppercase", letterSpacing: 1 }}>Monthly Payment</div>
        <div style={{ fontFamily: F.serif, fontSize: 42, color: C.green, fontWeight: 700, margin: "8px 0" }}>C${r.monthly.toLocaleString("en-CA", { minimumFractionDigits: 2 })}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 16 }}>
          <div><div style={{ fontFamily: F.serif, fontSize: 20, color: C.navy, fontWeight: 700 }}>C${r.totalInterest.toLocaleString("en-CA", { maximumFractionDigits: 0 })}</div><div style={{ fontFamily: F.sans, fontSize: 11, color: "#999" }}>Total Interest</div></div>
          <div><div style={{ fontFamily: F.serif, fontSize: 20, color: C.navy, fontWeight: 700 }}>C${r.totalPaid.toLocaleString("en-CA", { maximumFractionDigits: 0 })}</div><div style={{ fontFamily: F.sans, fontSize: 11, color: "#999" }}>Total Paid</div></div>
        </div>
        <p style={{ fontFamily: F.sans, fontSize: 11, color: "#bbb", margin: "16px 0 12px" }}>NBCU rates: 3-year closed 4.39%, 5-year high ratio 3.89%.</p>
        <button onClick={() => exportToPDF("mortgage-result", "Mortgage Calculation")} style={{ background: C.green, border: "none", borderRadius: 10, padding: "10px 20px", color: "#fff", fontFamily: F.sans, fontSize: 13, fontWeight: 600 }}>Download PDF</button>
      </div>
    </div>
  );
}

function RetirementCalc() {
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [income, setIncome] = useState(95000);
  const [savings, setSavings] = useState(85000);
  const [monthly, setMonthly] = useState(800);
  const [ret, setRet] = useState(6);
  const r = calculateRetirement({ currentAge, retirementAge, currentIncome: income, currentSavings: savings, monthlyContribution: monthly, expectedReturn: ret });
  return (
    <div style={{ background: "#fff", borderRadius: 24, padding: 32, border: "1px solid #eee" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Current Age" value={currentAge} setValue={setCurrentAge} />
        <Field label="Retirement Age" value={retirementAge} setValue={setRetirementAge} />
      </div>
      <Field label="Annual Income" value={income} setValue={setIncome} prefix="C$" />
      <Field label="Current Savings" value={savings} setValue={setSavings} prefix="C$" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Monthly Contribution" value={monthly} setValue={setMonthly} prefix="C$" />
        <Field label="Expected Return" value={ret} setValue={setRet} suffix="%" />
      </div>
      <div id="retirement-result" style={{ background: `${C.purple}08`, borderRadius: 16, padding: 28, textAlign: "center", marginTop: 8 }}>
        <div style={{ fontFamily: F.sans, fontSize: 12, color: "#999", textTransform: "uppercase", letterSpacing: 1 }}>Projected at Retirement</div>
        <div style={{ fontFamily: F.serif, fontSize: 42, color: C.purple, fontWeight: 700, margin: "8px 0" }}>C${r.totalAtRetire.toLocaleString("en-CA")}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 16, flexWrap: "wrap" }}>
          <div><div style={{ fontFamily: F.serif, fontSize: 18, color: C.navy, fontWeight: 700 }}>C${r.monthlyTotal.toLocaleString("en-CA")}/mo</div><div style={{ fontFamily: F.sans, fontSize: 11, color: "#999" }}>Est. Retirement Income</div></div>
          <div><div style={{ fontFamily: F.serif, fontSize: 18, color: r.gap > 0 ? C.red : C.green, fontWeight: 700 }}>{r.gap > 0 ? "C$" + r.gap.toLocaleString("en-CA") + "/mo" : "On Track"}</div><div style={{ fontFamily: F.sans, fontSize: 11, color: "#999" }}>{r.gap > 0 ? "Monthly Gap" : "Goal Status"}</div></div>
        </div>
        <p style={{ fontFamily: F.sans, fontSize: 11, color: "#bbb", margin: "16px 0 12px" }}>Assumes {ret}% return, 2% inflation, 70% income replacement, CPP/OAS ~C$18K/yr, living to 90.</p>
        <button onClick={() => exportToPDF("retirement-result", "Retirement Projection")} style={{ background: C.purple, border: "none", borderRadius: 10, padding: "10px 20px", color: "#fff", fontFamily: F.sans, fontSize: 13, fontWeight: 600 }}>Download PDF</button>
      </div>
    </div>
  );
}

function InsuranceCalc() {
  const [income, setIncome] = useState(95000);
  const [dependents, setDependents] = useState(2);
  const [mortgage, setMortgage] = useState(420000);
  const r = calculateInsuranceNeeds(income, dependents, mortgage);
  return (
    <div style={{ background: "#fff", borderRadius: 24, padding: 32, border: "1px solid #eee" }}>
      <Field label="Annual Income" value={income} setValue={setIncome} prefix="C$" />
      <Field label="Number of Dependents" value={dependents} setValue={setDependents} />
      <Field label="Mortgage / Debt Balance" value={mortgage} setValue={setMortgage} prefix="C$" />
      <div id="insurance-needs-result" style={{ background: `${C.accent}08`, borderRadius: 16, padding: 28, marginTop: 8 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: F.sans, fontSize: 12, color: "#999", textTransform: "uppercase", letterSpacing: 1 }}>Recommended Coverage</div>
          <div style={{ fontFamily: F.serif, fontSize: 42, color: C.accent, fontWeight: 700, margin: "8px 0" }}>C${r.total.toLocaleString("en-CA")}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 16 }}>
          {[["Income Replacement (10x)", r.incomeReplacement], ["Mortgage Payoff", r.debtCoverage], [`Education (${dependents} kids)`, r.education]].map(([l, v], i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 16, textAlign: "center" }}>
              <div style={{ fontFamily: F.serif, fontSize: 20, color: C.navy, fontWeight: 700 }}>C${((v as number) / 1000).toFixed(0)}K</div>
              <div style={{ fontFamily: F.sans, fontSize: 11, color: "#999", marginTop: 2 }}>{l as string}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button onClick={() => exportToPDF("insurance-needs-result", "Insurance Needs Analysis")} style={{ background: C.accent, border: "none", borderRadius: 10, padding: "10px 20px", color: "#fff", fontFamily: F.sans, fontSize: 13, fontWeight: 600 }}>Download PDF</button>
        </div>
      </div>
    </div>
  );
}
