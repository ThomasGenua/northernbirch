import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { setSessionCookie } from "@/lib/auth";

const RegisterSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid registration inputs" }, { status: 400 });
    }

    // Bypass hashing & database insertion since we are in a pure client simulation layer.
    // Automatically establish a session cookie using our mock token utility.
    await setSessionCookie("mock_demo_session_token");

    return NextResponse.json(
      { 
        ok: true, 
        member: {
          id: "demo-member-101",
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          email: parsed.data.email,
        } 
      }, 
      { status: 201 }
    );
  } catch (err) {
    console.error("[/api/auth/register]", err);
    return NextResponse.json({ error: "Server simulation error" }, { status: 500 });
  }
}