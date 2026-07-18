import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentMember } from "@/lib/auth";

export async function GET() {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const goals = await prisma.savingsGoal.findMany({ where: { memberId: member.id }, orderBy: { createdAt: "asc" } });
  return NextResponse.json({ goals });
}

const GoalSchema = z.object({
  name: z.string().min(1).max(100),
  targetAmount: z.number().positive(),
  currentAmount: z.number().min(0).optional(),
  targetDate: z.string().optional(),
  icon: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = GoalSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const goal = await prisma.savingsGoal.create({
    data: {
      memberId: member.id, name: parsed.data.name,
      targetAmount: parsed.data.targetAmount.toString(),
      currentAmount: (parsed.data.currentAmount ?? 0).toString(),
      targetDate: parsed.data.targetDate ? new Date(parsed.data.targetDate) : null,
      icon: parsed.data.icon ?? "🎯",
    },
  });
  return NextResponse.json({ goal });
}
