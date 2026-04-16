"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Map as MapIcon, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  BrainCircuit,
  Target,
  ArrowRight,
  Loader2,
  Trash2,
  Home,
  User,
  TrendingUp,
  BarChart3,
  Award,
  Zap,
  Globe,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface RoadmapStage {
  title: string;
  description: string;
  duration: string;
  skillsToLearn: string[];
  resources: { title: string; url: string }[];
  milestone: string;
}

// ─── Custom Graph Components ──────────────────────────────────────────────────

const MarketGrowthGraph = () => (
  <div className="h-32 w-full relative group">
    <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
      {/* Grid Lines */}
      {[0, 25, 50, 75, 100].map(v => (
        <line key={v} x1="0" y1={v} x2="400" y2={v} stroke="white" strokeOpacity="0.05" strokeWidth="1" />
      ))}
      {/* The Line */}
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        d="M 0 80 Q 50 70 100 85 T 200 40 T 300 20 T 400 10"
        fill="none"
        stroke="url(#gradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Dots */}
      <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.8 }} cx="400" cy="10" r="4" fill="#8a2be2" className="shadow-lg shadow-purple-500/50" />
      
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8a2be2" />
        </linearGradient>
      </defs>
    </svg>
    <div className="absolute top-0 right-0 text-[10px] text-purple-400 font-bold uppercase tracking-tighter bg-purple-500/10 px-2 py-0.5 rounded">+42% Growth</div>
  </div>
);

const SkillRadar = () => (
  <div className="flex items-center justify-center p-4">
    <div className="relative w-40 h-40">
      {/* Background Hexagon Rings */}
      <div className="absolute inset-0 border border-white/5 rounded-full scale-100" />
      <div className="absolute inset-0 border border-white/5 rounded-full scale-75" />
      <div className="absolute inset-0 border border-white/5 rounded-full scale-50" />
      <div className="absolute inset-0 border border-white/5 rounded-full scale-25" />
      
      {/* Radar Shape */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
        <motion.polygon
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "backOut" }}
          points="50,10 90,40 80,80 20,80 10,40"
          fill="rgba(138,43,226,0.2)"
          stroke="#8a2be2"
          strokeWidth="1.5"
        />
        {/* Connection points */}
        <circle cx="50" cy="10" r="2" fill="white" />
        <circle cx="90" cy="40" r="2" fill="white" />
        <circle cx="80" cy="80" r="2" fill="white" />
        <circle cx="20" cy="80" r="2" fill="white" />
        <circle cx="10" cy="40" r="2" fill="white" />
      </svg>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RoadmapPage() {
  const [targetRole, setTargetRole] = useState("");
  const [goals, setGoals] = useState("");
  const [roadmap, setRoadmap] = useState<RoadmapStage[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Load profile
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("users").select("*").eq("id", user.id).single();
        setUserProfile(data);
      }
    }
    fetchUser();

    // Load saved roadmap
    const saved = localStorage.getItem("intellect_roadmap");
    if (saved) {
      try {
        setRoadmap(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved roadmap");
      }
    }
  }, []);

  const generateRoadmap = async () => {
    if (!targetRole) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole,
          goals: goals.split(",").map(g => g.trim()).filter(Boolean),
          experienceLevel: userProfile?.experience_level || "Mid Level",
          currentSkills: userProfile?.skills || [],
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setRoadmap(data.roadmap);
      localStorage.setItem("intellect_roadmap", JSON.stringify(data.roadmap));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate roadmap");
    } finally {
      setIsLoading(false);
    }
  };

  const clearRoadmap = () => {
    setRoadmap(null);
    localStorage.removeItem("intellect_roadmap");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">
      
      {/* ─── LEFT SIDEBAR PANEL ─── */}
      <aside className="w-full md:w-80 lg:w-96 p-8 border-r border-white/5 flex flex-col h-screen sticky top-0 bg-[#080808]">
        {/* Home Key / Logo */}
        <div className="mb-12">
          <Link href="/" className="group inline-block">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-black text-xl shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                 I
               </div>
               <div>
                  <h1 className="text-xl font-black uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all">Intellect</h1>
                  <div className="h-[2px] w-4 bg-purple-500 group-hover:w-full transition-all duration-500" />
               </div>
             </div>
          </Link>
        </div>

        {/* User Profile Mini-Card */}
        <div className="mb-10 p-5 rounded-2xl bg-white/[0.03] border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <User className="text-gray-400" size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold truncate pr-2">{userProfile?.name || "Member Profile"}</h3>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{userProfile?.current_role || "Explorer Account"}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Award size={12} className="text-amber-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Level 24 Candidate</span>
            </div>
            <Link href="/profile" className="text-[10px] font-bold text-purple-400 hover:text-white transition-colors uppercase tracking-widest">Edit</Link>
          </div>
        </div>

        {/* Control Panel / Form */}
        <div className="flex-1 space-y-8">
           <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 px-1">Synthesis Engine</p>
              
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 ml-1 uppercase">Target Role</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    type="text" 
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Lead Architect"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 ml-1 uppercase">Strategic Goals</label>
                <textarea 
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="Relocation, 200k+ salary, FAANG..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all resize-none placeholder:text-gray-600"
                />
              </div>

              <button 
                onClick={generateRoadmap}
                disabled={!targetRole || isLoading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-xs uppercase tracking-widest text-white flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(138,43,226,0.3)] disabled:opacity-50 transition-all relative overflow-hidden group active:scale-95"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Zap size={16} className="relative z-10" />
                <span className="relative z-10">Generate Roadmap</span>
              </button>
           </div>

           {/* Quick Stats Mini-Grid */}
           <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                 <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-1">Global Demand</p>
                 <p className="text-xl font-serif text-blue-400">High</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                 <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-1">Skill Match</p>
                 <p className="text-xl font-serif text-purple-400">74%</p>
              </div>
           </div>
        </div>

        {/* Footer Action */}
        <div className="mt-8 pt-6 border-t border-white/5">
           <Link href="/dashboard" className="flex items-center gap-3 text-xs text-gray-500 hover:text-white transition-colors">
              <Home size={16} />
              <span>Back to Command Center</span>
           </Link>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar relative">
        
        {/* Dynamic Background Glows */}
        <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="p-8 md:p-12 lg:p-16 max-w-6xl mx-auto w-full relative z-10">
          
          {/* Dashboard Header Bar */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
             <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="h-[1px] w-12 bg-white/20" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500">Global Career Intelligence</span>
               </div>
               <h2 className="text-5xl md:text-6xl font-serif font-medium leading-none">
                 Intelligence <br />
                 <span className="text-gray-500">Mapping.</span>
               </h2>
             </div>

             {/* Live Market Pulse (Graphs) */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full lg:w-auto">
                <div className="glass-morphic rounded-3xl p-6 border border-white/10 w-full sm:w-64">
                   <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Market Pulse</p>
                      <TrendingUp size={14} className="text-blue-400" />
                   </div>
                   <MarketGrowthGraph />
                </div>
                <div className="glass-morphic rounded-3xl p-6 border border-white/10 w-full sm:w-64 flex flex-col items-center">
                   <div className="w-full flex items-center justify-between mb-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">Skill Orbit</p>
                      <BrainCircuit size={14} className="text-purple-400" />
                   </div>
                   <SkillRadar />
                </div>
             </div>
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              /* Loading Intelligence State */
              <motion.div 
                key="loading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-40"
              >
                <div className="relative mb-12">
                   <div className="w-32 h-32 rounded-full border border-white/5 flex items-center justify-center">
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 1, 0.3],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"
                      />
                      <BrainCircuit className="text-white relative z-10" size={56} />
                      {/* Rotating Rings */}
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-20px] border-[1px] border-dashed border-purple-500/30 rounded-full"
                      />
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-40px] border-[1px] border-dashed border-blue-500/20 rounded-full"
                      />
                   </div>
                </div>
                <h3 className="text-2xl font-serif text-white mb-3">Synthesizing Architecture...</h3>
                <p className="text-gray-500 text-sm max-w-sm text-center leading-relaxed font-light">
                  Querying the <span className="text-white">Gemini 2.0 Oracle</span> and analyzing 
                  global vacancy trends for <strong>{targetRole}</strong>.
                </p>
              </motion.div>
            ) : roadmap ? (
              /* Result State */
              <motion.div 
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-24"
              >
                {/* Roadmap Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                  <div>
                    <h3 className="text-2xl text-white font-serif flex items-center gap-3">
                      <Target className="text-purple-400" size={24} />
                      Curated Path for {targetRole}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1 font-bold uppercase tracking-widest">Optimized for 2026 job market performance</p>
                  </div>
                  <button 
                    onClick={clearRoadmap}
                    className="group px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-red-500/30 text-gray-400 hover:text-red-400 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                  >
                    <Trash2 size={14} className="group-hover:rotate-12 transition-transform" />
                    Discard Map
                  </button>
                </div>

                {/* Timeline Visualization */}
                <div className="relative">
                  {/* Strategic Axis (Line) */}
                  <div className="absolute left-[-1.5px] top-0 bottom-0 w-[3px] bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-transparent rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)] hidden md:block" />

                  <div className="space-y-20">
                    {roadmap.map((stage, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        className="relative md:pl-20 group"
                      >
                        {/* Interactive Node */}
                        <div className="absolute left-[-12px] top-8 w-6 h-6 rounded-full bg-[#0a0a0a] border-2 border-purple-500 z-10 group-hover:scale-150 transition-transform duration-500 hidden md:block shadow-[0_0_15px_rgba(138,43,226,0.5)]">
                          <div className="absolute inset-1.5 rounded-full bg-purple-500 group-hover:bg-blue-400 transition-colors animate-pulse" />
                        </div>

                        <div className="glass-card rounded-[40px] p-8 md:p-12 border border-white/[0.03] hover:border-white/10 transition-all duration-500 hover:bg-white/[0.02] relative overflow-hidden group/card shadow-2xl">
                          {/* Ambient glow in card */}
                          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />
                          
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-10 relative z-10">
                            <div className="max-w-2xl">
                              <div className="flex items-center gap-4 text-purple-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
                                <Clock size={12} />
                                <span>Timeline: {stage.duration}</span>
                                <div className="h-[1px] w-8 bg-purple-500/30" />
                                <span className="text-gray-500">Stage 0{idx + 1}</span>
                              </div>
                              <h4 className="text-3xl md:text-4xl font-serif text-white mb-6 group-hover/card:text-blue-400 transition-colors">{stage.title}</h4>
                              <p className="text-gray-400 text-lg font-light leading-relaxed">
                                {stage.description}
                              </p>
                            </div>
                            
                            <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-white/[0.02] border border-white/5 min-w-[200px]">
                               <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2">Gate Pass</p>
                               <CheckCircle2 size={32} className="text-blue-400 mb-3" />
                               <span className="text-sm font-bold text-white text-center">{stage.milestone}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 relative z-10">
                            {/* Skills Vector */}
                            <div className="space-y-6">
                              <div className="flex items-center gap-3">
                                <Zap className="text-blue-400" size={16} />
                                <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Target Proficiencies</h5>
                              </div>
                              <div className="flex flex-wrap gap-3">
                                {stage.skillsToLearn.map((skill, si) => (
                                  <motion.span 
                                    key={si}
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(59,130,246,0.15)" }}
                                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300 font-medium transition-all"
                                  >
                                    {skill}
                                  </motion.span>
                                ))}
                              </div>
                            </div>

                            {/* Resource Curations */}
                            <div className="space-y-6">
                              <div className="flex items-center gap-3">
                                <BookOpenIcon size={16} className="text-purple-400" />
                                <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Verified Knowledge Base</h5>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {stage.resources.map((res, i) => (
                                  <a 
                                    key={i}
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.06] transition-all text-[11px] font-black uppercase tracking-widest text-gray-400 group/link"
                                  >
                                    <span className="truncate pr-2">{res.title}</span>
                                    <ExternalLink size={12} className="shrink-0 text-gray-600 group-hover/link:text-purple-400 transition-colors" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Strategy Summative Card */}
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   className="glass-card rounded-[50px] p-12 border border-purple-500/20 bg-gradient-to-br from-purple-500/[0.03] to-blue-500/[0.03] text-center shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/[0.01]" />
                  <div className="relative z-10">
                    <Globe className="text-purple-400 mx-auto mb-6 drop-shadow-glow" size={48} />
                    <h3 className="text-3xl text-white font-serif mb-4">Strategic Mapping Complete</h3>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                      Your career trajectory is now mathematically aligned with global demand for <strong>{targetRole}</strong>. 
                      Priority weighting suggests focusing heavily on Stage 01 to unlock the highest salary tiers.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button className="px-10 py-5 rounded-2xl bg-white text-black font-black uppercase text-[11px] tracking-widest hover:scale-105 transition-transform">
                        Download Strategic PDF
                      </button>
                      <button className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase text-[11px] tracking-widest hover:bg-white/10 transition-all">
                        Synchronize with Calendar
                      </button>
                    </div>
                  </div>
                </motion.div>

              </motion.div>
            ) : (
              /* Initial State Overlay */
              <div className="flex flex-col items-center justify-center py-40 opacity-20">
                 <MapIcon size={120} className="text-gray-700 mb-8" />
                 <p className="text-2xl font-serif text-gray-600 italic">No trajectory currently mapped.</p>
              </div>
            )}
          </AnimatePresence>

        </div>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .glass-card { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(40px); }
        .glass-morphic { background: rgba(255, 255, 255, 0.01); backdrop-filter: blur(20px); }
        .drop-shadow-glow { filter: drop-shadow(0 0 8px rgba(138,43,226,0.5)); }
      `}</style>
    </div>
  );
}

// ─── Missing Lucide Icons Hack ───
const BookOpenIcon = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);
