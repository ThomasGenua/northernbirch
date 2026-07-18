import { colors as C, fonts as F } from "@/lib/theme";

const RATES = [
  { cat: "Savings & Investments", items: [["High-Interest Savings", "2.00%"], ["TFSA Savings", "2.25%"], ["1-Year GIC", "2.70%"], ["3-Year GIC", "3.20%"], ["5-Year GIC", "3.45%"]] },
  { cat: "Mortgages", items: [["3-Year Closed Fixed", "4.39%"], ["5-Year Closed Fixed", "4.59%"], ["5-Year High-Ratio", "3.89%"], ["Variable (Prime - 0.50%)", "5.45%"], ["HELOC (Prime + 0.50%)", "6.45%"]] },
  { cat: "Lending", items: [["Personal Loan (from)", "8.99%"], ["Auto Loan (from)", "7.49%"], ["Line of Credit (from)", "9.45%"], ["Collabria Mastercard", "19.99%"]] },
];

export default function Page() {
  return (
    <section style={{ background: C.cream, padding: "120px 16px 80px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: C.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Current Rates</span>
          <h1 style={{ fontFamily: F.serif, fontSize: 36, color: C.navy, margin: "12px 0" }}>Competitive rates for members</h1>
          <p style={{ fontFamily: F.sans, fontSize: 13, color: "#999" }}>Effective {new Date().toLocaleDateString("en-CA", { month: "long", year: "numeric" })}. Rates subject to change.</p>
        </div>
        {RATES.map((group) => (
          <div key={group.cat} style={{ background: "#fff", borderRadius: 20, padding: 28, border: "1px solid #eee", marginBottom: 16 }}>
            <h3 style={{ fontFamily: F.serif, fontSize: 20, color: C.navy, margin: "0 0 16px" }}>{group.cat}</h3>
            {group.items.map(([name, rate]) => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f5f5f5" }}>
                <span style={{ fontFamily: F.sans, fontSize: 14, color: "#555" }}>{name}</span>
                <span style={{ fontFamily: F.serif, fontSize: 18, color: C.green, fontWeight: 700 }}>{rate}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
