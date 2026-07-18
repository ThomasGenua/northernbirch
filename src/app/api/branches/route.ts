import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const branches = await prisma.branch.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, address: true, city: true, phone: true },
  });
  return NextResponse.json({ branches });
}
