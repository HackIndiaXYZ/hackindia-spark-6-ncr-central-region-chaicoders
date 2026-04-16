"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import SmoothScroll from "@/components/SmoothScroll";
import { AIChatBot } from "@/components/dashboard/AIChatBot";
import { 
  Briefcase, 
  MapPin, 
  ExternalLink,
  Target,
  Zap,
  TrendingUp,
  Search,
  AlertCircle,
  Building2,
  DollarSign,
  ChevronDown,
  X,
  CheckCircle,
  BarChart,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function JobMarketPage() {
  const [profile, setProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }

      // Fetch user profile to get skills and target role
      const { data: profileData } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (!profileData || !profileData.career_goal) {
        router.push("/setup-profile");
        return;
      }

      setProfile(profileData);

      // Fetch jobs from our new Adzuna wrapper
      try {
        const res = await fetch("/api/jobs/adzuna", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: profileData.career_goal,
            skills: profileData.skills || []
          })
        });

        if (!res.ok) {
          throw new Error("Failed to load jobs");
        }

        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (err: any) {
        console.error(err);
        setError("Unable to connect to the live job market. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedJob) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedJob]);

  // Expose manual refresh function
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.push("/login");

    const { data: profileData } = await supabase.from("users").select("*").eq("id", session.user.id).single();
    if (!profileData || !profileData.career_goal) return;

    try {
      const res = await fetch("/api/jobs/adzuna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: profileData.career_goal, skills: profileData.skills || [] })
      });
      if (!res.ok) throw new Error("Failed to load jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err: any) {
      setError("Unable to connect to the live job market. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#13121C] text-white selection:bg-[#A05CFF]/30 font-sans relative">
        <div className="relative z-10 flex min-h-screen">
          <DashboardSidebar />

          <main className="flex-1 min-h-screen flex flex-col pl-[260px] pb-10">
            {/* Header */}
            <header className="h-[100px] px-10 flex items-center justify-between sticky top-0 z-40 bg-[#13121C]/80 backdrop-blur-xl border-b border-[#ffffff05]">
              <h1 className="text-[22px] font-medium text-white/90">Job Market</h1>
              
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push("/profile")}>
                  <div className="w-[34px] h-[34px] rounded-full overflow-hidden border border-[#ffffff10] bg-gradient-to-br from-[#A05CFF] to-[#6035EE] flex items-center justify-center font-bold text-sm">
                    {profile?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-[14px] text-white/80 font-medium group-hover:text-white transition-colors">
                    {profile?.name || "Scholar"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#8E8B9F] group-hover:text-white transition-colors" />
                </div>
              </div>
            </header>

            <div className="px-10 flex-1 flex flex-col pt-8">
              {/* Header Info */}
              <div className="flex justify-between items-end mb-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffffff08] border border-[#ffffff10] text-[#A05CFF] text-[11px] font-bold uppercase tracking-wider mb-4">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Live Job Board</span>
                  </div>
                  <h2 className="text-[32px] font-semibold tracking-tight text-white/95">
                    Opportunities for you
                  </h2>
                  <p className="text-[#8E8B9F] text-[15px] mt-2 max-w-2xl">
                    We've scanned the live market using Adzuna to find active roles matching your target of <span className="text-[#00f0ff] font-medium">{profile?.career_goal || "your goals"}</span>. 
                    Calculated using your Skill Vector.
                  </p>
                </div>
                
                <div className="flex flex-col items-end gap-2 text-right">
                  <div className="flex flex-col text-right">
                    <p className="text-[#8E8B9F] text-sm">Active Matches</p>
                    <p className="text-3xl font-bold text-white leading-none mt-1">{loading ? "-" : jobs.length}</p>
                  </div>
                  <button 
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold mt-2 transition-colors disabled:opacity-50 group"
                  >
                    <Zap className="w-3.5 h-3.5 text-yellow-500" />
                    {loading ? "Refreshing..." : "Refresh Market"}
                  </button>
                </div>
              </div>

              {/* Error State */}
              {error && (
                <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-start gap-4 mb-8">
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-red-400 font-medium mb-1">Market Connection Error</h3>
                    <p className="text-red-300/70 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-[280px] rounded-[24px] bg-[#1A1926] border border-[#ffffff05] shadow-xl p-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff05] to-transparent animate-[shimmer_2s_infinite] -translate-x-full" />
                      <div className="w-16 h-16 rounded-full bg-[#ffffff05] mb-4" />
                      <div className="h-6 w-3/4 bg-[#ffffff05] rounded-[8px] mb-3" />
                      <div className="h-4 w-1/2 bg-[#ffffff05] rounded-[8px] mb-8" />
                      <div className="space-y-3">
                        <div className="h-3 w-full bg-[#ffffff05] rounded-[4px]" />
                        <div className="h-3 w-2/3 bg-[#ffffff05] rounded-[4px]" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Jobs Grid */}
              {!loading && !error && jobs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {jobs.map((job, idx) => (
                    <JobCard 
                      key={job.id} 
                      job={job} 
                      index={idx} 
                      onClick={() => setSelectedJob(job)} 
                    />
                  ))}
                </div>
              )}

              {/* No Jobs Found */}
              {!loading && !error && jobs.length === 0 && (
                <div className="flex flex-col items-center justify-center p-16 rounded-[24px] bg-[#1A1926] border border-[#ffffff05] text-center">
                  <div className="w-16 h-16 rounded-full bg-[#ffffff05] flex items-center justify-center mb-6">
                    <Search className="w-8 h-8 text-[#8E8B9F]" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">No direct matches found</h3>
                  <p className="text-[#8E8B9F] max-w-md">
                    We couldn't find any openings matching right now. Try expanding your skills in the Skill Bridge.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
        <AIChatBot />

        {/* Modal Overlay Component */}
        <AnimatePresence>
          {selectedJob && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10 bg-[#13121C]/80 backdrop-blur-md overflow-y-auto"
            >
              <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </SmoothScroll>
  );
}

// ─── Job Modal Component ───────────────────────────────────────────────────────

function JobModal({ job, onClose }: { job: any; onClose: () => void }) {
  const chance = job.matchPct || 0;
  
  // Decide the color based on chance
  const color = 
    chance >= 80 ? "#10b981" : // Emerald
    chance >= 60 ? "#00f0ff" : // Cyan
    chance >= 40 ? "#f59e0b" : // Amber
    "#ef4444";                 // Red

  const label = 
    chance >= 80 ? "Optimal Fit" :
    chance >= 60 ? "Strong Match" :
    chance >= 40 ? "Possible" :
    "Stretch Goal";

  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (chance / 100) * circ;

  return (
    <motion.div
      layoutId={`job-${job.id}`}
      onClick={(e) => e.stopPropagation()}
      className="bg-[#1A1926] w-full max-w-4xl border border-[#ffffff15] rounded-[32px] shadow-2xl relative flex flex-col md:flex-row overflow-hidden my-auto max-h-[90vh]"
    >
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center border border-white/10 transition-colors z-10"
      >
        <X className="w-5 h-5 text-gray-400" />
      </button>

      {/* Left Column: Details */}
      <div className="flex-1 p-8 md:p-10 overflow-y-auto custom-scrollbar border-r border-[#ffffff0a]">
        <div className="pr-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffffff08] border border-[#ffffff10] text-[#A05CFF] text-[11px] font-bold uppercase tracking-wider mb-4">
            <Building2 className="w-3.5 h-3.5" />
            <span>{job.company}</span>
          </div>
          <h2 className="text-3xl font-semibold leading-tight text-white/95 mb-4">{job.title}</h2>
          
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-[#ffffff05] border border-[#ffffff0a] text-[12px] text-gray-400 font-medium">
              <MapPin size={14} className="text-gray-500" />
              {job.location}
            </div>
            
            {job.salary_max ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-emerald-500/5 border border-emerald-500/10 text-[12px] text-emerald-400 font-medium">
                <DollarSign size={14} className="text-emerald-500/70" />
                ₹{Math.floor(job.salary_min / 100000)}L - ₹{Math.floor(job.salary_max / 100000)}L
              </div>
            ) : null}
          </div>

          <h3 className="text-lg font-medium text-white/90 mb-3">Job Description</h3>
          <div className="text-[14px] text-gray-400 leading-relaxed space-y-4 mb-8">
            <p>{job.description?.replace(/<[^>]*>?/gm, '') || "No detailed description available for this position."}</p>
          </div>

          <h4 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-4">Required Skills & Vector Gaps</h4>
          
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Your Matched Skills
              </p>
              {job.matchedSkills && job.matchedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {job.matchedSkills.map((skill: string) => (
                    <span key={skill} className="px-3 py-1 rounded-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[12px] font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-gray-500">None detected matching the description natively.</p>
              )}
            </div>

            {job.missingSkills && job.missingSkills.length > 0 && (
              <div>
                <p className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Skills to Develop (Missing)
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.missingSkills.map((skill: string) => (
                    <span key={skill} className="px-3 py-1 rounded-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[12px] font-medium">
                      + {skill}
                    </span>
                  ))}
                </div>
                <p className="text-[12px] text-gray-500 mt-3 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Developing these skills increases your chance to {(chance + 15 > 99 ? 99 : chance + 15)}%.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Analytics & Apply */}
      <div className="w-full md:w-[320px] bg-[#ffffff03] p-8 md:p-10 flex flex-col items-center">
        <h3 className="text-sm font-medium text-white/80 w-full mb-6">Market Vector Analysis</h3>
        
        {/* Main Ring */}
        <div className="relative flex items-center justify-center mb-8" style={{ width: 140, height: 140 }}>
          <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <motion.circle
              cx="70" cy="70" r={r} fill="none"
              stroke={color} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circ}
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
              style={{ filter: `drop-shadow(0 0 8px ${color})` }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-black" style={{ color }}>{chance}%</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mt-1">Chance</span>
          </div>
        </div>
        
        <div className="w-full px-4 py-2 border border-[#ffffff0a] rounded-[12px] bg-[#ffffff03] mb-8 text-center">
           <span className="text-[13px] font-semibold text-white/90">{label}</span>
        </div>

        {/* Stats */}
        <div className="w-full space-y-4 mb-auto">
          <div className="flex justify-between items-center pb-3 border-b border-[#ffffff0a]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-[13px] text-gray-400">Est. Applicants</span>
            </div>
            <span className="text-[14px] font-medium text-white">{job.stats?.applicants || 42}</span>
          </div>
          
          <div className="flex justify-between items-center pb-3 border-b border-[#ffffff0a]">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500/70" />
              <span className="text-[13px] text-gray-400">Acceptance Rate</span>
            </div>
            <span className="text-[14px] font-medium text-emerald-400">{job.stats?.acceptanceRate || 6}%</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-[#ffffff0a]">
            <div className="flex items-center gap-2">
              <BarChart className="w-4 h-4 text-red-500/70" />
              <span className="text-[13px] text-gray-400">Rejection Rate</span>
            </div>
            <span className="text-[14px] font-medium text-red-400">{job.stats?.rejectionRate || 94}%</span>
          </div>
        </div>

        <button 
          onClick={() => window.open(job.url, "_blank")}
          className="w-full mt-8 py-4 rounded-[16px] bg-gradient-to-r hover:bg-gradient-to-l from-[#A05CFF] to-[#6035EE] text-[14px] font-bold text-white shadow-[0_0_20px_rgba(160,92,255,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          Apply via Adzuna
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}


// ─── Job Card Component ────────────────────────────────────────────────────────

function JobCard({ job, index, onClick }: { job: any; index: number; onClick: () => void }) {
  const chance = job.matchPct || 0;
  
  // Decide the color based on chance
  const color = 
    chance >= 80 ? "#10b981" : // Emerald
    chance >= 60 ? "#00f0ff" : // Cyan
    chance >= 40 ? "#f59e0b" : // Amber
    "#ef4444";                 // Red

  const r = 24;
  const circ = 2 * Math.PI * r;
  const offset = circ - (chance / 100) * circ;

  return (
    <motion.div
      layoutId={`job-${job.id}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="bg-[#1A1926] rounded-[24px] border border-[#ffffff08] p-6 flex flex-col relative group transition-all duration-300 hover:border-[#ffffff15] hover:bg-[#ffffff05] hover:-translate-y-1 hover:shadow-2xl hover:shadow-[rgba(160,92,255,0.05)] cursor-pointer"
    >
      {/* Skill Vector Score Ring - Top Right */}
      <div className="absolute top-6 right-6 flex flex-col items-center gap-2">
        <div className="px-2 py-1 rounded bg-[#ffffff05] border border-[#ffffff0a] flex items-center justify-center">
          <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 leading-none">Vector Chance</span>
        </div>
        <div className="relative flex items-center justify-center" style={{ width: 52, height: 52 }}>
          <svg width="52" height="52" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
            <motion.circle
              cx="26" cy="26" r={r} fill="none"
              stroke={color} strokeWidth="4" strokeLinecap="round"
              strokeDasharray={circ}
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 + index * 0.05 }}
              style={{ filter: `drop-shadow(0 0 4px ${color})` }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-[14px] font-bold" style={{ color }}>{chance}%</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pr-20 mb-4 mt-1">
        <h3 className="text-[18px] font-semibold text-white/95 leading-snug line-clamp-2 mt-1 group-hover:text-[#A05CFF] transition-colors">
          {job.title}
        </h3>
        <p className="text-[13px] font-medium text-white/60 mt-2 flex items-center gap-1.5">
          <Building2 size={14} className="text-[#A05CFF]/70" />
          {job.company}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-[#ffffff05] border border-[#ffffff0a] text-[11px] text-gray-400 font-medium whitespace-nowrap">
          <MapPin size={11} className="text-gray-500" />
          {job.location}
        </div>
        
        {job.salary_max ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-emerald-500/5 border border-emerald-500/10 text-[11px] text-emerald-400 font-medium whitespace-nowrap">
            <DollarSign size={11} className="text-emerald-500/70" />
            ₹{Math.floor(job.salary_min / 100000)}L - ₹{Math.floor(job.salary_max / 100000)}L
          </div>
        ) : null}
      </div>

      {/* Matched Skills */}
      <div className="flex-1">
        {job.matchedSkills && job.matchedSkills.length > 0 ? (
          <div className="mb-4">
             <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">Matched Skills</p>
             <div className="flex flex-wrap gap-1.5">
               {job.matchedSkills.slice(0, 4).map((skill: string) => (
                 <span key={skill} className="px-2 py-0.5 rounded-[6px] bg-[#ffffff08] text-[10px] text-gray-300 border border-[#ffffff10]">
                   {skill}
                 </span>
               ))}
               {job.matchedSkills.length > 4 && (
                 <span className="px-2 py-0.5 rounded-[6px] bg-[#ffffff08] text-[10px] text-gray-500">
                   +{job.matchedSkills.length - 4} more
                 </span>
               )}
             </div>
          </div>
        ) : (
           <p className="text-xs text-gray-500 line-clamp-3 mb-4 leading-relaxed">
             {job.description?.replace(/<[^>]*>?/gm, '') || "No description provided."}
           </p>
        )}
      </div>

      {/* View Details Button */}
      <div className="mt-auto pt-4 border-t border-[#ffffff05]">
        <button 
          className="w-full flex items-center justify-center gap-2 py-3 rounded-[12px] bg-white/5 group-hover:bg-white/10 border border-white/10 transition-colors text-[13px] font-semibold text-white group/btn"
        >
          View Intelligence
          <ExternalLink size={14} className="text-gray-400 group-hover/btn:text-white transition-colors" />
        </button>
      </div>
    </motion.div>
  );
}
