import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentMember } from "@/lib/auth";

export async function GET() {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const notifications = await prisma.notification.findMany({
    where: { memberId: member.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const unreadCount = notifications.filter((n: any) => !n.read).length;
  return NextResponse.json({ notifications, unreadCount });
}

const PatchSchema = z.object({
  ids: z.array(z.string()).optional(),
  markAllRead: z.boolean().optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const member = await getCurrentMember();
    if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const parsed = PatchSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    if (parsed.data.markAllRead) {
      await prisma.notification.updateMany({
        where: { memberId: member.id, read: false },
        data: { read: true },
      });
    } else if (parsed.data.ids?.length) {
      await prisma.notification.updateMany({
        where: { memberId: member.id, id: { in: parsed.data.ids } },
        data: { read: true },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/notifications PATCH]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
