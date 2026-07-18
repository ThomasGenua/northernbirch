import { NextRequest, NextResponse } from "next/server";
import { getAllQuotes, getQuote, searchSymbols, getPriceHistory } from "@/lib/market";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const symbol = url.searchParams.get("symbol");
  const search = url.searchParams.get("search");
  const history = url.searchParams.get("history");

  if (history) {
    return NextResponse.json({ history: getPriceHistory(history, 90) });
  }
  if (symbol) {
    const quote = getQuote(symbol);
    if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ quote });
  }
  if (search) {
    return NextResponse.json({ results: searchSymbols(search) });
  }
  return NextResponse.json({ quotes: getAllQuotes() });
}
