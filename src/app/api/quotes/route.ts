import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentMember } from "@/lib/auth";
import { calculateQuote } from "@/lib/quotes";

const QuoteSchema = z.object({
  type: z.enum(["TERM_LIFE", "HOME", "AUTO", "TRAVEL", "CRITICAL_ILLNESS", "DISABILITY"]),
  inputs: z.record(z.unknown()),
  save: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = QuoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const result = calculateQuote(parsed.data.type, parsed.data.inputs as never);

    let savedQuote = null;
    if (parsed.data.save) {
      const member = await getCurrentMember();
      savedQuote = await prisma.quote.create({
        data: {
          memberId: member?.id ?? null,
          type: parsed.data.type,
          inputs: parsed.data.inputs as object,
          monthlyPremium: result.monthlyPremium.toString(),
          annualPremium: result.annualPremium.toString(),
          coverageAmount: result.coverageAmount?.toString() ?? null,
          expiresAt: new Date(Date.now() + 30 * 86400000),
        },
      });
    }

    return NextResponse.json({ result, quoteId: savedQuote?.id });
  } catch (err) {
    console.error("[/api/quotes]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const quotes = await prisma.quote.findMany({
    where: { memberId: member.id, expiresAt: { gte: new Date() } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json({ quotes });
}
