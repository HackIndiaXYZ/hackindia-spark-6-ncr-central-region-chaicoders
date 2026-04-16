import { NextRequest, NextResponse } from "next/server";
import { chatWithMarketLLM } from "@/lib/llm";
import { fetchWithKeyRotation, fetchLinkedInJobs } from "@/lib/api-client";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { applyRateLimit } from "@/lib/rate-limiter";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TrendDataPoint {
  label: string;         // e.g. "Q1 2025"
  demandIndex: number;   // 0–100 normalized demand
}

export interface SalaryBand {
  percentile: string;    // "P25", "Median", "P75", "P90"
  value: number;         // annual USD
}

export interface LiveJob {
  title: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  matchPct: number;
  requiredSkills: string[];
  postedDate?: string;
}

export interface MarketIntelligenceResult {
  // ── Core Scores ──────────────────────────────────────────────────────────────
  marketFitScore: number;       // 0–100 final weighted score
  demandIndex: number;          // 0–100 how in-demand the role is
  competitionIndex: number;     // 0–100 how crowded the market is (lower = less competition)
  growthTrajectory: number;     // 0–100 future growth potential

  // ── Match Details ────────────────────────────────────────────────────────────
  matchedSkills: string[];
  skillGaps: SkillGap[];

  // ── Market Data ──────────────────────────────────────────────────────────────
  salary: { min: number; max: number; median: number; currency: string };
  salaryBands: SalaryBand[];
  demand: "High" | "Medium" | "Low";
  trends: string[];
  trendHistory: TrendDataPoint[];

  // ── Jobs ─────────────────────────────────────────────────────────────────────
  liveJobs: LiveJob[];
  totalJobCount: number;        // estimated total open positions

  // ── AI Insight ───────────────────────────────────────────────────────────────
  aiInsight: string;
  careerAdvice: string;

  // ── Formula Breakdown ───────────────────────────────────────────────────────
  breakdown: {
    skillAlignmentPct: number;  // % of required skills matched
    salaryPositionPct: number;  // where user might land in salary band
    demandWeightPct: number;    // contribution of role demand to score
    growthBonus: number;        // bonus for high-growth roles
  };
}

interface SkillGap {
  skill: string;
  priority: "Critical" | "High" | "Medium";
  impactPct: number;  // estimated salary/fit impact %
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────

async function fetchJSearchJobs(role: string) {
  try {
    const json = await fetchWithKeyRotation({
      url: `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(role)}&num_pages=2&date_posted=all`,
      host: "jsearch.p.rapidapi.com",
      timeoutMs: 8000,
    });
    return (json?.data || []) as any[];
  } catch (error) {
    console.warn("[MarketIntel] JSearch failed:", error instanceof Error ? error.message : error);
    return [];
  }
}

async function fetchActiveJobs(role: string) {
  try {
    const json = await fetchWithKeyRotation({
      url: `https://active-jobs-db.p.rapidapi.com/active-ats-1h?offset=0&title_filter=${encodeURIComponent(`"${role}"`)}&description_type=text`,
      host: "active-jobs-db.p.rapidapi.com",
      timeoutMs: 8000,
    });
    return (json || []) as any[];
  } catch (error) {
    console.warn("[MarketIntel] ActiveJobsDB failed:", error instanceof Error ? error.message : error);
    return [];
  }
}

// ─── Core Scoring Engine ──────────────────────────────────────────────────────

/**
 * MARKET INTELLIGENCE SCORING ALGORITHM
 *
 * marketFitScore = (SkillAlignment × 0.40) + (DemandIndex × 0.25) + (GrowthTrajectory × 0.20) + (CompetitionBonus × 0.15)
 *
 * - SkillAlignment:    semantic match between user skills and job requirements (0–100)
 * - DemandIndex:       normalized count of active job postings × salary premium indicator (0–100)
 * - GrowthTrajectory:  AI-assessed future outlook for this role (0–100)
 * - CompetitionBonus:  inverse of how many candidates compete (low competition = higher bonus)
 *
 * Additional:
 * - SalaryPosition:    where in salary distribution user skills place them (informs advice)
 * - SkillGaps ranked by "impactPct" = estimated salary uplift for each missing skill
 */
function computeMarketFitScore(params: {
  userSkills: string[];
  requiredSkills: string[];
  demandRaw: "High" | "Medium" | "Low";
  totalJobCount: number;
  aiGrowthScore: number;
  salaryMin: number;
  salaryMax: number;
}): {
  marketFitScore: number;
  demandIndex: number;
  competitionIndex: number;
  growthTrajectory: number;
  skillAlignmentPct: number;
  salaryPositionPct: number;
  demandWeightPct: number;
  growthBonus: number;
  matchedSkills: string[];
} {
  const { userSkills, requiredSkills, demandRaw, totalJobCount, aiGrowthScore, salaryMin, salaryMax } = params;

  const userLower = userSkills.map(s => s.toLowerCase());
  const matched = requiredSkills.filter(rs =>
    userLower.some(us => us.includes(rs.toLowerCase()) || rs.toLowerCase().includes(us))
  );
  const skillAlignmentPct = requiredSkills.length > 0
    ? Math.round((matched.length / requiredSkills.length) * 100)
    : 0;

  // DemandIndex: normalize job count (cap at 500) + demand tier bonus
  const demandTierBonus = demandRaw === "High" ? 30 : demandRaw === "Medium" ? 15 : 0;
  const demandIndex = Math.min(Math.round((totalJobCount / 500) * 70 + demandTierBonus), 100);

  // CompetitionIndex: inverse of demand (high demand = more competition)
  // Tempered so it doesn't tank the score too much
  const competitionIndex = Math.max(100 - Math.round(demandIndex * 0.6), 20);

  // GrowthTrajectory: from LLM + salary spread as proxy for premium roles
  const salarySpreadBonus = salaryMax > 0 && salaryMin > 0
    ? Math.min(Math.round(((salaryMax - salaryMin) / salaryMax) * 40), 40)
    : 20;
  const growthTrajectory = Math.min(Math.round(aiGrowthScore * 0.6 + salarySpreadBonus), 100);

  // Weighted composite
  const competitionBonus = 100 - competitionIndex; // lower competition → higher bonus
  const marketFitScore = Math.min(Math.round(
    skillAlignmentPct   * 0.40 +
    demandIndex         * 0.25 +
    growthTrajectory    * 0.20 +
    competitionBonus    * 0.15
  ), 100);

  // Salary position (what percentile would user likely land in given their skills)
  const salaryPositionPct = Math.min(Math.round(skillAlignmentPct * 0.7 + 20), 90);

  return {
    marketFitScore,
    demandIndex,
    competitionIndex,
    growthTrajectory,
    skillAlignmentPct,
    salaryPositionPct,
    demandWeightPct: Math.round(demandIndex * 0.25),
    growthBonus: Math.round(growthTrajectory * 0.20),
    matchedSkills: matched,
  };
}

// ─── Job Cards ────────────────────────────────────────────────────────────────

function buildLiveJobs(
  jsearchJobs: any[],
  activeJobs: any[],
  linkedInJobsNorm: { title: string; company: string; location: string; description: string; min_salary?: number; max_salary?: number }[],
  userSkills: string[],
  requiredSkills: string[]
): LiveJob[] {
  const userLower = userSkills.map(s => s.toLowerCase());

  const scoreJob = (desc: string, title: string, company: string, location: string, salMin?: number, salMax?: number): LiveJob => {
    const descLow = desc.toLowerCase();
    const needed = requiredSkills.filter(rs => descLow.includes(rs.toLowerCase()));
    const matched = needed.filter(rs => userLower.some(us => us.includes(rs.toLowerCase()) || rs.toLowerCase().includes(us)));
    return {
      title,
      company,
      location,
      salaryMin: salMin,
      salaryMax: salMax,
      matchPct: needed.length > 0 ? Math.round((matched.length / needed.length) * 100) : 50,
      requiredSkills: needed.slice(0, 5),
    };
  };

  const jsJobs: LiveJob[] = jsearchJobs.slice(0, 8).map(j =>
    scoreJob(
      j.job_description || "",
      j.job_title || "",
      j.employer_name || "Unknown",
      j.job_city || j.job_country || "Remote",
      j.job_min_salary,
      j.job_max_salary,
    )
  );

  const ajJobs: LiveJob[] = activeJobs.slice(0, 6).map(j =>
    scoreJob(
      j.job_description || j.description || "",
      j.job_title || j.title || "",
      j.company || "Unknown",
      j.location || "Remote",
      j.salary_min,
      j.salary_max,
    )
  );

  const liJobs: LiveJob[] = linkedInJobsNorm.slice(0, 8).map(j =>
    scoreJob(j.description, j.title, j.company, j.location, j.min_salary, j.max_salary)
  );

  return [...jsJobs, ...ajJobs, ...liJobs]
    .filter(j => j.title)
    .sort((a, b) => b.matchPct - a.matchPct)
    .slice(0, 12);
}

// ─── DB Skill Weights Loader ──────────────────────────────────────────────────

async function loadDbSkillWeights(roleNorm: string): Promise<{ skill: string; weight: number }[] | null> {
  try {
    const supabase = getSupabaseAdmin();
    const cutoff = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from("skill_market_weights")
      .select("weighted_demand_score, skills_catalog ( name )")
      .eq("role_filter", roleNorm)
      .gte("computed_at", cutoff)
      .order("weighted_demand_score", { ascending: false })
      .limit(15);

    if (!data || data.length < 3) return null;
    return data.map((row: any) => ({
      skill: row.skills_catalog?.name ?? "",
      weight: row.weighted_demand_score ?? 0,
    })).filter(r => r.skill);
  } catch {
    return null;
  }
}

// ─── Trigger background sync for a role ───────────────────────────────────────

async function triggerJobsSync(role: string, baseUrl: string): Promise<number> {
  try {
    const res = await fetch(`${baseUrl}/api/jobs/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.totalJobs ?? 0;
  } catch {
    return 0;
  }
}

// ─── POST Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // ── Apply Rate Limit (Defense-in-depth) ────────────────────────────────────
  const limited = applyRateLimit(req, "market-intelligence");
  if (limited) return limited;

  try {
    const { userSkills, targetRole } = await req.json();

    if (!targetRole) {
      return NextResponse.json({ error: "Missing targetRole" }, { status: 400 });
    }

    const roleNorm = targetRole.trim().toLowerCase().replace(/\s+/g, " ");

    // ── Step 1: Load DB skill weights (fast path — sub-10ms if cached) ────────
    let dbWeights = await loadDbSkillWeights(roleNorm);
    let totalJobCount = 0;

    // ── Step 2: If no cached weights, trigger sync + live fetch in parallel ───
    const [jsearchJobs, activeJobsList, linkedInJobs] = await Promise.all([
      fetchJSearchJobs(targetRole),
      fetchActiveJobs(targetRole),
      fetchLinkedInJobs(targetRole, 40),
    ]);

    totalJobCount = jsearchJobs.length + activeJobsList.length + linkedInJobs.length;
    console.log(`[MarketIntel] Jobs — JSearch: ${jsearchJobs.length}, ActiveJobs: ${activeJobsList.length}, LinkedIn: ${linkedInJobs.length} | Total: ${totalJobCount}`);

    // If DB had no weights, trigger sync and wait for it (first-time role)
    if (!dbWeights) {
      const origin = req.nextUrl.origin;
      await triggerJobsSync(targetRole, origin);
      dbWeights = await loadDbSkillWeights(roleNorm);
    }

    // ── Step 3: Build job summary for LLM narrative ───────────────────────────
    const linkedInRaw = linkedInJobs.map((j) => ({
      job_title: j.title,
      employer_name: j.company,
      job_city: j.location,
      job_description: j.description,
      job_min_salary: j.min_salary,
      job_max_salary: j.max_salary,
    }));

    const allJobsForLLM = [
      ...jsearchJobs.slice(0, 5),
      ...activeJobsList.slice(0, 4),
      ...linkedInRaw.slice(0, 5),
    ];
    const jobSummary = allJobsForLLM.map(j => {
      const desc = (j.job_description || j.description || "").substring(0, 500);
      const title = j.job_title || "";
      const company = j.employer_name || j.company || "";
      const salMin = j.job_min_salary || j.salary_min || 0;
      const salMax = j.job_max_salary || j.salary_max || 0;
      return `Title: ${title}\nCompany: ${company}\nSalary: ${salMin}–${salMax} USD\nDescription: ${desc}`;
    }).join("\n\n---\n\n");

    const hasRealData = totalJobCount > 0;

    // ── Step 4: LLM — narrative/salary/trends only (NOT skill list) ───────────
    // If we have DB weights, tell the LLM what skills were detected so it can
    // focus on advice/salary/trends rather than guessing skills from scratch.
    const dbSkillList = dbWeights
      ? dbWeights.slice(0, 12).map(w => `${w.skill} (weight: ${w.weight})`).join(", ")
      : "(computing from job data)";

    const llmPrompt = hasRealData
      ? `Analyze ${totalJobCount} REAL job listings for "${targetRole}".\n\nDetected market skills (from statistical analysis): ${dbSkillList}\n\nJob data:\n\n${jobSummary}`
      : `Synthesize 2026 global market data for the role: "${targetRole}"."`;

    const llmResponse = await chatWithMarketLLM([
      {
        role: "system",
        content: "You are a quantitative career market analyst. Respond ONLY with a single JSON object. No markdown.",
      },
      {
        role: "user",
        content: `${llmPrompt}

Respond with ONLY this JSON object (do NOT invent requiredSkills — they are already provided):
{
  "demand": "High" | "Medium" | "Low",
  "salary": { "min": number, "max": number, "median": number, "currency": "USD" },
  "salaryBands": [
    { "percentile": "P25", "value": number },
    { "percentile": "Median", "value": number },
    { "percentile": "P75", "value": number },
    { "percentile": "P90", "value": number }
  ],
  "trends": ["trend1", "trend2", "trend3"],
  "trendHistory": [
    { "label": "Q1 2025", "demandIndex": number },
    { "label": "Q2 2025", "demandIndex": number },
    { "label": "Q3 2025", "demandIndex": number },
    { "label": "Q4 2025", "demandIndex": number },
    { "label": "Q1 2026", "demandIndex": number }
  ],
  "growthScore": number,
  "aiInsight": "one precise sentence about this role's 2026 outlook",
  "careerAdvice": "one actionable sentence for someone pursuing this role",
  "skillImpact": [
    { "skill": "SkillName", "impactPct": number, "priority": "Critical" | "High" | "Medium" }
  ]
}`,
      },
    ]);

    let parsed: any = {};
    try {
      parsed = JSON.parse(llmResponse.replace(/```json|```/g, "").trim());
    } catch {
      parsed = {
        requiredSkills: ["Python", "Machine Learning", "SQL", "Cloud", "Communication"],
        demand: "High",
        salary: { min: 90000, max: 160000, median: 120000, currency: "USD" },
        salaryBands: [
          { percentile: "P25", value: 85000 },
          { percentile: "Median", value: 120000 },
          { percentile: "P75", value: 150000 },
          { percentile: "P90", value: 185000 },
        ],
        trends: ["AI-augmented workflows", "Remote-first hiring", "Full-stack expectations"],
        trendHistory: [
          { label: "Q1 2025", demandIndex: 62 },
          { label: "Q2 2025", demandIndex: 68 },
          { label: "Q3 2025", demandIndex: 74 },
          { label: "Q4 2025", demandIndex: 80 },
          { label: "Q1 2026", demandIndex: 87 },
        ],
        growthScore: 80,
        aiInsight: "Demand for this role is accelerating in 2026 driven by AI integration mandates.",
        careerAdvice: "Build a portfolio with AI-integrated projects to stand out.",
        skillImpact: [],
      };
    }

    // ── Use DB weights as requiredSkills if available; LLM as fallback ────────
    const requiredSkills: string[] = dbWeights && dbWeights.length > 0
      ? dbWeights.slice(0, 12).map(w => w.skill)
      : (parsed.requiredSkills || []);

    console.log(`[MarketIntel] requiredSkills source: ${dbWeights ? "DB (statistical)" : "LLM (fallback)"} — ${requiredSkills.length} skills`);
    const demand: "High" | "Medium" | "Low" = parsed.demand || "Medium";

    // ── Scoring ───────────────────────────────────────────────────────────────
    const scores = computeMarketFitScore({
      userSkills: userSkills || [],
      requiredSkills,
      demandRaw: demand,
      totalJobCount,
      aiGrowthScore: parsed.growthScore || 70,
      salaryMin: parsed.salary?.min || 0,
      salaryMax: parsed.salary?.max || 0,
    });

    // ── Skill Gaps ────────────────────────────────────────────────────────────
    const userLower = (userSkills || []).map((s: string) => s.toLowerCase());
    const missingSkills = requiredSkills.filter(rs =>
      !userLower.some((us: string) => us.includes(rs.toLowerCase()) || rs.toLowerCase().includes(us))
    );

    // Merge with LLM impact data
    const skillImpactMap: Record<string, any> = {};
    (parsed.skillImpact || []).forEach((si: any) => { skillImpactMap[si.skill] = si; });

    const skillGaps: SkillGap[] = missingSkills.map((skill, i) => ({
      skill,
      priority: skillImpactMap[skill]?.priority ||
        (i < 2 ? "Critical" : i < 4 ? "High" : "Medium"),
      impactPct: skillImpactMap[skill]?.impactPct || Math.round(25 - i * 4),
    }));

    // ── Live Jobs ─────────────────────────────────────────────────────────────
    const liveJobs = buildLiveJobs(jsearchJobs, activeJobsList, linkedInJobs, userSkills || [], requiredSkills);

    const result: MarketIntelligenceResult = {
      marketFitScore: scores.marketFitScore,
      demandIndex: scores.demandIndex,
      competitionIndex: scores.competitionIndex,
      growthTrajectory: scores.growthTrajectory,
      matchedSkills: scores.matchedSkills,
      skillGaps,
      salary: parsed.salary || { min: 0, max: 0, median: 0, currency: "USD" },
      salaryBands: parsed.salaryBands || [],
      demand,
      trends: parsed.trends || [],
      trendHistory: parsed.trendHistory || [],
      liveJobs,
      totalJobCount,
      aiInsight: parsed.aiInsight || "",
      careerAdvice: parsed.careerAdvice || "",
      breakdown: {
        skillAlignmentPct: scores.skillAlignmentPct,
        salaryPositionPct: scores.salaryPositionPct,
        demandWeightPct: scores.demandWeightPct,
        growthBonus: scores.growthBonus,
      },
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("Market intelligence API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
