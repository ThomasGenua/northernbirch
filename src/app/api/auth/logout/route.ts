import { NextRequest, NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await clearSession();
  // HTML form posts (dashboard Sign Out) need a redirect; fetch callers get JSON.
  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    return NextResponse.redirect(new URL("/", req.url), { status: 303 });
  }
  return NextResponse.json({ ok: true });
}
