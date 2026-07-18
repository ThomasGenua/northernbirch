import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentMember } from "@/lib/auth";

const TransferSchema = z.object({
  fromAccountId: z.string(),
  recipientName: z.string().min(1).max(200),
  recipientCity: z.string().min(1).max(100),
  recipientCountry: z.string().min(2).max(100),
  amountCAD: z.number().positive().max(50000),
  currency: z.string().length(3).optional(),
});

const RATES: Record<string, number> = {
  EUR: 0.6821, USD: 0.7330, GBP: 0.5765, JPY: 110.45,
};

const FEE = 4.99;

function generateTrackingId() {
  return `NB-TXN-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function POST(req: NextRequest) {
  try {
    const member = await getCurrentMember();
    if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = TransferSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const account = await prisma.account.findFirst({
      where: { id: parsed.data.fromAccountId, memberId: member.id, status: "ACTIVE" },
    });
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });

    const totalDebit = parsed.data.amountCAD + FEE;
    if (Number(account.balance) < totalDebit) {
      return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
    }

    const currency = parsed.data.currency ?? "EUR";
    const rate = RATES[currency] ?? RATES.EUR;
    const amountForeign = Math.round(parsed.data.amountCAD * rate * 100) / 100;

    const result = await prisma.$transaction(async (tx: any) => {
      const transfer = await tx.transfer.create({
        data: {
          memberId: member.id, trackingId: generateTrackingId(),
          fromAccountId: account.id,
          recipientName: parsed.data.recipientName,
          recipientCity: parsed.data.recipientCity,
          recipientCountry: parsed.data.recipientCountry,
          amountCAD: parsed.data.amountCAD.toString(),
          exchangeRate: rate.toString(),
          amountForeign: amountForeign.toString(),
          currency, fee: FEE.toString(),
          status: "PROCESSING",
        },
      });
      await tx.account.update({
        where: { id: account.id },
        data: { balance: { decrement: totalDebit } },
      });
      await tx.transaction.create({
        data: {
          accountId: account.id, memberId: member.id,
          amount: (-totalDebit).toString(),
          type: "INTL_TRANSFER",
          description: `Transfer to ${parsed.data.recipientName} - ${parsed.data.recipientCity}, ${parsed.data.recipientCountry}`,
          category: "Int'l Transfer",
        },
      });
      return transfer;
    });

    await prisma.notification.create({
      data: {
        memberId: member.id, type: "TRANSFER",
        title: "International Transfer Initiated",
        body: `Your transfer of C$${parsed.data.amountCAD} to ${parsed.data.recipientName} is processing. Tracking: ${result.trackingId}`,
        iconKey: "🌐", priority: "NORMAL",
      },
    });

    return NextResponse.json({ transfer: result });
  } catch (err) {
    console.error("[/api/transfers POST]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const transfers = await prisma.transfer.findMany({
    where: { memberId: member.id },
    orderBy: { initiatedAt: "desc" },
    take: 20,
  });
  return NextResponse.json({ transfers });
}
