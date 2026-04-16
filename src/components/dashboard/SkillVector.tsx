"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Cpu,
  RefreshCw,
  Briefcase,
  MapPin,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/lib/user-store";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SkillScore {
  skill: string;
  score: number;
  frequency: number;
  weight: number;
}

interface QualifiedJob {
  title: string;
  company: string;
  location: string;
  matchPct: number;
  salaryMin?: number;
  salaryMax?: number;
  missingSkills: string[];
}

interface SkillVectorResult {
  totalScore: number;
  skillScores: SkillScore[];
  qualifiedJobs: QualifiedJob[];
  marketSkillsRequired: string[];
  breakdown: {
    coveragePct: number;
    depthPct: number;
    rarityBonus: number;
    experienceWeight: number;
  };
}

// ─── Radar Chart ──────────────────────────────────────────────────────────────

const RADAR_CATS = [
  { name: "Technical", icon: Cpu, color: "#00f0ff" },
  { name: "Logic", icon: Zap, color: "#8a2be2" },
  { name: "Design", icon: Sparkles, color: "#ff007f" },
  { name: "Business", icon: Target, color: "#f59e0b" },
  { name: "Soft Skills", icon: TrendingUp, color: "#10b981" },
];

const SKILL_CATEGORY: Record<string, string> = {
  React: "Technical", "Next.js": "Technical", TypeScript: "Technical", Python: "Technical",
  SQL: "Technical", JavaScript: "Technical", "C++": "Technical", Java: "Technical",
  Docker: "Technical", Cloud: "Technical", AWS: "Technical", Git: "Technical", Go: "Technical",
  Kubernetes: "Technical", "Node.js": "Technical", Rust: "Technical",
  "Data Structures": "Logic", Algorithms: "Logic", Mathematics: "Logic",
  "Machine Learning": "Logic", Optimization: "Logic", AI: "Logic", "Deep Learning": "Logic",
  "UI/UX": "Design", Figma: "Design", "Graphic Design": "Design", CSS: "Design",
  Tailwind: "Design", Animation: "Design",
  Marketing: "Business", Sales: "Business", Strategy: "Business",
  Economics: "Business", Finance: "Business", Management: "Business",
  Communication: "Soft Skills", Leadership: "Soft Skills", Teamwork: "Soft Skills",
  "Public Speaking": "Soft Skills", Writing: "Soft Skills",
};

function categorizeSkill(skill: string): string {
  return SKILL_CATEGORY[skill] ||
    Object.entries(SKILL_CATEGORY).find(([k]) => skill.toLowerCase().includes(k.toLowerCase()))?.[1] ||
    "Technical";
}

function RadarChart({
  userSkills,
  marketSkills,
}: {
  userSkills: string[];
  marketSkills: string[];
}) {
  const centerX = 130;
  const centerY = 130;
  const radius = 90;

  const { userPts, mktPts } = useMemo(() => {
    const uC: Record<string, number> = Object.fromEntries(RADAR_CATS.map(c => [c.name, 0]));
    const mC: Record<string, number> = Object.fromEntries(RADAR_CATS.map(c => [c.name, 0]));
    userSkills.forEach(s => { const c = categorizeSkill(s); if (uC[c] !== undefined) uC[c]++; });
    marketSkills.forEach(s => { const c = categorizeSkill(s); if (mC[c] !== undefined) mC[c]++; });
    const userV = RADAR_CATS.map(c => Math.min(0.2 + uC[c.name] * 0.16, 1));
    const mktV = RADAR_CATS.map(c => marketSkills.length > 0 ? Math.min(0.45 + mC[c.name] * 0.11, 1) : 0.8);
    const getP = (i: number, v: number) => {
      const a = (i * 2 * Math.PI) / RADAR_CATS.length - Math.PI / 2;
      return { x: centerX + radius * v * Math.cos(a), y: centerY + radius * v * Math.sin(a) };
    };
    return {
      userPts: userV.map((v, i) => getP(i, v)),
      mktPts: mktV.map((v, i) => getP(i, v)),
    };
  }, [userSkills, marketSkills]);

  const uPath = userPts.map(p => `${p.x},${p.y}`).join(" ");
  const mPath = mktPts.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <div className="relative w-[260px] h-[260px] flex-shrink-0">
      <svg width="260" height="260" viewBox="0 0 260 260">
        <defs>
          <linearGradient id="svSkillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8a2be2" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="svStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#8a2be2" />
          </linearGradient>
          <filter id="glowFilter">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Grid rings */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((r, i) => (
          <circle key={i} cx={centerX} cy={centerY} r={radius * r} fill="none"
            stroke="white" strokeOpacity={0.04} strokeWidth="1" />
        ))}

        {/* Grid spokes */}
        {RADAR_CATS.map((_, i) => {
          const a = (i * 2 * Math.PI) / RADAR_CATS.length - Math.PI / 2;
          return (
            <line key={i}
              x1={centerX} y1={centerY}
              x2={centerX + radius * Math.cos(a)}
              y2={centerY + radius * Math.sin(a)}
              stroke="white" strokeOpacity={0.05} strokeWidth="1" />
          );
        })}

        {/* Market area */}
        <motion.polygon initial={{ opacity: 0 }} animate={{ opacity: 0.12 }}
          points={mPath} fill="white" stroke="white" strokeDasharray="4 3"
          strokeOpacity={0.25} strokeWidth="1" />

        {/* User area */}
        <motion.polygon
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          points={uPath} fill="url(#svSkillGrad)" stroke="url(#svStrokeGrad)"
          strokeWidth="2" filter="url(#glowFilter)" />

        {/* User dots */}
        {userPts.map((p, i) => (
          <motion.circle key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            cx={p.x} cy={p.y} r="4" fill={RADAR_CATS[i].color} />
        ))}
      </svg>

      {/* Labels */}
      {RADAR_CATS.map((cat, i) => {
        const a = (i * 2 * Math.PI) / RADAR_CATS.length - Math.PI / 2;
        const lx = centerX + (radius + 28) * Math.cos(a);
        const ly = centerY + (radius + 28) * Math.sin(a);
        return (
          <div key={i} className="absolute flex flex-col items-center gap-0.5 -translate-x-1/2 -translate-y-1/2"
            style={{ left: lx, top: ly }}>
            <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center"
              style={{ color: cat.color }}>
              <cat.icon size={12} />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-600 whitespace-nowrap">
              {cat.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? "#10b981" : score >= 50 ? "#00f0ff" : score >= 25 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          className="text-3xl font-black"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">/ 100</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface SkillVectorProps {
  userSkills: string[];
  marketSkills: string[];
  careerGoal?: string;
  experienceLevel?: string;
  className?: string;
  onScoreUpdate?: (score: number) => void;
}

export function SkillVector({
  userSkills,
  marketSkills: initialMarketSkills,
  careerGoal,
  experienceLevel,
  className,
  onScoreUpdate,
}: SkillVectorProps) {
  const [result, setResult] = useState<SkillVectorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"skills" | "jobs">("skills");
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);
  const setSkillScore = useUserStore(s => s.setSkillVectorScore);

  const analyze = useCallback(async () => {
    if (!userSkills.length || !careerGoal) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/skill-vector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userSkills, careerGoal, experienceLevel }),
      });

      if (!res.ok) throw new Error("Analysis failed");
      const data: SkillVectorResult = await res.json();
      setResult(data);
      setLastAnalyzed(new Date());

      // Persist score to Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from("users").update({
          skill_vector_score: data.totalScore,
          skill_scores: data.skillScores,
          qualified_jobs: data.qualifiedJobs,
          vector_updated_at: new Date().toISOString(),
        }).eq("id", session.user.id);
      }

      onScoreUpdate?.(data.totalScore);
      setSkillScore(data.totalScore);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Market analysis unavailable. Check your API key or try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [userSkills, careerGoal, experienceLevel, onScoreUpdate]);

  // Auto-analyze when skills/role change
  useEffect(() => {
    async function loadStoredScore() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from("users").select("skill_vector_score").eq("id", session.user.id).single();
        if (data?.skill_vector_score) {
          setSkillScore(data.skill_vector_score);
        }
      }
    }
    loadStoredScore();

    if (userSkills.length > 0 && careerGoal) {
      analyze();
    }
  }, []); // eslint-disable-line

  const displayedMarketSkills = result?.marketSkillsRequired || initialMarketSkills;
  const scoreLabel =
    !result ? "Pending" :
    result.totalScore >= 80 ? "Elite" :
    result.totalScore >= 60 ? "Strong" :
    result.totalScore >= 40 ? "Growing" :
    "Emerging";

  return (
    <div className={cn(
      "glass rounded-[40px] p-6 relative overflow-hidden group border-white/5 shadow-2xl transition-all duration-700 hover:border-white/10",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/5 to-[#8a2be2]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative z-10 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Skill Vector</h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
              Market Intelligence Score
            </p>
          </div>
          <div className="flex items-center gap-2">
            {lastAnalyzed && (
              <span className="text-[9px] text-gray-600 font-bold uppercase">
                {lastAnalyzed.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={analyze}
              disabled={loading || !careerGoal || !userSkills.length}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all disabled:opacity-40 group/btn"
              title="Re-analyze"
            >
              <RefreshCw
                size={13}
                className={cn(
                  "text-gray-400 group-hover/btn:text-white transition-colors",
                  loading && "animate-spin text-[#00f0ff]"
                )}
              />
            </button>
          </div>
        </div>

        {/* No skills prompt */}
        {!userSkills.length && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
            <AlertCircle size={16} className="text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-300/70">
              Add skills to your profile to unlock your Skill Vector score.
            </p>
          </div>
        )}

        {/* Main Content */}
        {(userSkills.length > 0) && (
          <div className="flex flex-col gap-6">
            {/* Top row: radar + score */}
            <div className="flex items-center gap-6 flex-wrap">
              <RadarChart userSkills={userSkills} marketSkills={displayedMarketSkills} />

              <div className="flex-1 space-y-4 min-w-[180px]">
                {/* Score */}
                <div className="flex items-center gap-4">
                  <ScoreRing score={result?.totalScore ?? 0} size={100} />
                  <div>
                    <div className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border mb-2 inline-block",
                      !result ? "bg-white/5 border-white/10 text-gray-500" :
                      result.totalScore >= 80 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                      result.totalScore >= 60 ? "bg-[#00f0ff]/10 border-[#00f0ff]/20 text-[#00f0ff]" :
                      result.totalScore >= 40 ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                      "bg-red-500/10 border-red-500/20 text-red-400"
                    )}>
                      {loading ? "Analyzing…" : scoreLabel}
                    </div>
                    <p className="text-xs text-gray-500 font-light leading-relaxed">
                      {loading
                        ? "Running market analysis…"
                        : result
                        ? `For ${careerGoal}`
                        : "Add a career goal to analyze"}
                    </p>
                  </div>
                </div>

                {/* Breakdown bars */}
                {result && (
                  <div className="space-y-2">
                    {[
                      { label: "Coverage", value: result.breakdown.coveragePct, color: "#00f0ff" },
                      { label: "Depth", value: result.breakdown.depthPct, color: "#8a2be2" },
                      { label: "Rarity Bonus", value: result.breakdown.rarityBonus, color: "#ff007f" },
                      { label: "Experience", value: result.breakdown.experienceWeight, color: "#10b981" },
                    ].map(({ label, value, color }) => (
                      <div key={label}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
                          <span className="text-[9px] font-black" style={{ color }}>{value}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${value}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}40` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#8a2be2]" />
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">My Skills</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full border border-white/30 border-dashed" />
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Market Target</span>
              </div>
              {result && (
                <div className="ml-auto text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                  {result.qualifiedJobs.length} job matches
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                <AlertCircle size={13} className="text-red-400 flex-shrink-0" />
                <p className="text-[10px] text-red-300/70">{error}</p>
              </div>
            )}

            {/* Tabs: Skills | Jobs */}
            {result && (
              <div className="space-y-3">
                <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/5 w-fit">
                  {(["skills", "jobs"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        activeTab === tab
                          ? "bg-white/10 text-white"
                          : "text-gray-500 hover:text-gray-300"
                      )}
                    >
                      {tab === "skills" ? `Market Skills (${result.skillScores.length})` : `Jobs I Qualify (${result.qualifiedJobs.length})`}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === "skills" && (
                    <motion.div
                      key="skills"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="space-y-2 max-h-[280px] overflow-y-auto pr-1"
                      style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
                    >
                      {result.skillScores.map((ss, i) => {
                        const userHas = userSkills.some(us =>
                          us.toLowerCase().includes(ss.skill.toLowerCase()) ||
                          ss.skill.toLowerCase().includes(us.toLowerCase())
                        );
                        return (
                          <motion.div
                            key={ss.skill}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                          >
                            <div className={cn(
                              "w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0",
                              userHas ? "bg-emerald-500/10" : "bg-white/5"
                            )}>
                              {userHas
                                ? <CheckCircle2 size={11} className="text-emerald-400" />
                                : <span className="text-[8px] font-black text-gray-600">{i + 1}</span>
                              }
                            </div>
                            <span className={cn(
                              "text-[11px] font-bold flex-1",
                              userHas ? "text-white" : "text-gray-500"
                            )}>
                              {ss.skill}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${ss.score}%` }}
                                  transition={{ duration: 0.8, delay: i * 0.04 }}
                                  className="h-full rounded-full"
                                  style={{
                                    backgroundColor: ss.score >= 80 ? "#00f0ff" : ss.score >= 60 ? "#8a2be2" : "#6b7280",
                                  }}
                                />
                              </div>
                              <span className="text-[9px] font-bold text-gray-600 w-7 text-right">{ss.score}</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}

                  {activeTab === "jobs" && (
                    <motion.div
                      key="jobs"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="space-y-2 max-h-[280px] overflow-y-auto pr-1"
                      style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
                    >
                      {result.qualifiedJobs.length === 0 ? (
                        <div className="text-center py-8 text-gray-600">
                          <Briefcase size={24} className="mx-auto mb-2 opacity-30" />
                          <p className="text-xs">No live job data. Add more skills or check your API key.</p>
                        </div>
                      ) : (
                        result.qualifiedJobs.map((job, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors space-y-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-[11px] font-bold text-white leading-tight">{job.title}</p>
                                <p className="text-[9px] text-gray-500 font-medium">{job.company}</p>
                              </div>
                              <div className={cn(
                                "px-2 py-0.5 rounded-lg text-[9px] font-black flex-shrink-0",
                                job.matchPct >= 70 ? "bg-emerald-500/10 text-emerald-400" :
                                job.matchPct >= 40 ? "bg-[#00f0ff]/10 text-[#00f0ff]" :
                                "bg-white/5 text-gray-500"
                              )}>
                                {job.matchPct}% fit
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 text-[9px] text-gray-600">
                                <MapPin size={9} />
                                {job.location}
                              </div>
                              {(job.salaryMin || job.salaryMax) && (
                                <span className="text-[9px] font-bold text-gray-500">
                                  ${((job.salaryMin || 0) / 1000).toFixed(0)}k–${((job.salaryMax || 0) / 1000).toFixed(0)}k
                                </span>
                              )}
                            </div>

                            {job.missingSkills.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {job.missingSkills.slice(0, 3).map(ms => (
                                  <span key={ms} className="text-[8px] px-1.5 py-0.5 rounded bg-red-500/5 border border-red-500/10 text-red-400/70">
                                    +{ms}
                                  </span>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={analyze}
              disabled={loading || !careerGoal || !userSkills.length}
              className="w-full py-3.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2 group/btn active:scale-95 disabled:opacity-40"
            >
              {loading ? (
                <>
                  <RefreshCw size={12} className="animate-spin" />
                  Analyzing Market…
                </>
              ) : (
                <>
                  Synchronize Vector
                  <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* BG watermark */}
      <div className="absolute top-0 right-0 p-6 opacity-[0.015] text-white pointer-events-none">
        <Target size={180} />
      </div>
    </div>
  );
}
