# Live Job Market Data — Extraction & Skill Weighting System

## What This Solves

Right now `market-intelligence` fetches jobs and sends them to the LLM to
*guess* what skills matter. That works as a fallback but it means:

- Skill weights are LLM-hallucinated, not statistically derived.
- No historical baseline — you can't track a skill's rise or fall over time.
- Every request re-fetches the same data (expensive, slow, rate-limited).

The plan below turns the pipeline into a **real signal extraction engine** with
persistent, weighted skill scores stored in Supabase.

---

## How The Full Pipeline Works

```
Job APIs (3 sources) → Raw Job Store → NLP Extraction → Skill Frequency Table
      ↓                                                         ↓
  Supabase Cache                                     Weighted Skill Scores
      ↓                                                         ↓
  LLM Enrichment  ←──────────────────────────────── Used as ground truth
      ↓
  MarketIntelligenceResult (what the UI sees)
```

---

## Data Sources You Already Have

| API | Host (RapidAPI) | What you get |
|-----|----------------|--------------|
| **JSearch** | `jsearch.p.rapidapi.com` | ~10-20 jobs / call, full description, salary |
| **Active Jobs DB** | `active-jobs-db.p.rapidapi.com` | Refreshed every hour, good for trending |
| **LinkedIn Job Search** | `linkedin-job-search-api.p.rapidapi.com` | 40 jobs per call, company info |

All 3 already call through `fetchWithKeyRotation` with multi-key rotation — good.

---

## Stage 1 — Raw Job Scraping & Caching

### Problem
Each user request refetches the same ~30 jobs for `"Software Engineer"` from
all 3 APIs. This burns your RapidAPI quota fast.

### Solution: Supabase `job_listings` cache table

```sql
CREATE TABLE job_listings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role        text NOT NULL,          -- normalized e.g. "software engineer"
  source      text NOT NULL,          -- "jsearch" | "activejobs" | "linkedin"
  title       text,
  company     text,
  location    text,
  description text,
  salary_min  numeric,
  salary_max  numeric,
  posted_at   timestamptz,
  fetched_at  timestamptz DEFAULT now(),
  raw_json    jsonb                   -- full original response, for reprocessing
);

CREATE INDEX ON job_listings(role, fetched_at DESC);
```

**Cache TTL**: 4 hours. If `fetched_at > now() - interval '4 hours'`, serve from
Supabase. Otherwise hit the APIs and upsert.

**New API route**: `/api/jobs/sync` — background job that pre-fills popular roles.

---

## Stage 2 — Skill Extraction from Job Descriptions

This is the core of the weighting system. You parse every `description` field
and count which skills appear how often.

### Method A: Keyword Matching (Fast, No Token Cost)

Maintain a **master skill taxonomy** — a flat list of ~300 canonical skills
with aliases:

```typescript
const SKILL_TAXONOMY = [
  { canonical: "Python",        aliases: ["python3", "py", "python programming"] },
  { canonical: "React",         aliases: ["reactjs", "react.js", "react native"] },
  { canonical: "TypeScript",    aliases: ["ts", "typescript"] },
  { canonical: "PostgreSQL",    aliases: ["postgres", "pg", "psql", "postgresql"] },
  { canonical: "Docker",        aliases: ["containerization", "containers", "dockerfile"] },
  { canonical: "Kubernetes",    aliases: ["k8s", "kube", "orchestration"] },
  { canonical: "Machine Learning", aliases: ["ml", "machine learning", "ml engineer"] },
  { canonical: "LLMs",          aliases: ["large language models", "gpt", "llm", "openai"] },
  // ... ~300 entries
]
```

For every job description, run a single pass:
```
for each skill in SKILL_TAXONOMY:
  if any alias appears in description (case-insensitive):
    increment skill.count for this role
```

### Method B: LLM Skill Extraction (Batched, High Quality)

For jobs where Method A misses skills (< 3 found), send to LLM:
```
"List exactly the technical skills mentioned in this job description as a JSON array"
```

Then normalize the LLM output against the taxonomy.

**Only use LLM for the ~20% of jobs where keyword matching is thin.** This
keeps token cost to a minimum.

---

## Stage 3 — Skill Frequency Weighting

### The Weight Formula

After scanning N job listings for a given role, each skill gets a **weight score**:

```
weight(skill, role) =
    (frequency_pct × 0.50)     ← % of jobs that mention this skill
  + (recency_boost  × 0.25)    ← % of this skill appearing in last 7-day window
  + (senior_boost   × 0.15)    ← % of senior/lead/staff postings that mention it
  + (salary_premium × 0.10)    ← avg salary of jobs mentioning this skill vs median
```

**frequency_pct** = `(jobs_mentioning_skill / total_jobs_for_role) × 100`
→ A skill appearing in 80/100 jobs = 80 pts on this component.

**recency_boost** = same calc but only for `fetched_at > now() - 7 days`
→ Penalizes skills that were hot 6 months ago but not now.

**senior_boost** = check if `title ILIKE '%senior%' OR '%lead%' OR '%staff%'`
→ Skills that senior roles demand are weighted more — they're the ceiling
a user needs to aim for.

**salary_premium** = `(avg_salary_of_jobs_with_skill / overall_avg_salary) - 1`
→ If Docker appears in jobs paying $180k vs median $130k → +38% premium signal.

### Storage: `skill_market_weights` table

```sql
CREATE TABLE skill_market_weights (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role         text NOT NULL,
  skill        text NOT NULL,
  weight       numeric NOT NULL,       -- 0–100 final composite score
  frequency    numeric,                -- raw % of jobs citing it
  recency      numeric,
  senior_pct   numeric,
  salary_prem  numeric,
  sample_size  int,                    -- number of jobs analyzed
  computed_at  timestamptz DEFAULT now(),
  UNIQUE(role, skill)
);

CREATE INDEX ON skill_market_weights(role, weight DESC);
```

---

## Stage 4 — Using Weights in Market Intelligence

Once weights are computed, the route changes from:
> "LLM, guess what skills matter" → **"DB, give me the top 10 weighted skills for this role"**

```typescript
// In /api/market-intelligence/route.ts
const topSkills = await supabase
  .from("skill_market_weights")
  .select("skill, weight, frequency")
  .eq("role", normalizedRole)
  .order("weight", { ascending: false })
  .limit(12);
```

The `requiredSkills` array fed into `computeMarketFitScore()` is now **data-driven**,
not LLM-generated. LLM is still used for:
- `aiInsight`, `careerAdvice` (narrative)
- Filling in skill impact for skills that aren't yet in the DB

---

## Proposed File Changes

### New Files

#### [NEW] `src/lib/skill-taxonomy.ts`
~300-entry canonical skill map with aliases. Used by the extractor.

#### [NEW] `src/lib/skill-extractor.ts`
```typescript
export function extractSkillsFromText(text: string): string[]
// Runs keyword matching against SKILL_TAXONOMY
// Returns canonical skill names found in the text
```

#### [NEW] `src/lib/skill-weighter.ts`
```typescript
export async function computeSkillWeights(role: string, jobs: NormalizedJob[]): Promise<SkillWeight[]>
// Runs the 4-component weight formula across all jobs for a role
// Returns sorted list of skills with composite weight score
```

#### [NEW] `src/app/api/jobs/sync/route.ts`
```typescript
// POST { role: string }
// Fetches from all 3 APIs, upserts to job_listings, triggers skill weight recompute
// Can be called on-demand or via cron
```

### Modified Files

#### [MODIFY] `src/app/api/market-intelligence/route.ts`
- Add Supabase lookup for cached skill weights before calling LLM
- Fallback to LLM-derived skills if DB has < 10 weight records for that role
- Write newly computed weights back to DB after LLM analysis

#### [MODIFY] `src/lib/market-intelligence.ts`
- Remove redundant direct API calls (unified into `jobs/sync`)
- Import and use extractor for skill parsing

---

## Supabase Migrations Needed

### Migration 1: `create_job_listings_table`
```sql
CREATE TABLE job_listings ( ... ) -- see Stage 1 above
```

### Migration 2: `create_skill_weights_table`
```sql
CREATE TABLE skill_market_weights ( ... ) -- see Stage 3 above
```

---

## Skill Weighting — Visual Example

For `"Data Scientist"` role, after scanning 85 job listings:

| Skill | Freq% | Recency | Senior% | Salary Premium | **Weight** |
|-------|-------|---------|---------|---------------|-----------|
| Python | 94% | 96% | 91% | +12% | **93.8** |
| SQL | 88% | 85% | 80% | +5% | **84.5** |
| Machine Learning | 82% | 88% | 90% | +22% | **84.1** |
| TensorFlow | 45% | 40% | 60% | +18% | **46.3** |
| Power BI | 30% | 28% | 20% | -5% | **25.6** |

→ Python is a **must-have** (93.8), Power BI is **nice-to-have** (25.6).
→ User's skill gap is ranked by these weights, not LLM opinion.

---

## Open Questions

> [!IMPORTANT]
> **Do you want the sync job to run automatically?**
> Option A: Only run when a user queries a role (lazy fetch on cache miss)
> Option B: Pre-warm a list of top 50 roles via a Supabase cron job (better UX, but needs Pro plan for `pg_cron`)

> [!IMPORTANT]
> **Do you want skill weights stored per-user or globally?**
> Global weights = one shared table for all users (efficient, shared signal)
> Per-user = each user's weights tuned to their location/seniority level filter

> [!NOTE]
> **The skill taxonomy** — should I build it from scratch (~300 skills, all tech domains) or start from a specific domain (e.g., only software engineering, data science)?

---

## Verification Plan

1. Run `npm run dev`, call `POST /api/jobs/sync` with `{ "role": "Data Scientist" }`
2. Check Supabase `job_listings` table is populated
3. Check `skill_market_weights` has weighted rows sorted by weight desc
4. Call `POST /api/market-intelligence` — confirm `requiredSkills` comes from DB, not LLM
5. Verify skill gap list matches weighted order
