"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { colors as C, fonts as F } from "@/lib/theme";
import { calculateQuote } from "@/lib/quotes";

type QuoteType = "TERM_LIFE" | "HOME" | "AUTO" | "TRAVEL";

const TYPES: { value: QuoteType; label: string; icon: string; color: string }[] = [
  { value: "TERM_LIFE", label: "Term Life", icon: "❤️", color: C.accent },
  { value: "HOME", label: "Home", icon: "🏠", color: C.green },
  { value: "AUTO", label: "Auto", icon: "🚗", color: C.amber },
  { value: "TRAVEL", label: "Travel", icon: "✈️", color: C.purple },
];

export default function QuotePage() {
  const [type, setType] = useState<QuoteType>("TERM_LIFE");
  const [age, setAge] = useState(35);
  const [coverage, setCoverage] = useState(500000);
  const [term, setTerm] = useState<10 | 20 | 30>(20);
  const [smoker, setSmoker] = useState(false);
  const [homeVal, setHomeVal] = useState(600000);
  const [deductible, setDeductible] = useState<500 | 1000 | 2500 | 5000>(1000);
  const [carYear, setCarYear] = useState(2022);
  const [drivingRecord, setDrivingRecord] = useState<"clean" | "minor" | "major">("clean");
  const [tripDays, setTripDays] = useState(30);
  const [travellers, setTravellers] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const result = useMemo(() => {
    if (type === "TERM_LIFE") return calculateQuote("TERM_LIFE", { age, coverage, term, smoker });
    if (type === "HOME") return calculateQuote("HOME", { homeValue: homeVal, deductible });
    if (type === "AUTO") return calculateQuote("AUTO", { vehicleYear: carYear, drivingRecord });
    return calculateQuote("TRAVEL", { age, tripDays, travellers });
  }, [type, age, coverage, term, smoker, homeVal, deductible, carYear, drivingRecord, tripDays, travellers]);

  const activeType = TYPES.find((t) => t.value === type)!;

  const saveQuote = async () => {
    setSaving(true);
    try {
      const inputs = type === "TERM_LIFE" ? { age, coverage, term, smoker } :
                     type === "HOME" ? { homeValue: homeVal, deductible } :
                     type === "AUTO" ? { vehicleYear: carYear, drivingRecord } :
                     { age, tripDays, travellers };
      await fetch("/api/quotes", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, inputs, save: true }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  return (
    <section style={{ background: C.cream, padding: "120px 16px 80px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: C.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Interactive Quote Calculator</span>
          <h1 style={{ fontFamily: F.serif, fontSize: 36, color: C.navy, margin: "12px 0 12px" }}>See your estimated premium instantly</h1>
          <p style={{ fontFamily: F.sans, fontSize: 14, color: "#777", maxWidth: 600, margin: "0 auto" }}>Drag the sliders to adjust coverage. No personal information required.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 32 }}>
          {TYPES.map((t) => (
            <button key={t.value} onClick={() => setType(t.value)} style={{
              background: type === t.value ? t.color : "#fff",
              border: type === t.value ? "none" : "1px solid #ddd",
              borderRadius: 16, padding: "16px 8px", textAlign: "center",
            }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{t.icon}</div>
              <div style={{ fontFamily: F.sans, fontSize: 12, fontWeight: 700, color: type === t.value ? "#fff" : C.navy }}>{t.label}</div>
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 24 }}>
          <div style={{ background: "#fff", borderRadius: 24, padding: 32, border: "1px solid #eee" }}>
            <h3 style={{ fontFamily: F.sans, fontSize: 16, color: C.navy, margin: "0 0 24px", fontWeight: 700 }}>Customize your coverage</h3>

            {type === "TERM_LIFE" && (
              <>
                <Slider label="Your Age" value={age} setValue={setAge} min={18} max={70} color={C.accent} />
                <Slider label="Coverage Amount" value={coverage} setValue={setCoverage} min={100000} max={2000000} step={50000} color={C.accent} formatter={(v) => `C$${(v/1000).toLocaleString()}K`} />
                <Picker label="Term Length" options={[10, 20, 30]} value={term} setValue={(v) => setTerm(v as 10 | 20 | 30)} format={(v) => `${v} Years`} color={C.accent} />
                <Picker label="Tobacco Use" options={["non", "yes"]} value={smoker ? "yes" : "non"} setValue={(v) => setSmoker(v === "yes")} format={(v) => v === "yes" ? "Smoker" : "Non-Smoker"} color={C.accent} />
              </>
            )}

            {type === "HOME" && (
              <>
                <Slider label="Home Value" value={homeVal} setValue={setHomeVal} min={200000} max={2000000} step={25000} color={C.green} formatter={(v) => `C$${(v/1000).toLocaleString()}K`} />
                <Picker label="Deductible" options={[500, 1000, 2500, 5000]} value={deductible} setValue={(v) => setDeductible(v as 500 | 1000 | 2500 | 5000)} format={(v) => `C$${v}`} color={C.green} />
              </>
            )}

            {type === "AUTO" && (
              <>
                <Slider label="Vehicle Year" value={carYear} setValue={setCarYear} min={2010} max={2026} color={C.amber} />
                <Picker label="Driving Record" options={["clean", "minor", "major"]} value={drivingRecord} setValue={(v) => setDrivingRecord(v as never)} format={(v) => String(v).charAt(0).toUpperCase() + String(v).slice(1)} color={C.amber} />
              </>
            )}

            {type === "TRAVEL" && (
              <>
                <Slider label="Your Age" value={age} setValue={setAge} min={18} max={85} color={C.purple} />
                <Slider label="Trip Duration (days)" value={tripDays} setValue={setTripDays} min={1} max={180} color={C.purple} />
                <Picker label="Travellers" options={[1, 2, 3, 4]} value={travellers} setValue={setTravellers} color={C.purple} />
              </>
            )}
          </div>

          <div>
            <div style={{ background: C.navy, borderRadius: 24, padding: 28, textAlign: "center", position: "sticky", top: 80 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `${activeType.color}25`, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{activeType.icon}</div>
              <div style={{ fontFamily: F.sans, fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 2 }}>{type === "TRAVEL" ? "Estimated Trip Cost" : "Estimated Monthly Premium"}</div>
              <div style={{ fontFamily: F.serif, fontSize: 44, color: "#fff", fontWeight: 700, margin: "4px 0" }}>C${result.monthlyPremium.toFixed(2)}</div>
              <div style={{ fontFamily: F.sans, fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>{type === "TRAVEL" ? `${tripDays} days · ${travellers} traveller${travellers > 1 ? "s" : ""} · C$5M medical` : `C$${result.annualPremium.toFixed(2)} / year`}</div>
              <Link href="/booking" style={{ display: "block", background: activeType.color, color: "#fff", borderRadius: 10, padding: 12, fontFamily: F.sans, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Book Advisor Appointment</Link>
              <button onClick={saveQuote} disabled={saving || saved} style={{ display: "block", width: "100%", background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: 12, fontFamily: F.sans, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                {saved ? "✓ Saved" : saving ? "Saving..." : "💾 Save Quote"}
              </button>
              <p style={{ fontFamily: F.sans, fontSize: 10, color: "rgba(255,255,255,0.3)", margin: "12px 0 0", lineHeight: 1.6 }}>Estimate only. Actual premiums may vary based on underwriting.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({ label, value, setValue, min, max, step, color, formatter }: {
  label: string; value: number; setValue: (v: number) => void;
  min: number; max: number; step?: number; color: string;
  formatter?: (v: number) => string;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: F.sans, fontSize: 12, color: "#777" }}>{label}</span>
        <span style={{ fontFamily: F.serif, fontSize: 18, color: C.navy, fontWeight: 700 }}>{formatter ? formatter(value) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step ?? 1} value={value} onChange={(e) => setValue(+e.target.value)}
        style={{ width: "100%", height: 8, borderRadius: 4, background: `linear-gradient(90deg, ${color} 0%, #eee 100%)` }} />
    </div>
  );
}

function Picker<T extends string | number>({ label, options, value, setValue, color, format }: {
  label: string; options: readonly T[]; value: T; setValue: (v: T) => void;
  color: string; format?: (v: T) => string;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontFamily: F.sans, fontSize: 12, color: "#777", marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", gap: 6 }}>
        {options.map((opt) => (
          <button key={String(opt)} onClick={() => setValue(opt)} style={{
            flex: 1, background: value === opt ? color : "#f5f5f5", border: "none", borderRadius: 10,
            padding: 12, fontFamily: F.sans, fontSize: 13, fontWeight: 600,
            color: value === opt ? "#fff" : C.navy,
          }}>{format ? format(opt) : String(opt)}</button>
        ))}
      </div>
    </div>
  );
}
