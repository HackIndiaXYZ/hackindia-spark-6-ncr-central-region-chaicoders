"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  MapPin,
  DollarSign,
  Briefcase,
  Lightbulb,
  RefreshCw,
  ChevronRight,
  Flame,
  AlertCircle,
  CheckCircle2,
  PlusCircle,
  BarChart3,
  Activity,
  Zap,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

// ─── Types (mirrors API) ──────────────────────────────────────────────────────

interface TrendDataPoint {
  label: string;
  demandIndex: number;
}

interface SalaryBand {
  percentile: string;
  value: number;
}

interface LiveJob {
  title: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  matchPct: number;
  requiredSkills: string[];
}

interface SkillGap {
  skill: string;
  priority: "Critical" | "High" | "Medium";
  impactPct: number;
}

interface MarketIntelligenceResult {
  marketFitScore: number;
  demandIndex: number;
  competitionIndex: number;
  growthTrajectory: number;
  matchedSkills: string[];
  skillGaps: SkillGap[];
  salary: { min: number; max: number; median: number; currency: string };
  salaryBands: SalaryBand[];
  demand: "High" | "Medium" | "Low";
  trends: string[];
  trendHistory: TrendDataPoint[];
  liveJobs: LiveJob[];
  totalJobCount: number;
  aiInsight: string;
  careerAdvice: string;
  breakdown: {
    skillAlignmentPct: number;
    salaryPositionPct: number;
    demandWeightPct: number;
    growthBonus: number;
  };
}

interface MarketAnalysisSummary {
  score: number;
  matchScore: number;
  salary: MarketIntelligenceResult["salary"];
  demand: MarketIntelligenceResult["demand"];
  skillsRequired: string[];
  jobs: LiveJob[];
}

// ─── Mini Sparkline Chart ─────────────────────────────────────────────────────

function SparkLine({ data, color = "#00f0ff" }: { data: TrendDataPoint[]; color?: string }) {
  if (!data.length) return null;
  const w = 200, h = 60, pad = 8;
  const vals = data.map(d => d.demandIndex);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const pts = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d.demandIndex - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });
  const pathD = pts.reduce((acc, pt, i) => i === 0 ? `M${pt}` : `${acc} L${pt}`, "");
  const areaD = `${pathD} L${pts[pts.length - 1].split(",")[0]},${h - pad} L${pad},${h - pad} Z`;
  const lastPt = pts[pts.length - 1].split(",");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id="sparkArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#sparkArea)" />
      <motion.path
        d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
      {/* Endpoint dot */}
      <motion.circle
        cx={lastPt[0]} cy={lastPt[1]} r="4" fill={color}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  );
}

// ─── Salary Bar Chart ─────────────────────────────────────────────────────────

function SalaryBands({ bands, userPositionPct }: { bands: SalaryBand[]; userPositionPct: number }) {
  if (!bands.length) return null;
  const vals = bands.map(b => b.value);
  const maxVal = Math.max(...vals);

  return (
    <div className="space-y-2">
      {bands.map((band, i) => {
        const widthPct = (band.value / maxVal) * 100;
        const isUserPos = band.percentile === "Median" || (band.percentile === "P75" && userPositionPct >= 60);
        return (
          <div key={band.percentile} className="flex items-center gap-3">
            <span className="text-[9px] font-black text-gray-500 uppercase w-10 flex-shrink-0">{band.percentile}</span>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${widthPct}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className={cn("h-full rounded-full", isUserPos ? "bg-[#00f0ff]" : "bg-white/20")}
                style={isUserPos ? { boxShadow: "0 0 8px rgba(0,240,255,0.4)" } : {}}
              />
            </div>
            <span className="text-[10px] font-bold text-gray-400 w-16 flex-shrink-0 text-right">
              ${(band.value / 1000).toFixed(0)}k
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Score Arc ───────────────────────────────────────────────────────────────

function ScoreArc({ score, size = 140, label }: { score: number; size?: number; label: string }) {
  const r = (size - 20) / 2;
  // Draw only 270° arc (start at 135°, end at 405°)
  const startAngle = 135 * (Math.PI / 180);
  const arcAngle = 270 * (Math.PI / 180);
  const cx = size / 2, cy = size / 2;

  const arcPath = (startA: number, sweep: number) => {
    const ex = cx + r * Math.cos(startA + sweep);
    const ey = cy + r * Math.sin(startA + sweep);
    const sx = cx + r * Math.cos(startA);
    const sy = cy + r * Math.sin(startA);
    const large = sweep > Math.PI ? 1 : 0;
    return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
  };

  const bgPath = arcPath(startAngle, arcAngle);
  const fillSweep = (score / 100) * arcAngle;
  const fillPath = arcPath(startAngle, Math.max(fillSweep, 0.01));

  const color = score >= 75 ? "#10b981" : score >= 50 ? "#00f0ff" : score >= 25 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <path d={bgPath} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" strokeLinecap="round" />
        <motion.path
          d={fillPath} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span className="text-3xl font-black leading-none" style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
          {score}
        </motion.span>
        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-1">{label}</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface MarketIntelligenceProps {
  userSkills: string[];
  targetRole: string;
  onAnalysisUpdate?: (analysis: MarketAnalysisSummary) => void;
}

export function MarketIntelligence({
  userSkills,
  targetRole,
  onAnalysisUpdate,
}: MarketIntelligenceProps) {
  const [result, setResult] = useState<MarketIntelligenceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "salary" | "jobs" | "trends">("overview");
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);

  const analyze = useCallback(async () => {
    if (!targetRole) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/market-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userSkills, targetRole }),
      });

      if (!res.ok) throw new Error("Analysis failed");
      const data: MarketIntelligenceResult = await res.json();
      setResult(data);
      setLastAnalyzed(new Date());

      // Persist to Supabase for score sharing across pages
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        try {
          await supabase.from("users").update({
            market_fit_score: data.marketFitScore,
            market_analysis: {
              score: data.marketFitScore,
              matchScore: data.marketFitScore,
              salary: data.salary,
              demand: data.demand,
              skillsRequired: data.matchedSkills,
              jobs: data.liveJobs,
            },
            market_updated_at: new Date().toISOString(),
          }).eq("id", session.user.id);
        } catch { /* ignore persist errors */ }
      }

      // Pass compatible shape to dashboard
      onAnalysisUpdate?.({
        score: data.marketFitScore,
        matchScore: data.marketFitScore,
        salary: data.salary,
        demand: data.demand,
        skillsRequired: [...data.matchedSkills, ...data.skillGaps.map(g => g.skill)],
        jobs: data.liveJobs,
      });
    } catch {
      setError("Market data unavailable. Check your API key or try refreshing.");
    } finally {
      setLoading(false);
    }
  }, [userSkills, targetRole, onAnalysisUpdate]);

  useEffect(() => {
    if (targetRole) analyze();
  }, []); // eslint-disable-line

  const scoreLabel =
    !result ? "Analyzing" :
    result.marketFitScore >= 80 ? "Top Quartile" :
    result.marketFitScore >= 60 ? "Above Market" :
    result.marketFitScore >= 40 ? "Mid Market" : "Developing";

  const priorityColor = (p: string) =>
    p === "Critical" ? "text-red-400 bg-red-500/5 border-red-500/10" :
    p === "High" ? "text-amber-400 bg-amber-500/5 border-amber-500/10" :
    "text-blue-400 bg-blue-500/5 border-blue-500/10";

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "salary", label: "Salary" },
    { id: "jobs", label: `Jobs ${result ? `(${result.liveJobs.length})` : ""}` },
    { id: "trends", label: "Trends" },
  ] as const;

  return (
    <div className="glass rounded-[40px] p-6 relative overflow-hidden group border-white/5 shadow-2xl transition-all duration-700 hover:border-white/10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/5 to-[#8a2be2]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#8a2be2]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Market Intelligence</h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
              {targetRole || "Set a career goal"}
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
              disabled={loading || !targetRole}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all disabled:opacity-40 group/btn"
              title="Re-analyze"
            >
              <RefreshCw size={13} className={cn(
                "text-gray-400 group-hover/btn:text-white transition-colors",
                loading && "animate-spin text-[#00f0ff]"
              )} />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
            <AlertCircle size={13} className="text-red-400 flex-shrink-0" />
            <p className="text-[10px] text-red-300/70">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && !result && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-10 h-10 border-4 border-[#00f0ff] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(0,240,255,0.3)]" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 animate-pulse">
              Scanning Global Market…
            </p>
          </div>
        )}

        {result && (
          <>
            {/* Top KPI row: 3 score cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Market Fit", value: result.marketFitScore, color: result.marketFitScore >= 60 ? "#10b981" : result.marketFitScore >= 40 ? "#00f0ff" : "#f59e0b", icon: Activity },
                { label: "Demand Index", value: result.demandIndex, color: "#8a2be2", icon: TrendingUp },
                { label: "Growth Score", value: result.growthTrajectory, color: "#f59e0b", icon: Zap },
              ].map(({ label, value, color, icon: Icon }) => (
                <div key={label} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                  <Icon size={12} className="mx-auto mb-1.5" style={{ color }} />
                  <motion.p className="text-xl font-black" style={{ color }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {value}
                  </motion.p>
                  <p className="text-[8px] font-bold text-gray-600 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>

            {/* Tab navigation */}
            <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/5">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                    activeTab === tab.id
                      ? "bg-white/10 text-white"
                      : "text-gray-500 hover:text-gray-300"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">

              {/* ── OVERVIEW ──────────────────────────────────────────────── */}
              {activeTab === "overview" && (
                <motion.div key="overview"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-4">

                  {/* Score arc + breakdown bars */}
                  <div className="flex items-center gap-6 flex-wrap">
                    <ScoreArc score={result.marketFitScore} size={130} label="Market Fit" />

                    <div className="flex-1 space-y-2.5 min-w-[160px]">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest mb-2",
                        result.marketFitScore >= 75 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                        result.marketFitScore >= 50 ? "bg-[#00f0ff]/10 border-[#00f0ff]/20 text-[#00f0ff]" :
                        result.marketFitScore >= 25 ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                        "bg-red-500/10 border-red-500/20 text-red-400"
                      )}>
                        {scoreLabel}
                      </div>

                      {[
                        { label: "Skill Alignment", value: result.breakdown.skillAlignmentPct, color: "#00f0ff", weight: "40%" },
                        { label: "Demand Pull", value: result.demandIndex, color: "#8a2be2", weight: "25%" },
                        { label: "Growth Potential", value: result.growthTrajectory, color: "#f59e0b", weight: "20%" },
                        { label: "Opportunity Gap", value: 100 - result.competitionIndex, color: "#10b981", weight: "15%" },
                      ].map(({ label, value, color, weight }) => (
                        <div key={label}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[8px] text-gray-600">{weight}</span>
                              <span className="text-[9px] font-black" style={{ color }}>{value}%</span>
                            </div>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${value}%` }}
                              transition={{ duration: 0.9, delay: 0.3 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}60` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Matched skills */}
                  {result.matchedSkills.length > 0 && (
                    <div>
                      <p className="text-[9px] font-black text-[#00f0ff] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <CheckCircle2 size={10} /> Your Matching Skills ({result.matchedSkills.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.matchedSkills.map(skill => (
                          <span key={skill} className="px-2.5 py-1 rounded-lg bg-[#00f0ff]/5 border border-[#00f0ff]/15 text-[#00f0ff] text-[9px] font-bold uppercase tracking-wider">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skill gaps */}
                  {result.skillGaps.length > 0 && (
                    <div>
                      <p className="text-[9px] font-black text-[#8a2be2] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <PlusCircle size={10} /> Priority Skill Gaps
                      </p>
                      <div className="space-y-2">
                        {result.skillGaps.slice(0, 5).map((gap, i) => (
                          <motion.div key={gap.skill}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className={cn("text-[8px] font-black uppercase px-2 py-0.5 rounded border", priorityColor(gap.priority))}>
                                {gap.priority}
                              </span>
                              <span className="text-[11px] font-bold text-white">{gap.skill}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <ArrowUpRight size={10} className="text-emerald-400" />
                              <span className="text-[10px] font-black text-emerald-400">+{gap.impactPct}%</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Insight */}
                  {result.aiInsight && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#8a2be2]/10 to-transparent border border-white/5 flex gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#8a2be2]/20 flex items-center justify-center flex-shrink-0">
                        <Lightbulb size={14} className="text-[#8a2be2]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white mb-1">AI Market Insight</p>
                        <p className="text-[10px] text-gray-400 leading-relaxed">{result.aiInsight}</p>
                        {result.careerAdvice && (
                          <p className="text-[10px] text-[#00f0ff] mt-2 leading-relaxed font-medium">{result.careerAdvice}</p>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── SALARY ────────────────────────────────────────────────── */}
              {activeTab === "salary" && (
                <motion.div key="salary"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-5">

                  {/* Main salary display */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Floor", value: result.salary.min, color: "#6b7280" },
                      { label: "Median", value: result.salary.median, color: "#00f0ff" },
                      { label: "Ceiling", value: result.salary.max, color: "#10b981" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                        <DollarSign size={12} className="mx-auto mb-1" style={{ color }} />
                        <p className="text-lg font-black" style={{ color }}>
                          {value ? `$${(value / 1000).toFixed(0)}k` : "N/A"}
                        </p>
                        <p className="text-[8px] font-bold text-gray-600 uppercase tracking-wider">{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Percentile bands */}
                  {result.salaryBands.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <BarChart3 size={10} /> Salary Distribution
                      </p>
                      <SalaryBands bands={result.salaryBands} userPositionPct={result.breakdown.salaryPositionPct} />
                    </div>
                  )}

                  {/* Salary position */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                      Your Projected Salary Position
                    </p>
                    <div className="relative h-6 bg-white/5 rounded-full overflow-hidden">
                      {/* Gradient track */}
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-700/30 via-[#00f0ff]/20 to-emerald-500/30 rounded-full" />
                      {/* User marker */}
                      <motion.div
                        className="absolute top-1 h-4 w-1.5 rounded-full bg-white shadow-lg"
                        initial={{ left: "0%" }}
                        animate={{ left: `${Math.min(result.breakdown.salaryPositionPct, 95)}%` }}
                        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                        style={{ transform: "translateX(-50%)", boxShadow: "0 0 8px rgba(0,240,255,0.5)" }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] text-gray-600 font-bold mt-1">
                      <span>Entry</span>
                      <span className="text-[#00f0ff]">You ~{result.breakdown.salaryPositionPct}th %ile</span>
                      <span>Senior</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── JOBS ──────────────────────────────────────────────────── */}
              {activeTab === "jobs" && (
                <motion.div key="jobs"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-3">

                  {/* Job count banner */}
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <Briefcase size={12} className="text-[#00f0ff]" />
                    <span className="text-[10px] font-bold text-gray-400">
                      <span className="text-white font-black">{result.totalJobCount}</span> open positions scanned
                    </span>
                    <div className={cn(
                      "ml-auto text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border",
                      result.demand === "High" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                      result.demand === "Medium" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                      "bg-gray-500/10 border-gray-500/20 text-gray-400"
                    )}>
                      {result.demand} Demand
                    </div>
                  </div>

                  {result.liveJobs.length === 0 ? (
                    <div className="text-center py-10 text-gray-600">
                      <Briefcase size={28} className="mx-auto mb-3 opacity-30" />
                      <p className="text-xs">No live job data. Add your RapidAPI key to see real listings.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1"
                      style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
                      {result.liveJobs.map((job, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors cursor-pointer group/job">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                <Building2 size={12} className="text-gray-500 group-hover/job:text-white transition-colors" />
                              </div>
                              <div>
                                <p className="text-[11px] font-bold text-white group-hover/job:text-[#00f0ff] transition-colors leading-tight">
                                  {job.title}
                                </p>
                                <p className="text-[9px] text-gray-500 font-medium">{job.company}</p>
                              </div>
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

                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1 text-[9px] text-gray-600">
                              <MapPin size={9} /> {job.location}
                            </div>
                            {(job.salaryMin || job.salaryMax) && (
                              <span className="text-[9px] font-bold text-gray-500">
                                ${((job.salaryMin || 0) / 1000).toFixed(0)}k–${((job.salaryMax || 0) / 1000).toFixed(0)}k
                              </span>
                            )}
                            <ChevronRight size={10} className="ml-auto text-gray-600 group-hover/job:text-white transition-colors" />
                          </div>

                          {job.requiredSkills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {job.requiredSkills.slice(0, 4).map(s => (
                                <span key={s} className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">{s}</span>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── TRENDS ────────────────────────────────────────────────── */}
              {activeTab === "trends" && (
                <motion.div key="trends"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-5">

                  {/* Sparkline */}
                  {result.trendHistory.length > 0 && (
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                          <Activity size={10} /> Demand Trajectory
                        </p>
                        <div className="flex items-center gap-1.5">
                          {(() => {
                            const first = result.trendHistory[0]?.demandIndex || 0;
                            const last = result.trendHistory[result.trendHistory.length - 1]?.demandIndex || 0;
                            const delta = last - first;
                            return (
                              <>
                                {delta >= 0 ? <TrendingUp size={12} className="text-emerald-400" /> : <TrendingDown size={12} className="text-red-400" />}
                                <span className={cn("text-[10px] font-black", delta >= 0 ? "text-emerald-400" : "text-red-400")}>
                                  {delta >= 0 ? "+" : ""}{delta} pts
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      <SparkLine data={result.trendHistory} color="#00f0ff" />
                      <div className="flex justify-between mt-1">
                        {result.trendHistory.map(d => (
                          <span key={d.label} className="text-[7px] text-gray-600 font-bold">{d.label}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trend tags */}
                  {result.trends.length > 0 && (
                    <div>
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <Flame size={10} className="text-orange-400" /> Market Trends
                      </p>
                      <div className="space-y-2">
                        {result.trends.map((trend, i) => (
                          <motion.div key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                            <span className="w-5 h-5 rounded-lg bg-white/5 flex items-center justify-center text-[9px] font-black text-gray-500 flex-shrink-0">
                              {i + 1}
                            </span>
                            <span className="text-[11px] text-gray-300 font-medium">{trend}</span>
                            <Zap size={10} className="ml-auto text-[#8a2be2] flex-shrink-0" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Growth vs Competition */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-2">Role Growth</p>
                      <p className="text-2xl font-black text-[#f59e0b]">{result.growthTrajectory}</p>
                      <p className="text-[8px] text-gray-600 mt-1">out of 100</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-2">Competition</p>
                      <p className="text-2xl font-black" style={{
                        color: result.competitionIndex <= 40 ? "#10b981" : result.competitionIndex <= 65 ? "#f59e0b" : "#ef4444"
                      }}>
                        {result.competitionIndex <= 40 ? "Low" : result.competitionIndex <= 65 ? "Med" : "High"}
                      </p>
                      <p className="text-[8px] text-gray-600 mt-1">index {result.competitionIndex}</p>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Formula formula footnote */}
            <div className="pt-3 border-t border-white/5">
              <p className="text-[8px] text-gray-700 font-mono leading-relaxed">
                Score = Alignment(40%) + Demand(25%) + Growth(20%) + Opportunity(15%)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
