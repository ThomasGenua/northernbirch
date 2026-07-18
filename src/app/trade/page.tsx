"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { colors as C, fonts as F } from "@/lib/theme";
import { useToast } from "@/components/ToastProvider";
import Sparkline from "@/components/Sparkline";

export default function TradePage() {
  const router = useRouter();
  const toast = useToast();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [qty, setQty] = useState("");
  const [portfolioId, setPortfolioId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/market").then((r) => r.json()).then((d) => setQuotes(d.quotes ?? []));
    fetch("/api/watchlist").then((r) => r.json()).then((d) => setWatchlist(d.watchlist ?? []));
    fetch("/api/portfolios").then((r) => r.json()).then((d) => {
      if (d.error) { router.push("/login"); return; }
      const selfDirected = (d.portfolios ?? []).filter((p: any) => p.type === "SELF_DIRECTED" || p.type === "CRYPTO" || p.type === "TFSA");
      setPortfolios(selfDirected);
      if (selfDirected[0]) setPortfolioId(selfDirected[0].id);
    });
  }, [router]);

  const filtered = search ? quotes.filter((q) => q.symbol.includes(search.toUpperCase()) || q.name.toUpperCase().includes(search.toUpperCase())) : quotes;

  const placeTrade = async () => {
    if (!selected || !qty || !portfolioId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/trades", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolioId, symbol: selected.symbol, side, quantity: parseFloat(qty) }),
      });
      const data = await res.json();
      if (!res.ok) { toast(data.error || "Trade failed", "error"); }
      else {
        toast(`${side === "BUY" ? "Bought" : "Sold"} ${qty} ${selected.symbol} at C$${selected.price}`, "success");
        setQty(""); setSelected(null);
      }
    } catch { toast("Connection error", "error"); }
    setSubmitting(false);
  };

  const estCost = selected && qty ? (parseFloat(qty) * selected.price) : 0;
  const watched = selected ? watchlist.some((w) => w.symbol === selected.symbol) : false;

  const toggleWatch = async () => {
    if (!selected) return;
    if (watched) {
      await fetch(`/api/watchlist?symbol=${selected.symbol}`, { method: "DELETE" });
      setWatchlist((p) => p.filter((w) => w.symbol !== selected.symbol));
      toast(`${selected.symbol} removed from watchlist`, "info");
    } else {
      const res = await fetch("/api/watchlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ symbol: selected.symbol }) });
      const d = await res.json();
      if (d.item) { setWatchlist((p) => [d.item, ...p]); toast(`${selected.symbol} added to watchlist`, "success"); }
    }
  };

  return (
    <div style={{ background: C.cream, paddingTop: 80, paddingBottom: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 16px" }}>
        <div style={{ marginBottom: 24 }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: C.purple, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Self-Directed Trading</span>
          <h1 style={{ fontFamily: F.serif, fontSize: 32, color: C.navy, margin: "8px 0 0" }}>Trade stocks, ETFs & crypto</h1>
          <p style={{ fontFamily: F.sans, fontSize: 13, color: "#999", margin: "4px 0 0" }}>Commission-free. Real-time pricing.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 360px", gap: 24 }}>
          {/* Market list */}
          <div>
            {watchlist.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: F.sans, fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, marginBottom: 8 }}>Watchlist</div>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                  {watchlist.map((w) => {
                    const q = quotes.find((x) => x.symbol === w.symbol);
                    return (
                      <div key={w.symbol} onClick={() => { const full = q ?? w; setSelected(full); setSide("BUY"); }} style={{ flexShrink: 0, background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "10px 14px", cursor: "pointer", minWidth: 110 }}>
                        <div style={{ fontFamily: F.sans, fontSize: 12, color: C.navy, fontWeight: 700 }}>{w.symbol}</div>
                        <div style={{ fontFamily: F.sans, fontSize: 11, color: (q?.changePercent ?? w.changePercent ?? 0) >= 0 ? C.green : C.red, fontWeight: 600 }}>
                          C${(q?.price ?? w.price ?? 0).toLocaleString()} · {(q?.changePercent ?? w.changePercent ?? 0) >= 0 ? "+" : ""}{q?.changePercent ?? w.changePercent ?? 0}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search symbol or name (e.g. AAPL, Bitcoin)" style={{ width: "100%", border: "1px solid #ddd", borderRadius: 12, padding: "12px 16px", fontFamily: F.sans, fontSize: 14, marginBottom: 16, boxSizing: "border-box" }} />
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", overflow: "hidden" }}>
              {filtered.map((q) => (
                <div key={q.symbol} onClick={() => { setSelected(q); setSide("BUY"); }} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px",
                  borderBottom: "1px solid #f5f5f5", cursor: "pointer",
                  background: selected?.symbol === q.symbol ? `${C.accent}06` : "transparent",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: q.assetType === "CRYPTO" ? `${C.amber}15` : q.assetType === "ETF" ? `${C.accent}15` : `${C.purple}15`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.sans, fontSize: 11, fontWeight: 700, color: q.assetType === "CRYPTO" ? C.amber : q.assetType === "ETF" ? C.accent : C.purple }}>{q.symbol.slice(0, 3)}</div>
                    <div>
                      <div style={{ fontFamily: F.sans, fontSize: 14, color: C.navy, fontWeight: 700 }}>{q.symbol}</div>
                      <div style={{ fontFamily: F.sans, fontSize: 11, color: "#999" }}>{q.name}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: F.sans, fontSize: 14, color: C.navy, fontWeight: 600 }}>C${q.price.toLocaleString()}</div>
                    <div style={{ fontFamily: F.sans, fontSize: 11, color: q.changePercent >= 0 ? C.green : C.red, fontWeight: 600 }}>{q.changePercent >= 0 ? "+" : ""}{q.changePercent}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trade ticket */}
          <div>
            <div style={{ background: "#fff", borderRadius: 20, padding: 24, border: "1px solid #eee", position: "sticky", top: 80 }}>
              {!selected ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#999", fontFamily: F.sans, fontSize: 14 }}>Select an asset to trade</div>
              ) : (
                <>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontFamily: F.sans, fontSize: 18, color: C.navy, fontWeight: 700 }}>{selected.symbol}</div>
                      <button onClick={toggleWatch} title={watched ? "Remove from watchlist" : "Add to watchlist"} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>{watched ? "★" : "☆"}</button>
                    </div>
                    <div style={{ fontFamily: F.sans, fontSize: 12, color: "#999" }}>{selected.name}</div>
                    <div style={{ fontFamily: F.serif, fontSize: 28, color: C.navy, fontWeight: 700, marginTop: 8 }}>C${selected.price.toLocaleString()}</div>
                    <div style={{ marginTop: 12 }}>
                      <Sparkline symbol={selected.symbol} width={300} height={70} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                    <button onClick={() => setSide("BUY")} style={{ flex: 1, background: side === "BUY" ? C.green : "#f5f5f5", color: side === "BUY" ? "#fff" : C.navy, border: "none", borderRadius: 10, padding: 12, fontFamily: F.sans, fontSize: 13, fontWeight: 700 }}>Buy</button>
                    <button onClick={() => setSide("SELL")} style={{ flex: 1, background: side === "SELL" ? C.red : "#f5f5f5", color: side === "SELL" ? "#fff" : C.navy, border: "none", borderRadius: 10, padding: 12, fontFamily: F.sans, fontSize: 13, fontWeight: 700 }}>Sell</button>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontFamily: F.sans, fontSize: 12, color: "#999", display: "block", marginBottom: 6 }}>Account</label>
                    {(() => { const sp = portfolios.find((p: any) => p.id === portfolioId); return sp ? (
                      <div style={{ fontFamily: F.sans, fontSize: 11, color: C.green, fontWeight: 600, marginBottom: 6 }}>Buying power: C${Number(sp.cashBalance ?? 0).toLocaleString("en-CA", { minimumFractionDigits: 2 })}</div>
                    ) : null; })()}
                    <select value={portfolioId} onChange={(e) => setPortfolioId(e.target.value)} style={{ width: "100%", border: "1px solid #ddd", borderRadius: 8, padding: 10, fontFamily: F.sans, fontSize: 13, background: "#fff" }}>
                      {portfolios.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontFamily: F.sans, fontSize: 12, color: "#999", display: "block", marginBottom: 6 }}>Quantity</label>
                    <input value={qty} onChange={(e) => setQty(e.target.value)} type="number" step="any" placeholder="0" style={{ width: "100%", border: "1px solid #ddd", borderRadius: 8, padding: 12, fontFamily: F.sans, fontSize: 16, fontWeight: 600, boxSizing: "border-box" }} />
                  </div>
                  {estCost > 0 && (
                    <div style={{ background: "#f8f8f8", borderRadius: 10, padding: 14, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: F.sans, fontSize: 13, color: "#777" }}>Estimated {side === "BUY" ? "cost" : "proceeds"}</span>
                      <span style={{ fontFamily: F.sans, fontSize: 15, color: C.navy, fontWeight: 700 }}>C${estCost.toLocaleString("en-CA", { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <button onClick={placeTrade} disabled={submitting || !qty || parseFloat(qty) <= 0} style={{ width: "100%", background: submitting || !qty ? "#ccc" : side === "BUY" ? C.green : C.red, color: "#fff", border: "none", borderRadius: 12, padding: 14, fontFamily: F.sans, fontSize: 14, fontWeight: 700 }}>
                    {submitting ? "Placing order..." : `${side === "BUY" ? "Buy" : "Sell"} ${selected.symbol}`}
                  </button>
                  <p style={{ fontFamily: F.sans, fontSize: 10, color: "#bbb", textAlign: "center", margin: "12px 0 0" }}>Commission-free. Market order at current price.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
