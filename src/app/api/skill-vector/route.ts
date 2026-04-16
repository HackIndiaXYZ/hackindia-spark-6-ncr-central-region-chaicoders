import { NextRequest, NextResponse } from "next/server";
import { chatWithMarketLLM } from "@/lib/llm";
import { fetchWithKeyRotation, fetchLinkedInJobs } from "@/lib/api-client";
import { applyRateLimit } from "@/lib/rate-limiter";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RawJob {
  title: string;
  description: string;
  min_salary?: number;
  max_salary?: number;
  location?: string;
  company?: string;
}

interface SkillScore {
  skill: string;
  score: number;          // 0–100: how strongly the market demands this skill
  frequency: number;      // how many jobs mention it
  weight: number;         // normalized weight from LLM
}

interface QualifiedJob {
  title: string;
  company: string;
  location: string;
  matchPct: number;       // 0–100 how well user qualifies
  salaryMin?: number;
  salaryMax?: number;
  missingSkills: string[];
}

export interface SkillVectorResult {
  totalScore: number;           // 0–100 final weighted score
  skillScores: SkillScore[];    // per-skill breakdown
  qualifiedJobs: QualifiedJob[];
  marketSkillsRequired: string[];
  breakdown: {
    coveragePct: number;        // % of required skills the user has
    depthPct: number;           // skill depth (advanced vs beginner)
    rarityBonus: number;        // bonus for rare/high-demand skills
    experienceWeight: number;   // multiplier based on experience level
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function fetchJSearchJobs(role: string): Promise<RawJob[]> {
  try {
    const json = await fetchWithKeyRotation({
      url: `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(role)}&num_pages=2&date_posted=all`,
      host: "jsearch.p.rapidapi.com",
      timeoutMs: 8000,
    });
    if (!json) return [];
    return (json.data || []).map((j: any) => ({
      title: j.job_title || "",
      description: (j.job_description || "").substring(0, 600),
      min_salary: j.job_min_salary,
      max_salary: j.job_max_salary,
      location: j.job_city || j.job_country || "Remote",
      company: j.employer_name || "Unknown",
    }));
  } catch (error) {
    console.warn("[SkillVector] JSearch failed:", error instanceof Error ? error.message : error);
    return [];
  }
}

async function fetchActiveJobs(role: string): Promise<RawJob[]> {
  try {
    const json = await fetchWithKeyRotation({
      url: `https://active-jobs-db.p.rapidapi.com/active-ats-1h?offset=0&title_filter=${encodeURIComponent(`"${role}"`)}&description_type=text`,
      host: "active-jobs-db.p.rapidapi.com",
      timeoutMs: 8000,
    });
    if (!json) return [];
    return (json || []).map((j: any) => ({
      title: j.job_title || "",
      description: (j.job_description || "").substring(0, 600),
      min_salary: j.salary_min,
      max_salary: j.salary_max,
      location: j.location || "Remote",
      company: j.company || "Unknown",
    }));
  } catch (error) {
    console.warn("[SkillVector] ActiveJobsDB failed:", error instanceof Error ? error.message : error);
    return [];
  }
}

// ─── Core Scoring Engine ──────────────────────────────────────────────────────

/**
 * SKILL VECTOR SCORING ALGORITHM
 * 
 * Final Score = (Coverage × 0.40) + (Depth × 0.30) + (RarityBonus × 0.20) + (ExperienceWeight × 0.10)
 * 
 * - Coverage:         % of market-required skills the user possesses (0-100)
 * - Depth:            Weighted by experience_level multiplier (Beginner=0.4, Intermediate=0.7, Advanced=1.0)
 * - RarityBonus:      Extra points for skills that appear in <30% of jobs but are listed as "required"
 * - ExperienceWeight: Base lift based on user's stated experience level
 */
function computeScore(params: {
  userSkills: string[];
  marketSkills: SkillScore[];
  experienceLevel: string;
}): {
  totalScore: number;
  breakdown: SkillVectorResult["breakdown"];
} {
  const { userSkills, marketSkills, experienceLevel } = params;
  const userSkillsLower = userSkills.map(s => s.toLowerCase());

  const expMultiplier =
    experienceLevel === "Advanced" ? 1.0 :
    experienceLevel === "Intermediate" ? 0.75 :
    0.5; // Beginner

  // 1. Coverage: what % of required market skills does user have?
  const requiredSkills = marketSkills.filter(ms => ms.score >= 60);
  const matchedRequired = requiredSkills.filter(ms =>
    userSkillsLower.some(us => us.includes(ms.skill.toLowerCase()) || ms.skill.toLowerCase().includes(us))
  );
  const coveragePct = requiredSkills.length > 0
    ? Math.min((matchedRequired.length / requiredSkills.length) * 100, 100)
    : 50;

  // 2. Depth: coverage weighted by skill demand score
  const totalDemandWeight = marketSkills.reduce((a, ms) => a + ms.score, 0) || 1;
  const earnedDepthWeight = marketSkills
    .filter(ms => userSkillsLower.some(us => us.includes(ms.skill.toLowerCase()) || ms.skill.toLowerCase().includes(us)))
    .reduce((a, ms) => a + ms.score, 0);
  const depthPct = Math.min((earnedDepthWeight / totalDemandWeight) * 100, 100);

  // 3. Rarity Bonus: high-impact, low-frequency skills the user has
  const rareSkills = marketSkills.filter(ms => ms.frequency <= 3 && ms.score >= 70);
  const earnedRareCount = rareSkills.filter(ms =>
    userSkillsLower.some(us => us.includes(ms.skill.toLowerCase()) || ms.skill.toLowerCase().includes(us))
  ).length;
  const rarityBonus = Math.min((earnedRareCount / Math.max(rareSkills.length, 1)) * 100, 100);

  // 4. Experience weight (already a 0-100 value)
  const experienceWeight = expMultiplier * 100;

  // Weighted composite formula
  const totalScore = Math.round(
    coveragePct * 0.40 +
    depthPct    * 0.30 +
    rarityBonus * 0.20 +
    experienceWeight * 0.10
  );

  return {
    totalScore: Math.min(totalScore, 100),
    breakdown: {
      coveragePct: Math.round(coveragePct),
      depthPct: Math.round(depthPct),
      rarityBonus: Math.round(rarityBonus),
      experienceWeight: Math.round(experienceWeight),
    },
  };
}

// ─── Job Match Engine ─────────────────────────────────────────────────────────

function computeJobMatches(
  jobs: RawJob[],
  userSkills: string[],
  marketSkills: SkillScore[]
): QualifiedJob[] {
  const userSkillsLower = userSkills.map(s => s.toLowerCase());

  return jobs.slice(0, 15).map(job => {
    // Find which market skills appear in this job's description
    const jobDescLower = (job.description || "").toLowerCase();
    const relevantSkills = marketSkills.filter(ms =>
      jobDescLower.includes(ms.skill.toLowerCase())
    );

    const needed = relevantSkills.length || 1;
    const matched = relevantSkills.filter(ms =>
      userSkillsLower.some(us => us.includes(ms.skill.toLowerCase()) || ms.skill.toLowerCase().includes(us))
    );
    const missing = relevantSkills
      .filter(ms => !userSkillsLower.some(us => us.includes(ms.skill.toLowerCase()) || ms.skill.toLowerCase().includes(us)))
      .map(ms => ms.skill)
      .slice(0, 5);

    const matchPct = Math.round((matched.length / needed) * 100);

    return {
      title: job.title,
      company: job.company || "Company",
      location: job.location || "Remote",
      matchPct,
      salaryMin: job.min_salary,
      salaryMax: job.max_salary,
      missingSkills: missing,
    };
  }).filter(j => j.title).sort((a, b) => b.matchPct - a.matchPct).slice(0, 8);
}

// ─── POST Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // ── Apply Rate Limit (Defense-in-depth) ────────────────────────────────────
  const limited = applyRateLimit(req, "skill-vector");
  if (limited) return limited;

  try {
    const { userSkills, careerGoal, experienceLevel } = await req.json();

    if (!userSkills?.length || !careerGoal) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch live jobs from all 3 APIs in parallel
    const [jsearchJobs, activeJobs, linkedInJobs] = await Promise.all([
      fetchJSearchJobs(careerGoal),
      fetchActiveJobs(careerGoal),
      fetchLinkedInJobs(careerGoal, 40),
    ]);

    // Normalize LinkedIn jobs into RawJob shape
    const linkedInRaw: RawJob[] = linkedInJobs.map((j) => ({
      title: j.title,
      company: j.company,
      location: j.location,
      description: j.description,
      min_salary: j.min_salary,
      max_salary: j.max_salary,
    }));

    const allJobs: RawJob[] = [...jsearchJobs, ...activeJobs, ...linkedInRaw];
    const hasRealData = allJobs.length > 0;
    console.log(`[SkillVector] Jobs fetched — JSearch: ${jsearchJobs.length}, ActiveJobs: ${activeJobs.length}, LinkedIn: ${linkedInJobs.length} | Total: ${allJobs.length}`);

    // ── LLM Analysis: extract skill weights from real job data ────────────────
    const jobSummaries = allJobs.slice(0, 12).map(j =>
      `Title: ${j.title}\nCompany: ${j.company}\nDescription: ${j.description}`
    ).join("\n\n---\n\n");

    const llmPrompt = hasRealData
      ? `You are a career data scientist. Analyze these ${allJobs.length} REAL job listings for "${careerGoal}".\n\n${jobSummaries}\n\nExtract the top 12 skills required, with a demand_score (0-100, higher = more frequently required) and frequency (count of jobs mentioning it).`
      : `You are a career data scientist. Based on 2026 global market standards for "${careerGoal}", synthesize the top 12 skills, their demand_score (0-100), and estimated frequency.`;

    const analysisRaw = await chatWithMarketLLM([
      {
        role: "system",
        content: "You are a precise career data analyst. Respond ONLY with a JSON array. No markdown, no explanations.",
      },
      {
        role: "user",
        content: `${llmPrompt}\n\nRespond with ONLY this JSON array:\n[\n  { "skill": "SkillName", "demand_score": 85, "frequency": 8, "weight": 0.15 },\n  ...\n]\nMake sure weights sum to 1.0.`,
      },
    ]);

    let marketSkills: SkillScore[] = [];
    try {
      const cleaned = analysisRaw.replace(/```json|```/g, "").trim();
      const parsed: Array<{ skill: string; demand_score: number; frequency: number; weight: number }> = JSON.parse(cleaned);
      marketSkills = parsed.map(p => ({
        skill: p.skill,
        score: Math.min(Math.max(p.demand_score, 0), 100),
        frequency: p.frequency || 1,
        weight: p.weight || 0.08,
      }));
    } catch {
      // fallback skill set
      marketSkills = [
        { skill: "Python", score: 95, frequency: 10, weight: 0.15 },
        { skill: "Machine Learning", score: 90, frequency: 9, weight: 0.14 },
        { skill: "TypeScript", score: 80, frequency: 8, weight: 0.12 },
        { skill: "SQL", score: 75, frequency: 7, weight: 0.10 },
        { skill: "Cloud (AWS/GCP)", score: 85, frequency: 8, weight: 0.13 },
        { skill: "Docker", score: 70, frequency: 6, weight: 0.09 },
      ];
    }

    // ── Scoring ───────────────────────────────────────────────────────────────
    const { totalScore, breakdown } = computeScore({ userSkills, marketSkills, experienceLevel: experienceLevel || "Beginner" });

    // ── Job Match ─────────────────────────────────────────────────────────────
    const qualifiedJobs = computeJobMatches(allJobs, userSkills, marketSkills);

    const result: SkillVectorResult = {
      totalScore,
      skillScores: marketSkills,
      qualifiedJobs,
      marketSkillsRequired: marketSkills.map(ms => ms.skill),
      breakdown,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("Skill vector API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
