import { NextRequest, NextResponse } from "next/server";
import { chatWithLLM } from "@/lib/llm";
import { parseResumeWithLLM } from "@/lib/api-client";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@supabase/supabase-js";
import { applyRateLimit } from "@/lib/rate-limiter";

export const runtime = "nodejs";
export const maxDuration = 60;

// ── PDF Text Extraction ────────────────────────────────────────────────────────

import { extractText } from "unpdf";

/**
 * Extract text from a PDF buffer using unpdf.
 */
async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const header = buffer.slice(0, 5).toString();
    if (!header.startsWith('%PDF')) {
      throw new Error("File is not a valid PDF payload.");
    }
    
    // unpdf takes a Uint8Array
    const uint8Array = new Uint8Array(buffer);
    const { text } = await extractText(uint8Array, { mergePages: true });
    return text || "";
  } catch (err: any) {
    throw new Error(`PDF Parse Error: ${err.message}`);
  }
}

// ── Background Enrichment ──────────────────────────────────────────────────────

/**
 * Fires skill-vector + market-analysis computation in the background
 * and persists the results to the users table.
 * This runs non-blocking after the resume parse response is sent.
 */
async function enrichProfileInBackground(params: {
  userId: string;
  skills: string[];
  careerGoal: string;
  experienceLevel: string;
}) {
  const { userId, skills, careerGoal, experienceLevel } = params;
  const admin = getSupabaseAdmin();

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Compute skill vector score
    const svRes = await fetch(`${baseUrl}/api/skill-vector`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userSkills: skills, careerGoal, experienceLevel }),
    });

    let skillVectorData: {
      totalScore?: number;
      skillScores?: unknown;
      qualifiedJobs?: unknown;
      breakdown?: unknown;
    } | null = null;

    if (svRes.ok) {
      skillVectorData = await svRes.json();
    }

    // Compute market intelligence
    const miRes = await fetch(`${baseUrl}/api/market-intelligence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: careerGoal, userSkills: skills }),
    });

    let marketData: {
      matchScore?: number;
      skills?: string[];
      salary?: unknown;
      trends?: string[];
      demand?: string;
    } | null = null;

    if (miRes.ok) {
      marketData = await miRes.json();
    }

    // Persist all enrichment to the users table
    const updatePayload: Record<string, unknown> = {};

    if (skillVectorData) {
      updatePayload.skill_vector_score = skillVectorData.totalScore ?? 0;
      updatePayload.skill_scores = skillVectorData.skillScores ?? {};
      updatePayload.qualified_jobs = skillVectorData.qualifiedJobs ?? [];
      updatePayload.vector_updated_at = new Date().toISOString();
    }

    if (marketData) {
      updatePayload.market_fit_score = marketData.matchScore ?? 0;
      updatePayload.market_analysis = marketData;
      updatePayload.market_updated_at = new Date().toISOString();
    }

    if (Object.keys(updatePayload).length > 0) {
      const { error } = await admin
        .from("users")
        // @ts-ignore
        .update(updatePayload)
        .eq("id", userId);

      if (error) {
        console.error("[parse-resume] Background enrichment DB update error:", error);
      } else {
        console.log(`[parse-resume] ✅ Enrichment saved for user ${userId} — SV: ${skillVectorData?.totalScore}, MI match: ${marketData?.matchScore}`);
      }
    }
  } catch (err) {
    // Non-critical — don't let this surface to the user
    console.error("[parse-resume] Background enrichment failed:", err);
  }
}

// ── POST Handler ──────────────────────────────────────────────────────────────

/**
 * POST /api/parse-resume
 * Accepts a multipart form upload with a `resume` file (PDF or DOCX).
 * Optionally includes `userId` field to persist extracted data + trigger enrichment.
 * Returns structured profile data extracted by the LLM.
 */
export async function POST(req: NextRequest) {
  // ── Apply Rate Limit (Defense-in-depth) ────────────────────────────────────
  const limited = applyRateLimit(req, "parse-resume");
  if (limited) return limited;

  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    // Optional: user ID passed from the client for DB persistence
    const userId = formData.get("userId") as string | null;

    // Optional: auth token for verifying the user on the server
    const authToken = formData.get("authToken") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    // Also allow by filename extension as MIME can be unreliable
    const fileName = file.name.toLowerCase();
    const isPdf = fileName.endsWith(".pdf") || file.type === "application/pdf";
    const isDocx =
      fileName.endsWith(".docx") ||
      fileName.endsWith(".doc") ||
      file.type.includes("wordprocessingml") ||
      file.type === "application/msword";

    if (!isPdf && !isDocx) {
      return NextResponse.json(
        { error: "Only PDF and DOCX files are supported." },
        { status: 415 }
      );
    }

    // ── Extract raw data & Parse ──────────────────────────────────────────────
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let parsed: Record<string, any> | null = null;
    let trimmedText = "";

    const systemPrompt = `You are an expert resume parser. Extract structured career data from the provided resume and return ONLY valid JSON — no markdown fences, no explanation.

Return this exact JSON shape:
{
  "name": "Full Name",
  "institution": "University/Company",
  "career_goal": "A concise one-line career goal inferred from the resume",
  "education": "One of: High School | Undergraduate | Graduate | Doctorate | Working Professional",
  "experience_level": "One of: Beginner | Intermediate | Advanced",
  "skills": ["skill1", "skill2"],
  "summary": "2-3 sentence professional summary",
  "years_of_experience": 0,
  "languages": ["Python"],
  "certifications": ["AWS"],
  "projects": ["Project Name"],
  "work_history": [{"title": "Job Title", "company": "Company", "duration": "Duration"}]
}

Rules:
- technical skills only for the skills array (max 25)
- Return ONLY the JSON object`;

    // 1. Extract raw text
    console.log("[parse-resume] 📄 Extracting raw text content...");
    let rawText = "";

    if (isPdf) {
      rawText = await extractPdfText(buffer);
    } else {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value;
    }

    trimmedText = rawText.slice(0, 10000).trim();

    if (!trimmedText || trimmedText.length < 50) {
      return NextResponse.json(
        { error: "Could not extract readable text from this file." },
        { status: 422 }
      );
    }

    // 2. Parse using the prioritized LLM engine (Favors your new GitHub GPT-4o Token)
    try {
      console.log("[parse-resume] 🚀 Parsing with high-performance GitHub Model (GPT-4o)...");
      parsed = await parseResumeWithLLM(trimmedText, systemPrompt);
    } catch (err) {
      console.warn("[parse-resume] Specialized parser failed, using basic chat fallback:", err);
      const llmResponse = await chatWithLLM([
        { role: "system", content: systemPrompt },
        { role: "user", content: `Extract from:\n\n${trimmedText}` },
      ]);
      try {
        const cleaned = llmResponse.replace(/```json|```/gi, "").trim();
        parsed = JSON.parse(cleaned);
      } catch {
        return NextResponse.json({ error: "Failed to parse resume." }, { status: 502 });
      }
    }

    if (!parsed) {
      return NextResponse.json({ error: "Failed to parse resume." }, { status: 500 });
    }

    // ── Persist to DB if user is authenticated ────────────────────────────────
    let verifiedUserId: string | null = userId;

    if (authToken && !verifiedUserId) {
      // Verify the token and get the user ID from Supabase
      try {
        const anonClient = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: { user } } = await anonClient.auth.getUser(authToken);
        if (user) verifiedUserId = user.id;
      } catch {
        console.warn("[parse-resume] Could not verify auth token");
      }
    }

    if (verifiedUserId) {
      const admin = getSupabaseAdmin();

      // Upsert the extracted profile data into the users table
      const profilePayload = {
        name: (parsed.name as string) || undefined,
        institution: (parsed.institution as string) || undefined,
        career_goal: (parsed.career_goal as string) || undefined,
        education: (parsed.education as string) || undefined,
        experience_level: (parsed.experience_level as string) || undefined,
        skills: Array.isArray(parsed.skills) && parsed.skills.length > 0
          ? parsed.skills
          : undefined,
        // Extended profile data (stored as a rich jsonb blob)
        resume_data: {
          summary: parsed.summary,
          years_of_experience: parsed.years_of_experience,
          languages: parsed.languages,
          certifications: parsed.certifications,
          projects: parsed.projects,
          work_history: parsed.work_history,
          parsed_at: new Date().toISOString(),
          raw_text_preview: trimmedText ? trimmedText.slice(0, 500) : "Parsed via multimodal",
        },
      };

      // Remove undefined keys
      const cleanPayload = Object.fromEntries(
        Object.entries(profilePayload).filter(([, v]) => v !== undefined)
      );

      const { error: dbError } = await admin
        .from("users")
        // @ts-ignore
        .update(cleanPayload)
        .eq("id", verifiedUserId);

      if (dbError) {
        console.error("[parse-resume] DB save error:", dbError);
      } else {
        console.log(`[parse-resume] ✅ Profile saved for user ${verifiedUserId}`);

        // Trigger background enrichment (non-blocking)
        const skills = (parsed.skills as string[]) || [];
        const careerGoal = (parsed.career_goal as string) || "";
        const experienceLevel = (parsed.experience_level as string) || "Beginner";

        if (skills.length > 0 && careerGoal) {
          enrichProfileInBackground({
            userId: verifiedUserId,
            skills,
            careerGoal,
            experienceLevel,
          }).catch(console.error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: parsed,
      saved: !!verifiedUserId,
    });
  } catch (err) {
    console.error("[parse-resume] Error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while parsing the resume.",
      },
      { status: 500 }
    );
  }
}
