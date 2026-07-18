import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentMember } from "@/lib/auth";

export async function GET() {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const policies = await prisma.policy.findMany({
    where: { memberId: member.id },
    orderBy: [{ status: "asc" }, { renewalDate: "asc" }],
  });
  return NextResponse.json({ policies });
}
