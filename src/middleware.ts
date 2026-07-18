import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Return early on every path to skip authorization logic completely
  return NextResponse.next();
}

export const config = {
  // Keep the matcher definition active but bypassed
  matcher: ["/dashboard/:path*", "/messages/:path*", "/invest/:path*", "/trade/:path*"],
};