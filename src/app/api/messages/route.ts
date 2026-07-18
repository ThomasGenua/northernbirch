import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentMember } from "@/lib/auth";
import { callAI, SYSTEM_PROMPTS } from "@/lib/ai";

const PostSchema = z.object({
  threadId: z.string(),
  content: z.string().min(1).max(5000),
});

export async function GET(req: NextRequest) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const threadId = url.searchParams.get("threadId");
  if (threadId) {
    const thread = await prisma.messageThread.findFirst({
      where: { id: threadId, memberId: member.id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (!thread) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ thread });
  }
  const threads = await prisma.messageThread.findMany({
    where: { memberId: member.id },
    orderBy: { lastMessageAt: "desc" },
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  return NextResponse.json({ threads });
}

export async function POST(req: NextRequest) {
  try {
    const member = await getCurrentMember();
    if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = PostSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    const thread = await prisma.messageThread.findFirst({
      where: { id: parsed.data.threadId, memberId: member.id },
      include: { messages: { orderBy: { createdAt: "desc" }, take: 5 } },
    });
    if (!thread) return NextResponse.json({ error: "Thread not found" }, { status: 404 });

    // Save member message
    await prisma.message.create({
      data: {
        threadId: thread.id, fromType: "MEMBER",
        fromId: member.id, fromName: `${member.firstName} ${member.lastName}`,
        content: parsed.data.content,
      },
    });
    await prisma.messageThread.update({
      where: { id: thread.id },
      data: { lastMessageAt: new Date(), status: "AWAITING_ADVISOR" },
    });

    // AI-assisted advisor reply
    const advisorPromptKey =
      thread.advisorRole.includes("Wealth") ? "HEILI" :
      thread.advisorRole.includes("Insurance") ? "ANDRES" : "BRANCH";

    const history = thread.messages.reverse().map((m: any) => ({
      role: (m.fromType === "MEMBER" ? "user" : "assistant") as "user" | "assistant",
      content: m.content,
    }));
    history.push({ role: "user", content: parsed.data.content });

    const replyText = await callAI({
      system: SYSTEM_PROMPTS[advisorPromptKey],
      messages: history,
      maxTokens: 300,
    });

    const replyMsg = await prisma.message.create({
      data: {
        threadId: thread.id, fromType: "AI",
        fromId: thread.advisorId, fromName: thread.advisorName,
        content: replyText, aiAssisted: true,
      },
    });
    await prisma.messageThread.update({
      where: { id: thread.id },
      data: { lastMessageAt: new Date(), status: "AWAITING_MEMBER" },
    });

    return NextResponse.json({ reply: replyMsg });
  } catch (err) {
    console.error("[/api/messages POST]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
