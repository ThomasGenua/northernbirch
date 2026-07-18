import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentMember } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { colors as C, fonts as F } from "@/lib/theme";

export default async function InvestPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/login");

const portfolios = [
  {
    id: "port-1",
    name: "Self-Directed TFSA",
    type: "SELF_DIRECTED",
    managed: false,
    cashBalance: 1250.45,
    holdings: [
      { id: "h1", symbol: "VFV.TO", name: "Vanguard S&P 500 Index ETF", quantity: 120, avgCost: 115.20, currentPrice: 135.40 },
      { id: "h2", symbol: "SHOP.TO", name: "Shopify Inc. Class A", quantity: 45, avgCost: 78.50, currentPrice: 92.10 },
      { id: "h3", symbol: "TD.TO", name: "Toronto-Dominion Bank", quantity: 50, avgCost: 82.10, currentPrice: 81.55 },
    ],
  },
  {
    id: "port-2",
    name: "Retirement RRSP (Managed)",
    type: "MANAGED",
    managed: true,
    cashBalance: 0.00,
    holdings: [
      { id: "h4", symbol: "NBCU-BAL", name: "NBCU Balanced Growth Fund", quantity: 2500, avgCost: 20.00, currentPrice: 23.25 },
    ],
  },
];

const goals = [
  { id: "sg-1", icon: "✈️", name: "Tallinn Trip 2027", targetAmount: 5000.00, currentAmount: 3400.00, targetDate: "2027-05-01" },
  { id: "sg-2", icon: "🏠", name: "Down Payment Top-up", targetAmount: 25000.00, currentAmount: 15000.00, targetDate: "2028-12-31" },
];

const recentTrades = [
  { id: "tr-1", symbol: "VFV.TO", side: "BUY", quantity: 10, price: 134.10, totalAmount: 1341.00, executedAt: "2026-06-10T15:30:00.000Z", status: "FILLED" },
  { id: "tr-2", symbol: "SHOP.TO", side: "BUY", quantity: 5, price: 91.80, totalAmount: 459.00, executedAt: "2026-06-05T14:15:00.000Z", status: "FILLED" },
];

  const enriched = portfolios.map((p: any) => {
    const value = p.holdings.reduce((s: number, h: any) => s + Number(h.quantity) * Number(h.currentPrice), 0) + Number(p.cashBalance);
    const cost = p.holdings.reduce((s: number, h: any) => s + Number(h.quantity) * Number(h.avgCost), 0);
    return { ...p, value, cost, gain: value - cost, gainPct: cost > 0 ? ((value - cost) / cost) * 100 : 0 };
  });
  const totalValue = enriched.reduce((s: number, p: any) => s + p.value, 0);
  const totalCost = enriched.reduce((s: number, p: any) => s + p.cost, 0);
  const totalGain = totalValue - totalCost;
  const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  const typeLabels: Record<string, string> = { MANAGED: "Managed", SELF_DIRECTED: "Self-Directed", CRYPTO: "Crypto", TFSA: "TFSA", RRSP: "RRSP", FHSA: "FHSA", CASH: "Cash" };
  const typeColors: Record<string, string> = { MANAGED: C.accent, SELF_DIRECTED: C.purple, CRYPTO: C.amber, TFSA: C.green };

  return (
    <div style={{ background: C.cream, paddingTop: 80, paddingBottom: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 16px" }}>
        {/* Header / total */}
        <div style={{ background: `linear-gradient(135deg, ${C.dark}, ${C.navy})`, borderRadius: 24, padding: 36, color: "#fff", marginBottom: 24 }}>
          <div style={{ fontFamily: F.sans, fontSize: 12, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 2 }}>Total Portfolio Value</div>
          <div style={{ fontFamily: F.serif, fontSize: 52, fontWeight: 700, margin: "8px 0" }}>C${totalValue.toLocaleString("en-CA", { minimumFractionDigits: 2 })}</div>
          <div style={{ display: "flex", gap: 24, marginTop: 12 }}>
            <div>
              <span style={{ fontFamily: F.sans, fontSize: 13, color: totalGain >= 0 ? "#4ADE80" : "#F87171", fontWeight: 700 }}>
                {totalGain >= 0 ? "▲" : "▼"} C${Math.abs(totalGain).toLocaleString("en-CA", { minimumFractionDigits: 2 })} ({totalGainPct >= 0 ? "+" : ""}{totalGainPct.toFixed(2)}%)
              </span>
              <span style={{ fontFamily: F.sans, fontSize: 12, color: "rgba(255,255,255,0.4)", marginLeft: 8 }}>all time</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
            <Link href="/trade" style={{ background: C.birch, color: C.dark, padding: "12px 24px", borderRadius: 10, fontFamily: F.sans, fontSize: 13, fontWeight: 700 }}>Trade</Link>
            <Link href="/dashboard" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "12px 24px", borderRadius: 10, fontFamily: F.sans, fontSize: 13, fontWeight: 600 }}>Dashboard</Link>
          </div>
        </div>

        {/* Portfolios */}
        <h2 style={{ fontFamily: F.serif, fontSize: 24, color: C.navy, marginBottom: 16 }}>Your Accounts</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 32 }}>
          {enriched.map((p: any) => (
            <div key={p.id} style={{ background: "#fff", borderRadius: 20, padding: 24, border: "1px solid #eee" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <div style={{ display: "inline-block", padding: "3px 10px", background: `${typeColors[p.type] ?? C.navy}15`, color: typeColors[p.type] ?? C.navy, borderRadius: 8, fontFamily: F.sans, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>{typeLabels[p.type] ?? p.type}</div>
                  <div style={{ fontFamily: F.sans, fontSize: 15, color: C.navy, fontWeight: 700 }}>{p.name}</div>
                </div>
                {p.managed && <span style={{ fontFamily: F.sans, fontSize: 10, color: C.green, background: `${C.green}10`, padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>AUTO-MANAGED</span>}
              </div>
              <div style={{ fontFamily: F.serif, fontSize: 28, color: C.navy, fontWeight: 700 }}>C${p.value.toLocaleString("en-CA", { minimumFractionDigits: 2 })}</div>
              <div style={{ fontFamily: F.sans, fontSize: 13, color: p.gain >= 0 ? C.green : C.red, fontWeight: 600, marginTop: 4 }}>
                {p.gain >= 0 ? "+" : ""}C${p.gain.toLocaleString("en-CA", { minimumFractionDigits: 2 })} ({p.gainPct >= 0 ? "+" : ""}{p.gainPct.toFixed(2)}%)
              </div>
              {/* Holdings */}
              <div style={{ marginTop: 16, borderTop: "1px solid #f5f5f5", paddingTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
                  <span style={{ fontFamily: F.sans, fontSize: 12, color: "#999", fontWeight: 600 }}>💵 Cash</span>
                  <span style={{ fontFamily: F.sans, fontSize: 12, color: C.navy }}>C${Number(p.cashBalance).toLocaleString("en-CA", { minimumFractionDigits: 2 })}</span>
                </div>
                {p.holdings.slice(0, 4).map((h: any) => {
                  const hv = Number(h.quantity) * Number(h.currentPrice);
                  return (
                    <div key={h.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
                      <div>
                        <span style={{ fontFamily: F.sans, fontSize: 12, color: C.navy, fontWeight: 600 }}>{h.symbol}</span>
                        <span style={{ fontFamily: F.sans, fontSize: 11, color: "#bbb", marginLeft: 6 }}>{Number(h.quantity)} units</span>
                      </div>
                      <span style={{ fontFamily: F.sans, fontSize: 12, color: C.navy }}>C${hv.toLocaleString("en-CA", { minimumFractionDigits: 2 })}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Goals */}
        {goals.length > 0 && (
          <>
            <h2 style={{ fontFamily: F.serif, fontSize: 24, color: C.navy, marginBottom: 16 }}>Savings Goals</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 32 }}>
              {goals.map((g: any) => {
                const pct = Math.min(100, (Number(g.currentAmount) / Number(g.targetAmount)) * 100);
                return (
                  <div key={g.id} style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #eee" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 20 }}>{g.icon}</span>
                      <span style={{ fontFamily: F.sans, fontSize: 14, color: C.navy, fontWeight: 700 }}>{g.name}</span>
                    </div>
                    <div style={{ height: 8, background: "#f0f0f0", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.accent}, ${C.green})` }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F.sans, fontSize: 12 }}>
                      <span style={{ color: C.navy, fontWeight: 600 }}>C${Number(g.currentAmount).toLocaleString()}</span>
                      <span style={{ color: "#999" }}>of C${Number(g.targetAmount).toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Recent trades */}
        {recentTrades.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 20, padding: 24, border: "1px solid #eee" }}>
            <h3 style={{ fontFamily: F.serif, fontSize: 18, color: C.navy, marginBottom: 16 }}>Recent Trades</h3>
            {recentTrades.map((t: any) => (
              <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f5f5f5" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: F.sans, fontSize: 11, fontWeight: 700, color: t.side === "BUY" ? C.green : C.red, background: t.side === "BUY" ? `${C.green}10` : `${C.red}10`, padding: "3px 8px", borderRadius: 6 }}>{t.side}</span>
                  <div>
                    <div style={{ fontFamily: F.sans, fontSize: 13, color: C.navy, fontWeight: 600 }}>{t.symbol} · {Number(t.quantity)} units</div>
                    <div style={{ fontFamily: F.sans, fontSize: 11, color: "#bbb" }}>{new Date(t.executedAt).toLocaleDateString("en-CA")}</div>
                  </div>
                </div>
                <span style={{ fontFamily: F.sans, fontSize: 13, color: C.navy, fontWeight: 600 }}>C${Number(t.totalAmount).toLocaleString("en-CA", { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
