/**
 * Career Intelligence System — Skill Weighter
 *
 * Computes a weighted importance score for each skill given a set of
 * normalized job postings for a target role.
 *
 * Weight Formula (0–100 scale):
 *   weight = (frequency_pct × 0.50)
 *           + (recency_pct  × 0.25)
 *           + (senior_pct   × 0.15)
 *           + (salary_prem  × 0.10)
 *
 * - frequency_pct:  % of all jobs for this role mentioning the skill
 * - recency_pct:    % of jobs posted in last 7 days mentioning it
 * - senior_pct:     % of senior/lead/staff jobs mentioning it
 * - salary_prem:    normalized salary premium compared to role median
 */

import { extractSkillsFromText } from "./skill-extractor";

export interface NormalizedJob {
  id: string;
  title: string;
  description: string;
  salary_min?: number | null;
  salary_max?: number | null;
  seniority_level?: string | null;
  created_at?: string | null;
}

export interface SkillWeight {
  skill: string;
  /** Final composite weight 0–100 */
  weight: number;
  /** % of all jobs mentioning this skill (0–100) */
  frequency: number;
  /** % of recent (7-day) jobs mentioning this skill (0–100) */
  recency: number;
  /** % of senior/lead/staff jobs mentioning this skill (0–100) */
  seniorPct: number;
  /** Salary premium: avg salary of jobs with skill vs median (0–100 normalized) */
  salaryPrem: number;
  /** Number of jobs analyzed */
  sampleSize: number;
  /** Average salary of jobs mentioning this skill */
  avgSalaryWithSkill: number;
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const SENIOR_TITLES = ["senior", "lead", "staff", "principal", "architect", "head", "director"];

/** Determine if a job title is senior-level */
function isSeniorJob(title: string, level: string | null | undefined): boolean {
  if (level && ["senior", "lead", "staff", "principal"].includes(level.toLowerCase())) return true;
  const t = title.toLowerCase();
  return SENIOR_TITLES.some(kw => t.includes(kw));
}

/** Determine if a job was posted within the last 7 days */
function isRecent(createdAt: string | null | undefined): boolean {
  if (!createdAt) return false;
  const posted = new Date(createdAt).getTime();
  return Date.now() - posted < SEVEN_DAYS_MS;
}

/**
 * Compute skill weights from a list of normalized job postings.
 */
export function computeSkillWeights(jobs: NormalizedJob[]): SkillWeight[] {
  if (!jobs || jobs.length === 0) return [];

  const total = jobs.length;
  const recentJobs = jobs.filter(j => isRecent(j.created_at));
  const seniorJobs = jobs.filter(j => isSeniorJob(j.title, j.seniority_level));

  // Compute overall median salary for the role (used for salary premium calc)
  const salaryJobs = jobs.filter(j => j.salary_min && j.salary_max);
  const avgSalaries = salaryJobs.map(j => ((j.salary_min ?? 0) + (j.salary_max ?? 0)) / 2);
  const medianSalary = avgSalaries.length > 0
    ? avgSalaries.sort((a, b) => a - b)[Math.floor(avgSalaries.length / 2)]
    : 0;

  // Accumulate per-skill stats
  const stats = new Map<string, {
    totalMentions: number;
    recentMentions: number;
    seniorMentions: number;
    salarySum: number;
    salaryCount: number;
  }>();

  const initStat = () => ({
    totalMentions: 0,
    recentMentions: 0,
    seniorMentions: 0,
    salarySum: 0,
    salaryCount: 0,
  });

  // Scan all jobs
  for (const job of jobs) {
    const skills = extractSkillsFromText(job.description || job.title || "");
    const avgSal = job.salary_min && job.salary_max
      ? (job.salary_min + job.salary_max) / 2
      : null;

    for (const { canonical } of skills) {
      if (!stats.has(canonical)) stats.set(canonical, initStat());
      const s = stats.get(canonical)!;
      s.totalMentions++;
      if (avgSal) { s.salarySum += avgSal; s.salaryCount++; }
    }
  }

  // Scan recent jobs
  for (const job of recentJobs) {
    const skills = extractSkillsFromText(job.description || job.title || "");
    for (const { canonical } of skills) {
      if (!stats.has(canonical)) stats.set(canonical, initStat());
      stats.get(canonical)!.recentMentions++;
    }
  }

  // Scan senior jobs  
  for (const job of seniorJobs) {
    const skills = extractSkillsFromText(job.description || job.title || "");
    for (const { canonical } of skills) {
      if (!stats.has(canonical)) stats.set(canonical, initStat());
      stats.get(canonical)!.seniorMentions++;
    }
  }

  // Build weighted results
  const results: SkillWeight[] = [];

  for (const [skill, s] of stats.entries()) {
    // Skip skills that appear in < 2% of jobs (noise)
    if (s.totalMentions < Math.max(1, Math.floor(total * 0.02))) continue;

    const frequency = Math.round((s.totalMentions / total) * 100);
    const recency   = recentJobs.length > 0
      ? Math.round((s.recentMentions / recentJobs.length) * 100)
      : frequency; // Fallback to frequency if no recent data
    const seniorPct = seniorJobs.length > 0
      ? Math.round((s.seniorMentions / seniorJobs.length) * 100)
      : frequency;

    // Salary premium: how much above median are jobs requiring this skill?
    const avgSalaryWithSkill = s.salaryCount > 0 ? s.salarySum / s.salaryCount : medianSalary;
    const rawPremium = medianSalary > 0
      ? ((avgSalaryWithSkill - medianSalary) / medianSalary) * 100
      : 0;
    // Normalize premium to 0–100 (premium of +30% → 100, -10% → ~23)
    const salaryPrem = Math.max(0, Math.min(100, Math.round(rawPremium + 50)));

    // Composite weight
    const weight = Math.min(100, Math.round(
      frequency  * 0.50 +
      recency    * 0.25 +
      seniorPct  * 0.15 +
      salaryPrem * 0.10
    ));

    results.push({
      skill,
      weight,
      frequency,
      recency,
      seniorPct,
      salaryPrem,
      sampleSize: total,
      avgSalaryWithSkill: Math.round(avgSalaryWithSkill),
    });
  }

  return results.sort((a, b) => b.weight - a.weight);
}

/**
 * Get the top N skills by weight from a result set.
 */
export function getTopSkills(weights: SkillWeight[], n = 12): string[] {
  return weights.slice(0, n).map(w => w.skill);
}

/**
 * Classify a skill's importance tier based on weight.
 */
export function getSkillTier(weight: number): "Must-Have" | "Important" | "Nice-to-Have" | "Rare" {
  if (weight >= 70) return "Must-Have";
  if (weight >= 45) return "Important";
  if (weight >= 25) return "Nice-to-Have";
  return "Rare";
}
