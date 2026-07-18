import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentMember } from "@/lib/auth";
import { getQuote } from "@/lib/market";

const TradeSchema = z.object({
  portfolioId: z.string(),
  symbol: z.string().min(1).max(10),
  side: z.enum(["BUY", "SELL"]),
  quantity: z.number().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const member = await getCurrentMember();
    if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = TradeSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const portfolio = await prisma.portfolio.findFirst({
      where: { id: parsed.data.portfolioId, memberId: member.id },
      include: { holdings: true },
    });
    if (!portfolio) return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });

    const quote = getQuote(parsed.data.symbol);
    if (!quote) return NextResponse.json({ error: "Symbol not found" }, { status: 404 });

    const totalAmount = Math.round(parsed.data.quantity * quote.price * 100) / 100;

    const result = await prisma.$transaction(async (tx: any) => {
      const trade = await tx.trade.create({
        data: {
          portfolioId: portfolio.id, memberId: member.id,
          symbol: quote.symbol, name: quote.name, assetType: quote.assetType,
          side: parsed.data.side, quantity: parsed.data.quantity.toString(),
          price: quote.price.toString(), totalAmount: totalAmount.toString(),
          status: "FILLED",
        },
      });

      const existing = portfolio.holdings.find((h: any) => h.symbol === quote.symbol);
      if (parsed.data.side === "BUY") {
        if (Number(portfolio.cashBalance) < totalAmount) {
          throw new Error("Insufficient cash");
        }
        if (existing) {
          const newQty = Number(existing.quantity) + parsed.data.quantity;
          const newAvg = ((Number(existing.quantity) * Number(existing.avgCost)) + totalAmount) / newQty;
          await tx.holding.update({ where: { id: existing.id }, data: { quantity: newQty.toString(), avgCost: newAvg.toFixed(4), currentPrice: quote.price.toString() } });
        } else {
          await tx.holding.create({
            data: { portfolioId: portfolio.id, symbol: quote.symbol, name: quote.name, assetType: quote.assetType, quantity: parsed.data.quantity.toString(), avgCost: quote.price.toString(), currentPrice: quote.price.toString() },
          });
        }
        await tx.portfolio.update({ where: { id: portfolio.id }, data: { cashBalance: { decrement: totalAmount } } });
      } else {
        if (!existing || Number(existing.quantity) < parsed.data.quantity) {
          throw new Error("Insufficient holdings");
        }
        const newQty = Number(existing.quantity) - parsed.data.quantity;
        if (newQty === 0) {
          await tx.holding.delete({ where: { id: existing.id } });
        } else {
          await tx.holding.update({ where: { id: existing.id }, data: { quantity: newQty.toString() } });
        }
        await tx.portfolio.update({ where: { id: portfolio.id }, data: { cashBalance: { increment: totalAmount } } });
      }
      return trade;
    });

    return NextResponse.json({ trade: result });
  } catch (err: any) {
    if (err.message === "Insufficient holdings") {
      return NextResponse.json({ error: "Insufficient holdings to sell" }, { status: 400 });
    }
    if (err.message === "Insufficient cash") {
      return NextResponse.json({ error: "Insufficient cash in this account. Add funds or choose a smaller quantity." }, { status: 400 });
    }
    console.error("[/api/trades POST]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const trades = await prisma.trade.findMany({
    where: { memberId: member.id },
    orderBy: { executedAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ trades });
}
