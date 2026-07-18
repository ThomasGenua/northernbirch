import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentMember } from "@/lib/auth";

const AppointmentSchema = z.object({
  service: z.enum([
    "INSURANCE_QUOTE", "MORTGAGE_CONSULTATION", "WEALTH_REVIEW", "ESTATE_PLANNING",
    "BUSINESS_INSURANCE", "INTL_TRANSFERS", "FINANCIAL_CHECKUP", "NEW_MEMBER",
  ]),
  branchId: z.string().optional(),
  scheduledAt: z.string(),
  durationMinutes: z.number().int().min(15).max(180).optional(),
  notes: z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const member = await getCurrentMember();
    if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = AppointmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const scheduledAt = new Date(parsed.data.scheduledAt);
    if (scheduledAt < new Date()) {
      return NextResponse.json({ error: "Scheduled time must be in the future" }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        memberId: member.id,
        branchId: parsed.data.branchId ?? null,
        service: parsed.data.service,
        scheduledAt,
        durationMinutes: parsed.data.durationMinutes ?? 60,
        notes: parsed.data.notes,
        status: "CONFIRMED",
      },
      include: { branch: true },
    });

    await prisma.notification.create({
      data: {
        memberId: member.id, type: "APPOINTMENT",
        title: `Appointment Confirmed: ${parsed.data.service.replace(/_/g, " ")}`,
        body: `Your appointment is scheduled for ${scheduledAt.toLocaleString("en-CA")}.`,
        iconKey: "📅", actionUrl: "/booking", actionLabel: "View Appointment",
      },
    });

    return NextResponse.json({ appointment });
  } catch (err) {
    console.error("[/api/appointments POST]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const appointments = await prisma.appointment.findMany({
    where: { memberId: member.id },
    orderBy: { scheduledAt: "desc" },
    include: { branch: true },
  });
  return NextResponse.json({ appointments });
}
