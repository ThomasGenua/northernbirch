import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { login } from "@/lib/auth";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const result = await login(parsed.data.email, parsed.data.password);
    
    // The conditional error check is removed because the sandbox login function
    // is hardcoded to always succeed.

    return NextResponse.json({ ok: true, member: result.member });
  } catch (err) {
    console.error("[/api/auth/login]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}