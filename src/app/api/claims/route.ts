import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentMember } from "@/lib/auth";

const ClaimSchema = z.object({
  type: z.enum(["HOME", "AUTO", "TRAVEL", "LIFE", "CRITICAL_ILLNESS", "DISABILITY", "MORTGAGE_PROTECTION", "COMMERCIAL", "GROUP_BENEFITS"]),
  description: z.string().min(10).max(5000),
  incidentDate: z.string().optional(),
  policyId: z.string().optional(),
  amountClaimed: z.number().optional(),
});

function generateClaimNumber() {
  return `NB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function POST(req: NextRequest) {
  try {
    const member = await getCurrentMember();
    if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = ClaimSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const claim = await prisma.claim.create({
      data: {
        claimNumber: generateClaimNumber(),
        memberId: member.id,
        policyId: parsed.data.policyId ?? null,
        type: parsed.data.type,
        description: parsed.data.description,
        incidentDate: parsed.data.incidentDate ? new Date(parsed.data.incidentDate) : null,
        amountClaimed: parsed.data.amountClaimed?.toString(),
        status: "SUBMITTED",
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        memberId: member.id, type: "CLAIM_UPDATE",
        title: `Claim ${claim.claimNumber} Submitted`,
        body: `Your ${parsed.data.type.toLowerCase().replace("_", " ")} claim has been submitted. An adjuster will contact you within 1-2 business days.`,
        iconKey: "📝", actionUrl: "/claims", actionLabel: "View Claim",
        priority: "NORMAL",
      },
    });

    return NextResponse.json({ claim });
  } catch (err) {
    console.error("[/api/claims POST]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const claims = await prisma.claim.findMany({
    where: { memberId: member.id },
    orderBy: { filedDate: "desc" },
    include: { policy: { select: { policyNumber: true, type: true } } },
  });
  return NextResponse.json({ claims });
}
