import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentMember } from "@/lib/auth";

export async function GET() {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const portfolios = await prisma.portfolio.findMany({
    where: { memberId: member.id },
    include: { holdings: true },
    orderBy: { createdAt: "asc" },
  });

  // Compute live values
  const enriched = portfolios.map((p: any) => {
    const holdingsValue = p.holdings.reduce((sum: number, h: any) => sum + Number(h.quantity) * Number(h.currentPrice), 0) + Number(p.cashBalance);
    const costBasis = p.holdings.reduce((sum: number, h: any) => sum + Number(h.quantity) * Number(h.avgCost), 0);
    const gain = holdingsValue - costBasis;
    const gainPercent = costBasis > 0 ? (gain / costBasis) * 100 : 0;
    return {
      id: p.id, name: p.name, type: p.type, riskLevel: p.riskLevel, managed: p.managed,
      cashBalance: Number(p.cashBalance),
      totalValue: Math.round(holdingsValue * 100) / 100,
      totalDeposited: Number(p.totalDeposited),
      gain: Math.round(gain * 100) / 100,
      gainPercent: Math.round(gainPercent * 100) / 100,
      holdings: p.holdings.map((h: any) => {
        const value = Number(h.quantity) * Number(h.currentPrice);
        const cost = Number(h.quantity) * Number(h.avgCost);
        return {
          id: h.id, symbol: h.symbol, name: h.name, assetType: h.assetType,
          quantity: Number(h.quantity), avgCost: Number(h.avgCost), currentPrice: Number(h.currentPrice),
          value: Math.round(value * 100) / 100,
          gain: Math.round((value - cost) * 100) / 100,
          gainPercent: cost > 0 ? Math.round(((value - cost) / cost) * 10000) / 100 : 0,
        };
      }),
    };
  });

  const totalValue = enriched.reduce((s: number, p: any) => s + p.totalValue, 0);
  const totalDeposited = enriched.reduce((s: number, p: any) => s + p.totalDeposited, 0);
  const totalGain = totalValue - totalDeposited;

  return NextResponse.json({
    portfolios: enriched,
    summary: {
      totalValue: Math.round(totalValue * 100) / 100,
      totalDeposited: Math.round(totalDeposited * 100) / 100,
      totalGain: Math.round(totalGain * 100) / 100,
      totalGainPercent: totalDeposited > 0 ? Math.round((totalGain / totalDeposited) * 10000) / 100 : 0,
    },
  });
}
