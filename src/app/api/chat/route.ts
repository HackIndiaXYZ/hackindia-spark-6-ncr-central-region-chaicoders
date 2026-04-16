import { NextRequest, NextResponse } from "next/server";
import { chatWithLLM, ChatMessage } from "@/lib/llm";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { applyRateLimit } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  // ── Apply Rate Limit (Defense-in-depth) ────────────────────────────────────
  const limited = applyRateLimit(req, "chat");
  if (limited) return limited;

  try {
    const body = (await req.json()) as { messages?: ChatMessage[]; userId?: string };
    const { messages, userId } = body;
    console.log("[CHAT_API] POST /api/chat received:", messages?.length, "messages", "userId:", userId);

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    // ── Fetch User Context ────────────────────────────────────────────────────
    let userContext = "";
    if (userId) {
      try {
        const admin = getSupabaseAdmin();
        const { data: profile, error } = await admin
          .from("users")
          .select("name, career_goal, education, experience_level, skills, resume_data, market_analysis, skill_vector_score")
          .eq("id", userId)
          .single();

        if (profile && !error) {
          const p = profile as any;
          userContext = `
USER PROFILE CONTEXT:
- Name: ${p.name || "Unknown"}
- Career Goal: ${p.career_goal || "Not set"}
- Education: ${p.education || "Not set"}
- Experience Level: ${p.experience_level || "Not set"}
- Skills: ${Array.isArray(p.skills) ? p.skills.join(", ") : "None listed"}
- Skill Vector Score: ${p.skill_vector_score || 0}/100
- Market Analysis Summary: ${p.market_analysis?.trends?.join(", ") || "No recent analysis"}

RESUME SUMMARY:
${p.resume_data?.summary || "No resume summary available."}

WORK HISTORY:
${Array.isArray(p.resume_data?.work_history) 
  ? (p.resume_data.work_history as any[]).map((j: any) => `- ${j.title} at ${j.company} (${j.duration})`).join("\n") 
  : "No work history available."}
`;
        }
      } catch (err) {
        console.warn("[CHAT_API] Failed to fetch user context:", err);
      }
    }

    // ── Build System Prompt ───────────────────────────────────────────────────
    const baseSystemPrompt = "You are an expert career advisor specializing in tech roles, resume analysis, career roadmaps, and job market intelligence. Provide actionable, data-driven, and personalized career guidance.";
    const fullSystemPrompt = userContext 
      ? `${baseSystemPrompt}\n\n${userContext}\n\nUse this context to personalize your advice. If the user mentions "my skills" or "my goals", refer to this data. Keep responses concise and professional.`
      : baseSystemPrompt;

    const conversation: ChatMessage[] = [
      { role: "system", content: fullSystemPrompt },
      ...messages.filter(m => m.role !== "system")
    ];

    const content = await chatWithLLM(conversation);

    return NextResponse.json({ content });
  } catch (error: unknown) {
    console.error("--- CHAT API SERVER SIDE ERROR ---");
    console.error(error);
    const message = error instanceof Error ? error.message : "Something went wrong";
    const details = error instanceof Error ? error.toString() : String(error);
    return NextResponse.json(
      {
        error: message,
        details,
      },
      { status: 500 }
    );
  }
}
