"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { 
  Briefcase, 
  GraduationCap, 
  Map as MapIcon, 
  ArrowRight,
  TrendingUp,
  Clock,
  ChevronRight,
  ExternalLink,
  Award,
  Zap,
  History as HistoryIcon,
  MessageSquare,
  Users,
  ChevronDown,
  ArrowUpRight,
  LayoutDashboard
} from "lucide-react";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AIChatBot } from "@/components/dashboard/AIChatBot";
import { BryzosCard } from "@/components/dashboard/BryzosCard";
import { SkillVector } from "@/components/dashboard/SkillVector";
import { MarketIntelligence } from "@/components/dashboard/MarketIntelligence";
import SmoothScroll from "@/components/SmoothScroll";
import { motion, AnimatePresence } from "framer-motion";
import UnicornComponent from "@/components/UnicornComponent";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [marketAnalysis, setMarketAnalysis] = useState<any>(null);
  const [skillScore, setSkillScore] = useState<number>(0);
  const [marketFitScore, setMarketFitScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const authChecked = useRef(false);

  useEffect(() => {
    if (authChecked.current) return;
    authChecked.current = true;

    async function checkUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setUser(null);
      } else {
        setUser(user);
        
        const { data: profileData } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile(profileData);
        if (profileData?.skill_vector_score) setSkillScore(profileData.skill_vector_score);
        if (profileData?.market_fit_score) setMarketFitScore(profileData.market_fit_score);

        if (!profileData || !profileData.institution || !profileData.career_goal) {
          setTimeout(() => {
            router.push("/setup-profile");
          }, 0);
        }
      }
      setLoading(false);
    }
    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-[1px] bg-[#C7966B] animate-pulse shadow-[0_0_20px_rgba(199,150,107,0.5)]" />
      </div>
    );
  }

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-black text-white selection:bg-[#C7966B]/30 font-sans relative overflow-hidden">
        {/* UNIVERSAL BACKGROUND - LOWER OPACITY FOR DASHBOARD CONTEXT */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20 contrast-125">
          <UnicornComponent projectId="KR4Lp50pTeNcFzJcT0Qd" className="w-full h-full" />
        </div>

        <div className="relative z-10 flex min-h-screen">
          <DashboardSidebar />

          <main className="flex-1 min-h-screen flex flex-col pl-[260px] pb-20">
            {/* Glossy Header */}
            <header className="h-[100px] px-10 flex items-center justify-between sticky top-0 z-40 bg-black/5 backdrop-blur-3xl border-b border-white/5">
              <div className="flex flex-col">
                <span className="text-[#C7966B] text-[10px] font-black tracking-[0.4em] uppercase">Intelligence Node: 01</span>
                <h1 className="text-2xl font-black text-white uppercase tracking-tighter">System Terminal</h1>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-4 cursor-pointer group" onClick={() => router.push("/profile")}>
                  <div className="text-right hidden md:block">
                     <p className="text-white text-[12px] font-black uppercase tracking-widest leading-none mb-1">
                        {profile?.name || user?.email?.split('@')[0]}
                     </p>
                     <p className="text-[#C7966B] text-[10px] font-bold uppercase opacity-60">Professional Rank: Alpha</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#C7966B]/30 bg-[#C7966B]/10 flex items-center justify-center font-black text-[#C7966B]">
                    {profile?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                </div>
                
                <div className="h-10 w-[1px] bg-white/10" />
                
                <button 
                  onClick={() => router.push("/dashboard/jobs")}
                  className="group relative overflow-hidden px-8 py-3 bg-[#C7966B] text-white text-[10px] font-black tracking-[0.3em] uppercase rounded-full shadow-[0_15px_40px_rgba(199,150,107,0.3)] hover:scale-105 transition-transform duration-500"
                >
                  <span className="relative z-10 flex items-center gap-2">Live Market <ArrowUpRight className="w-3.5 h-3.5" /></span>
                </button>
              </div>
            </header>

            <div className="px-12 flex-1 flex flex-col pt-12">
              {/* Greeting Reimagined */}
              <div className="flex justify-between items-end mb-16">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1 }}
                >
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#C7966B] text-[10px] font-black uppercase tracking-widest mb-6">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Active Sync</span>
                  </div>
                  <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none text-white">
                    Master <span className="text-[#C7966B]">{profile?.name?.split(' ')[0] || "User"}</span>
                  </h2>
                </motion.div>
                
                <div className="text-right p-6 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl">
                    <p className="text-[#C7966B] text-[10px] font-black tracking-widest uppercase mb-2">Target Trajectory</p>
                    <p className="text-2xl font-black text-white uppercase tracking-tighter">{profile?.career_goal || "Not initialized"}</p>
                </div>
              </div>

              {/* Stats Experience */}
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <StatsCard 
                  title="Matrix Matches" 
                  value={marketAnalysis ? (marketAnalysis.jobs?.length || 0).toString() : "0"} 
                  subtitle="Active Connections" 
                  icon={Briefcase} 
                  trend={12} 
                  color="copper" 
                />
                <StatsCard title="Scholar Hub" value="43" subtitle="Deadlines active" icon={GraduationCap} trend={4} color="copper" />
                <StatsCard 
                  title="Vector Alignment" 
                  value={`${marketAnalysis?.matchScore ?? marketFitScore}%`}
                  subtitle="Dynamic Fit" 
                  icon={MapIcon} 
                  trend={8} 
                  color="copper" 
                />
                <StatsCard 
                  title="Peak Valuation" 
                  value={marketAnalysis ? `$${(marketAnalysis.salary?.max / 1000).toFixed(0)}k` : "$0k"} 
                  subtitle="Projected Cap" 
                  icon={TrendingUp} 
                  trend={2} 
                  color="copper" 
                />
              </section>

              {/* Analytics Core - Premium Glass Blocks */}
              <section className="grid grid-cols-1 xl:grid-cols-2 gap-10 mb-12">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl p-4 min-h-[500px]"
                >
                  <SkillVector 
                      userSkills={profile?.skills || []} 
                      marketSkills={marketAnalysis?.skillsRequired || []}
                      careerGoal={profile?.career_goal || "Software Engineer"}
                      experienceLevel={profile?.experience_level || "Beginner"}
                      onScoreUpdate={setSkillScore}
                      className="h-full border-0 !bg-transparent" 
                  />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl p-4 min-h-[500px]"
                >
                   <MarketIntelligence 
                      userSkills={profile?.skills || []} 
                      targetRole={profile?.career_goal || "AI Engineer"} 
                      onAnalysisUpdate={(a: any) => { setMarketAnalysis(a); if (a?.matchScore) setMarketFitScore(a.matchScore); }}
                    />
                </motion.div>
              </section>

              {/* Final Grid Sections */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 mb-10">
                <div className="xl:col-span-8 flex flex-col gap-6">
                  <div className="flex justify-between items-center px-4">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Market Real-Time</h3>
                    <button className="text-[10px] font-black tracking-widest uppercase text-[#C7966B]">Matrix Stream &gt;</button>
                  </div>
                  
                  <div className="grid gap-6">
                    <BryzosCard 
                      title="Cloud Architecture Lead" 
                      subtitle="Systems Intelligence"
                      description="Strategic placement aligned with your specialized cloud vector metrics."
                      metric1="$220k Range"
                      metric2="High Priority"
                      label="Neural Match"
                    />
                    <BryzosCard 
                      title="Senior AI Strategist" 
                      subtitle="Global Optimization"
                      description="Direct roadmap alignment for your 12-month career progression."
                      metric1="Silicon Valley"
                      metric2="Premium Ops"
                      label="Trend Alignment"
                    />
                  </div>
                </div>

                <div className="xl:col-span-4 flex flex-col gap-6">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter px-4">Event History</h3>
                  <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-10 h-full">
                    <div className="space-y-8">
                      {[
                        { type: "Sync", name: "Vector Update 4.2", date: "Now", status: "Active" },
                        { type: "Map", name: "Career Route: Lead", date: "4h Ago", status: "Optimized" },
                        { type: "Gain", name: "Thesis Fellowship", date: "1d Ago", status: "Match" }
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center group">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C7966B]">
                              <HistoryIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                               <p className="text-[14px] font-bold text-white uppercase tracking-tight">{item.name}</p>
                               <p className="text-[10px] text-[#C7966B] font-black uppercase tracking-widest mt-1 opacity-60">{item.type} • {item.date}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <AIChatBot />
      </div>
    </SmoothScroll>
  );
}
