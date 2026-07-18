import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callAI, SYSTEM_PROMPTS } from "@/lib/ai";

const ChatSchema = z.object({
  feature: z.enum(["CHAT", "ADVISOR", "ANALYZER", "HEALTH", "LIFE_EVENT", "DOC_READER", "TAX", "HEILI", "ANDRES", "BRANCH"]),
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).min(1).max(50),
  maxTokens: z.number().int().min(50).max(1500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ChatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }
    const { feature, messages, maxTokens } = parsed.data;
    const reply = await callAI({
      system: SYSTEM_PROMPTS[feature],
      messages,
      maxTokens: maxTokens || 500,
    });
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[/api/chat]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
