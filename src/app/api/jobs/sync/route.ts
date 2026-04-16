/**
 * Career Intelligence System — Jobs Sync API Route
 * POST /api/jobs/sync
 *
 * Fetches live job listings for a target role from 4 sources:
 *   - JSearch (RapidAPI)
 *   - Active Jobs DB (RapidAPI)
 *   - LinkedIn Job Search (RapidAPI)
 *   - Adzuna (direct API — no RapidAPI needed)
 *
 * Caches results in `raw_job_postings`, runs skill extraction, and writes
 * weighted skill scores to `skill_market_weights`.
 *
 * Cache TTL: 4 hours per role. If fresh data exists, returns cached results.
 *
 * Body: { role: string, forceRefresh?: boolean }
 * Returns: { skills: SkillWeight[], totalJobs: number, fromCache: boolean }
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchWithKeyRotation, fetchLinkedInJobs } from "@/lib/api-client";
import { computeSkillWeights, type NormalizedJob, type SkillWeight } from "@/lib/skill-weighter";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const CACHE_TTL_HOURS = 4;

// ─── Normalize role name for consistent DB storage ─────────────────────────

function normalizeRole(role: string): string {
  return role.trim().toLowerCase().replace(/\s+/g, " ");
}

// ─── Fetch from all 3 sources ─────────────────────────────────────────────

async function fetchJSearchJobs(role: string): Promise<NormalizedJob[]> {
  try {
    const json = await fetchWithKeyRotation({
      url: `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(role)}&num_pages=3&date_posted=all`,
      host: "jsearch.p.rapidapi.com",
      timeoutMs: 10000,
    });
    const jobs = json?.data ?? [];
    return jobs.map((j: any) => ({
      id: j.job_id || `jsearch-${Math.random()}`,
      title: j.job_title || "",
      description: j.job_description || "",
      salary_min: j.job_min_salary ?? null,
      salary_max: j.job_max_salary ?? null,
      seniority_level: detectSeniority(j.job_title || ""),
      created_at: j.job_posted_at_datetime_utc ?? null,
    }));
  } catch {
    return [];
  }
}

async function fetchActiveJobs(role: string): Promise<NormalizedJob[]> {
  try {
    const json = await fetchWithKeyRotation({
      url: `https://active-jobs-db.p.rapidapi.com/active-ats-1h?offset=0&title_filter=${encodeURIComponent(`"${role}"`)}&description_type=text`,
      host: "active-jobs-db.p.rapidapi.com",
      timeoutMs: 10000,
    });
    const jobs = Array.isArray(json) ? json : [];
    return jobs.map((j: any) => ({
      id: j.id || `activejobs-${Math.random()}`,
      title: j.job_title || j.title || "",
      description: j.job_description || j.description || "",
      salary_min: j.salary_min ?? null,
      salary_max: j.salary_max ?? null,
      seniority_level: detectSeniority(j.job_title || ""),
      created_at: j.published_at ?? null,
    }));
  } catch {
    return [];
  }
}

async function fetchLinkedInNormalized(role: string): Promise<NormalizedJob[]> {
  try {
    const jobs = await fetchLinkedInJobs(role, 40);
    return jobs.map((j: any) => ({
      id: j.id || `linkedin-${Math.random()}`,
      title: j.title || "",
      description: j.description || "",
      salary_min: j.min_salary ?? null,
      salary_max: j.max_salary ?? null,
      seniority_level: detectSeniority(j.title || ""),
      created_at: null,
    }));
  } catch {
    return [];
  }
}

/**
 * Adzuna Job Search API — direct REST (no RapidAPI required)
 * Docs: https://developer.adzuna.com/docs/search
 * Fetches up to 50 jobs per role from the global search endpoint.
 */
async function fetchAdzunaJobs(role: string): Promise<NormalizedJob[]> {
  const appKey = process.env.ADZUNA_APP_KEY;
  const appId  = process.env.ADZUNA_APP_ID;

  if (!appKey || !appId || appId === "your_adzuna_app_id_here") {
    // Silently skip if not configured
    return [];
  }

  try {
    const encoded = encodeURIComponent(role);
    // Use 'gb' country endpoint; Adzuna also supports us, au, ca, de, fr, in, etc.
    const url = `https://api.adzuna.com/v1/api/jobs/gb/search/1` +
      `?app_id=${appId}&app_key=${appKey}` +
      `&results_per_page=50&what=${encoded}&content-type=application/json`;

    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) {
      console.warn(`[JobsSync] Adzuna returned ${res.status}`);
      return [];
    }
    const json = await res.json();
    const results: any[] = json.results ?? [];

    return results.map((j: any) => ({
      id: `adzuna-${j.id}`,
      title: j.title || "",
      description: j.description || "",
      salary_min: j.salary_min != null ? Math.round(j.salary_min) : null,
      salary_max: j.salary_max != null ? Math.round(j.salary_max) : null,
      seniority_level: detectSeniority(j.title || ""),
      created_at: j.created ?? null,
    }));
  } catch (err) {
    console.warn("[JobsSync] Adzuna fetch failed:", err instanceof Error ? err.message : err);
    return [];
  }
}

// ─── Detect seniority from title ──────────────────────────────────────────

function detectSeniority(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("principal") || t.includes("director") || t.includes("head of")) return "principal";
  if (t.includes("lead") || t.includes("staff")) return "lead";
  if (t.includes("senior") || t.includes("sr.") || t.includes("sr ")) return "senior";
  if (t.includes("junior") || t.includes("jr.") || t.includes("jr ") || t.includes("entry")) return "junior";
  return "mid";
}

// ─── Check cache ──────────────────────────────────────────────────────────

async function getCachedJobs(roleNorm: string): Promise<NormalizedJob[] | null> {
  const supabase = getSupabaseAdmin();
  const cutoff = new Date(Date.now() - CACHE_TTL_HOURS * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("raw_job_postings")
    .select("id, title, description, salary_min, salary_max, seniority_level, created_at")
    .eq("role_query", roleNorm)
    .gte("created_at", cutoff)
    .limit(200);

  if (error || !data || data.length < 5) return null;
  return data as NormalizedJob[];
}

// ─── Persist fetched jobs ─────────────────────────────────────────────────

async function persistJobs(roleNorm: string, jobs: NormalizedJob[], source: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const rows = jobs.map(j => ({
    external_id: j.id,
    source,
    title: j.title,
    description: j.description,
    salary_min: j.salary_min,
    salary_max: j.salary_max,
    seniority_level: j.seniority_level,
    role_query: roleNorm,
    processed: false,
  }));

  // Upsert to avoid duplicates on external_id — cast to any because role_query
  // is a new column not yet in the generated Supabase types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("raw_job_postings") as any)
    .upsert(rows, { onConflict: "external_id", ignoreDuplicates: true });
}

// ─── Persist skill weights ────────────────────────────────────────────────

async function persistSkillWeights(roleNorm: string, weights: SkillWeight[]): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getSupabaseAdmin() as any;

  // Get skill IDs from skills_catalog (create missing ones)
  const skillNames = weights.map(w => w.skill);
  const { data: existingSkills } = await supabase
    .from("skills_catalog")
    .select("id, name")
    .in("name", skillNames);

  const skillMap = new Map<string, string>(
    (existingSkills ?? []).map((s: any) => [s.name, s.id])
  );

  // Insert any missing skills
  const missingSkills = skillNames.filter((n: string) => !skillMap.has(n));
  if (missingSkills.length > 0) {
    const { data: inserted } = await supabase
      .from("skills_catalog")
      .insert(missingSkills.map((name: string) => ({ name, category: "tool" })))
      .select("id, name");
    (inserted ?? []).forEach((s: any) => skillMap.set(s.name, s.id));
  }

  // Upsert weights to skill_market_weights
  const rows = weights
    .filter(w => skillMap.has(w.skill))
    .map(w => ({
      skill_id: skillMap.get(w.skill),
      role_filter: roleNorm,
      frequency_score: w.frequency,
      salary_premium_score: w.salaryPrem,
      trend_velocity_score: w.recency,
      seniority_spread_score: w.seniorPct,
      weighted_demand_score: w.weight,
      total_postings_analyzed: w.sampleSize,
      skill_occurrence_count: Math.round((w.frequency / 100) * w.sampleSize),
      avg_salary_with_skill: w.avgSalaryWithSkill,
      computed_at: new Date().toISOString(),
    }));

  if (rows.length > 0) {
    await supabase
      .from("skill_market_weights")
      .upsert(rows, { onConflict: "skill_id,role_filter" });
  }
}

// ─── Load weights from DB ─────────────────────────────────────────────────

async function loadWeightsFromDb(roleNorm: string): Promise<SkillWeight[] | null> {
  const supabase = getSupabaseAdmin();

  // Check if weights exist and are fresh (within 4 hours)
  const cutoff = new Date(Date.now() - CACHE_TTL_HOURS * 60 * 60 * 1000).toISOString();
  const { data } = await supabase
    .from("skill_market_weights")
    .select(`
      weighted_demand_score,
      frequency_score,
      trend_velocity_score,
      seniority_spread_score,
      salary_premium_score,
      total_postings_analyzed,
      avg_salary_with_skill,
      computed_at,
      skills_catalog ( name )
    `)
    .eq("role_filter", roleNorm)
    .gte("computed_at", cutoff)
    .order("weighted_demand_score", { ascending: false })
    .limit(50);

  if (!data || data.length < 3) return null;

  return data.map((row: any) => ({
    skill: row.skills_catalog?.name ?? "Unknown",
    weight: row.weighted_demand_score ?? 0,
    frequency: row.frequency_score ?? 0,
    recency: row.trend_velocity_score ?? 0,
    seniorPct: row.seniority_spread_score ?? 0,
    salaryPrem: row.salary_premium_score ?? 0,
    sampleSize: row.total_postings_analyzed ?? 0,
    avgSalaryWithSkill: row.avg_salary_with_skill ?? 0,
  }));
}

// ─── POST Handler ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, forceRefresh = false } = body;

    if (!role) {
      return NextResponse.json({ error: "Missing role" }, { status: 400 });
    }

    const roleNorm = normalizeRole(role);

    // 1. Check DB cache for weights (fastest path)
    if (!forceRefresh) {
      const cachedWeights = await loadWeightsFromDb(roleNorm);
      if (cachedWeights && cachedWeights.length > 0) {
        return NextResponse.json({
          skills: cachedWeights,
          totalJobs: cachedWeights[0]?.sampleSize ?? 0,
          fromCache: true,
          role: roleNorm,
        });
      }
    }

    // 2. Check raw_job_postings cache
    let allJobs = forceRefresh ? null : await getCachedJobs(roleNorm);
    let fromCache = allJobs !== null;

    // 3. Fetch fresh data if needed
    if (!allJobs || allJobs.length < 5) {
      console.log(`[JobsSync] Fetching live jobs for: ${role}`);
      const [jsJobs, activeJobs, liJobs, adzunaJobs] = await Promise.all([
        fetchJSearchJobs(role),
        fetchActiveJobs(role),
        fetchLinkedInNormalized(role),
        fetchAdzunaJobs(role),
      ]);

      console.log(
        `[JobsSync] Fetched — JSearch: ${jsJobs.length}, Active: ${activeJobs.length}, ` +
        `LinkedIn: ${liJobs.length}, Adzuna: ${adzunaJobs.length}`
      );

      // Persist to DB (fire and forget the slower writes)
      const persistPromises = [];
      if (jsJobs.length > 0)      persistPromises.push(persistJobs(roleNorm, jsJobs, "jsearch"));
      if (activeJobs.length > 0)  persistPromises.push(persistJobs(roleNorm, activeJobs, "activejobs"));
      if (liJobs.length > 0)      persistPromises.push(persistJobs(roleNorm, liJobs, "linkedin"));
      if (adzunaJobs.length > 0)  persistPromises.push(persistJobs(roleNorm, adzunaJobs, "adzuna"));

      allJobs = [...jsJobs, ...activeJobs, ...liJobs, ...adzunaJobs];

      // Wait for writes to land before computing weights
      await Promise.all(persistPromises);
      fromCache = false;
    }

    if (!allJobs || allJobs.length === 0) {
      return NextResponse.json({ error: "No job data available" }, { status: 503 });
    }

    // 4. Compute skill weights
    const weights = computeSkillWeights(allJobs);

    // 5. Persist weights to DB
    await persistSkillWeights(roleNorm, weights);

    console.log(`[JobsSync] Computed ${weights.length} skill weights for "${roleNorm}" from ${allJobs.length} jobs`);

    return NextResponse.json({
      skills: weights,
      totalJobs: allJobs.length,
      fromCache,
      role: roleNorm,
    });
  } catch (err) {
    console.error("[JobsSync] Error:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}

// Also support GET for quick status/preview
export async function GET(req: NextRequest) {
  const role = req.nextUrl.searchParams.get("role");
  if (!role) {
    return NextResponse.json({ error: "Missing role query param" }, { status: 400 });
  }
  const roleNorm = normalizeRole(role);
  const weights = await loadWeightsFromDb(roleNorm);
  return NextResponse.json({
    role: roleNorm,
    skills: weights ?? [],
    cached: weights !== null,
  });
}
