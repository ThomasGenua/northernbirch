import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentMember } from "@/lib/auth";

export async function GET() {
  const member = await getCurrentMember();
  if (!member) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [accounts, policies, transactions, notifications, threads, creditScore, upcomingAppointment] = await Promise.all([
    prisma.account.findMany({ where: { memberId: member.id, status: { not: "CLOSED" } }, orderBy: { type: "asc" } }),
    prisma.policy.findMany({ where: { memberId: member.id, status: "ACTIVE" }, orderBy: { renewalDate: "asc" } }),
    prisma.transaction.findMany({
      where: { memberId: member.id }, orderBy: { postedAt: "desc" }, take: 10,
    }),
    prisma.notification.findMany({
      where: { memberId: member.id }, orderBy: { createdAt: "desc" }, take: 10,
    }),
    prisma.messageThread.findMany({
      where: { memberId: member.id }, orderBy: { lastMessageAt: "desc" },
      include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
    }),
    prisma.creditScore.findUnique({ where: { memberId: member.id } }),
    prisma.appointment.findFirst({
      where: { memberId: member.id, status: { in: ["SCHEDULED", "CONFIRMED"] }, scheduledAt: { gte: new Date() } },
      orderBy: { scheduledAt: "asc" }, include: { branch: true },
    }),
  ]);

  // Compute coverage score
  const coverageTypes = ["TERM_LIFE", "HOME", "AUTO", "DISABILITY", "CRITICAL_ILLNESS", "TRAVEL"];
  const covered = coverageTypes.filter((t: any) => policies.some((p: any) => p.type === t));
  const coverageScore = Math.round((covered.length / coverageTypes.length) * 100);

  return NextResponse.json({
    member: {
      id: member.id, memberNumber: member.memberNumber,
      firstName: member.firstName, lastName: member.lastName,
      email: member.email, identityVerified: member.identityVerified,
      kycStatus: member.kycStatus, lastLogin: member.lastLogin,
      memberSince: member.memberSince, branch: member.branch,
    },
    accounts, policies, transactions, notifications,
    threads: threads.map((t: any) => ({
      id: t.id, advisorName: t.advisorName, advisorRole: t.advisorRole,
      lastMessage: t.messages[0]?.content || null, lastMessageAt: t.lastMessageAt,
    })),
    creditScore, upcomingAppointment,
    coverageScore,
    coverageBreakdown: coverageTypes.map((t: any) => ({ type: t, covered: covered.includes(t) })),
    unreadNotifications: notifications.filter((n: any) => !n.read).length,
  });
}
