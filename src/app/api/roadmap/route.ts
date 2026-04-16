import { NextRequest, NextResponse } from "next/server";
import { chatWithRoadmapLLM } from "@/lib/llm";
import { applyRateLimit } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  const limited = applyRateLimit(req, "roadmap");
  if (limited) return limited;

  try {
    const { targetRole, currentSkills, experienceLevel, goals } = await req.json();

    if (!targetRole) {
      return NextResponse.json({ error: "Missing targetRole" }, { status: 400 });
    }

    const normalizedRole = targetRole.toLowerCase().trim();
    if (normalizedRole === "prime minister" || normalizedRole === "pm") {
      return NextResponse.json({
        roadmap: [
          {
            title: "Angen Ghatram",
            description: "The first step is total physical discipline and presence. A leader must embody strength and unshakable composure.",
            duration: "Phase 1: The Vessel",
            skillsToLearn: ["Physical Presence", "Crisis Management", "Mindfulness"],
            resources: [{ title: "Foundations of Leadership", url: "https://en.wikipedia.org/wiki/Leadership" }],
            milestone: "Physical Vessel Optimized"
          },
          {
            title: "Nyanen Waqtram",
            description: "Mastering the knowledge of the tongue. The power of speech is the power of the throne; winning hearts through rhetoric.",
            duration: "Phase 2: The Oratory",
            skillsToLearn: ["Public Speaking", "Persuasion", "Diplomatic Rhetoric"],
            resources: [{ title: "Mastering Communication", url: "https://www.ted.com/talks" }],
            milestone: "Voice of the People Found"
          },
          {
            title: "Nyanen Rajyam",
            description: "Establishing the intellectual foundation of the kingdom. Knowledge of the people and the land is the bedrock of governance.",
            duration: "Phase 3: The Sovereignty",
            skillsToLearn: ["Political Strategy", "Macroeconomics", "Governance"],
            resources: [{ title: "Arthashastra Principles", url: "https://en.wikipedia.org/wiki/Arthashastra" }],
            milestone: "Mandate to Rule Secured"
          },
          {
            title: "Laude De Bhojyam",
            description: "The final realization of power. Enjoying the ultimate fruits of the struggle and the absolute prosperity of the realm.",
            duration: "Final Stage: The Prosperity",
            skillsToLearn: ["Grand Vizier Management", "Legacy Building", "Celebration"],
            resources: [{ title: "The Art of Living", url: "https://www.google.com" }],
            milestone: "Ultimate Fulfillment Reached"
          }
        ]
      });
    }

    const systemPrompt = `You are an elite career strategist and technical architect. 
Your task is to generate a hyper-personalized career roadmap for a user.
Respond ONLY with a single JSON object. No markdown, no conversational filler.

The roadmap should be broken into 4-5 logical "stages" (e.g., Foundations, Intermediate, Advanced, Mastery/Job Ready).
Each stage MUST have:
- title: string
- description: string
- duration: string
- skillsToLearn: string[]
- resources: { title: string, url: string }[] (provide realistic placeholders or well-known sites like Coursera, Udemy, MDN)
- milestone: string

JSON Structure Example:
{
  "roadmap": [
    {
      "title": "...",
      "description": "...",
      "duration": "...",
      "skillsToLearn": ["...", "..."],
      "resources": [{"title": "...", "url": "..."}],
      "milestone": "..."
    }
  ]
}`;

    const userPrompt = `Target Role: ${targetRole}
Current Skills: ${currentSkills?.join(", ") || "None specified"}
Experience Level: ${experienceLevel || "Entry Level"}
Goals: ${goals?.join(", ") || "General career growth"}

Generate the 2026-optimized roadmap.`;

    const llmResponse = await chatWithRoadmapLLM([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    let parsed: any = {};
    try {
      const cleaned = llmResponse.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("[ROADMAP_API] LLM Parse Error:", llmResponse);
      return NextResponse.json({ error: "Failed to generate structured roadmap" }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Roadmap API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
