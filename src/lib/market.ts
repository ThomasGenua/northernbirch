// Simulated market data. In production, replace with a real market data provider
// (e.g., Polygon, Finnhub, Alpha Vantage, or a brokerage feed).

export type Quote = {
  symbol: string;
  name: string;
  assetType: "STOCK" | "ETF" | "CRYPTO" | "BOND";
  price: number;
  change: number;
  changePercent: number;
  currency: string;
};

const BASE_PRICES: Record<string, { name: string; price: number; type: Quote["assetType"] }> = {
  AAPL: { name: "Apple Inc.", price: 228.50, type: "STOCK" },
  SHOP: { name: "Shopify Inc.", price: 108.20, type: "STOCK" },
  TSLA: { name: "Tesla Inc.", price: 245.80, type: "STOCK" },
  NVDA: { name: "NVIDIA Corp.", price: 138.40, type: "STOCK" },
  MSFT: { name: "Microsoft Corp.", price: 428.90, type: "STOCK" },
  GOOGL: { name: "Alphabet Inc.", price: 178.30, type: "STOCK" },
  AMZN: { name: "Amazon.com Inc.", price: 218.60, type: "STOCK" },
  RY: { name: "Royal Bank of Canada", price: 168.40, type: "STOCK" },
  TD: { name: "Toronto-Dominion Bank", price: 78.20, type: "STOCK" },
  ENB: { name: "Enbridge Inc.", price: 58.90, type: "STOCK" },
  VEQT: { name: "Vanguard All-Equity ETF", price: 44.82, type: "ETF" },
  XGRO: { name: "iShares Core Growth ETF", price: 35.40, type: "ETF" },
  VFV: { name: "Vanguard S&P 500 ETF", price: 142.80, type: "ETF" },
  VDY: { name: "Vanguard FTSE Cdn High Div ETF", price: 52.10, type: "ETF" },
  XEQT: { name: "iShares Core Equity ETF", price: 38.60, type: "ETF" },
  ZAG: { name: "BMO Aggregate Bond ETF", price: 13.95, type: "BOND" },
  BTC: { name: "Bitcoin", price: 78400, type: "CRYPTO" },
  ETH: { name: "Ethereum", price: 3150, type: "CRYPTO" },
  SOL: { name: "Solana", price: 185.40, type: "CRYPTO" },
  XRP: { name: "XRP", price: 2.35, type: "CRYPTO" },
};

// Deterministic daily change based on symbol + date so it's stable within a day
function dailyChange(symbol: string): number {
  const seed = symbol.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const day = Math.floor(Date.now() / 86400000);
  const x = Math.sin(seed * 9999 + day) * 10000;
  return (x - Math.floor(x)) * 6 - 3; // -3% to +3%
}

export function getQuote(symbol: string): Quote | null {
  const base = BASE_PRICES[symbol.toUpperCase()];
  if (!base) return null;
  const changePercent = Math.round(dailyChange(symbol) * 100) / 100;
  const change = Math.round(base.price * (changePercent / 100) * 100) / 100;
  return {
    symbol: symbol.toUpperCase(), name: base.name, assetType: base.type,
    price: base.price, change, changePercent,
    currency: base.type === "CRYPTO" ? "CAD" : "CAD",
  };
}

export function getAllQuotes(): Quote[] {
  return Object.keys(BASE_PRICES).map((s) => getQuote(s)!).filter(Boolean);
}

export function searchSymbols(query: string): Quote[] {
  const q = query.toUpperCase();
  return Object.entries(BASE_PRICES)
    .filter(([sym, data]) => sym.includes(q) || data.name.toUpperCase().includes(q))
    .map(([sym]) => getQuote(sym)!)
    .slice(0, 10);
}

// Generate a price history series for charts (deterministic)
export function getPriceHistory(symbol: string, days = 90): { date: string; price: number }[] {
  const base = BASE_PRICES[symbol.toUpperCase()];
  if (!base) return [];
  const seed = symbol.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const series: { date: string; price: number }[] = [];
  let price = base.price * 0.82; // start ~18% lower
  for (let i = days; i >= 0; i--) {
    const x = Math.sin(seed + (days - i) * 0.7) * Math.cos((days - i) * 0.3);
    price = price * (1 + x * 0.025 + 0.002); // drift up with noise
    const date = new Date(Date.now() - i * 86400000).toISOString().split("T")[0];
    series.push({ date, price: Math.round(price * 100) / 100 });
  }
  // Force last point to current price
  if (series.length) series[series.length - 1].price = base.price;
  return series;
}
