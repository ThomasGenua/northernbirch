import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentMember } from "@/lib/auth";
import { getQuote } from "@/lib/market";

export async function GET() {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await prisma.watchlist.findMany({ where: { memberId: member.id }, orderBy: { addedAt: "desc" } });
  const enriched = items.map((w: any) => {
    const q = getQuote(w.symbol);
    return { id: w.id, symbol: w.symbol, name: w.name, assetType: w.assetType, price: q?.price ?? 0, changePercent: q?.changePercent ?? 0 };
  });
  return NextResponse.json({ watchlist: enriched });
}

const AddSchema = z.object({ symbol: z.string().min(1).max(10) });

export async function POST(req: NextRequest) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = AddSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const q = getQuote(parsed.data.symbol);
  if (!q) return NextResponse.json({ error: "Symbol not found" }, { status: 404 });
  const item = await prisma.watchlist.upsert({
    where: { memberId_symbol: { memberId: member.id, symbol: q.symbol } },
    create: { memberId: member.id, symbol: q.symbol, name: q.name, assetType: q.assetType },
    update: {},
  });
  return NextResponse.json({ item });
}

export async function DELETE(req: NextRequest) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const symbol = url.searchParams.get("symbol");
  if (!symbol) return NextResponse.json({ error: "Symbol required" }, { status: 400 });
  await prisma.watchlist.deleteMany({ where: { memberId: member.id, symbol: symbol.toUpperCase() } });
  return NextResponse.json({ ok: true });
}
