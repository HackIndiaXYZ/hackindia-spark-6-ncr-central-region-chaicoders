"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { 
  User, 
  School, 
  Target, 
  Briefcase, 
  Save, 
  ArrowLeft,
  Loader2,
  Mail,
  Award,
  Sparkles,
  Zap,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "@/lib/user-store";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const { skillVectorScore, setSkillVectorScore } = useUserStore();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institution: "",
    career_goal: "",
    education: "",
    experience_level: "Beginner",
    skills: [] as string[],
  });

  const [currentSkill, setCurrentSkill] = useState("");

  useEffect(() => {
    async function getUserData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        setProfileData(profile);
        if (profile.skill_vector_score) {
          setSkillVectorScore(profile.skill_vector_score);
        }
        setFormData({
          name: profile.name || "",
          email: profile.email || session.user.email || "",
          institution: profile.institution || "",
          career_goal: profile.career_goal || "",
          education: profile.education || "",
          experience_level: profile.experience_level || "Beginner",
          skills: profile.skills || [],
        });
      } else {
        // Fallback to auth data
        setFormData(prev => ({
          ...prev,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "",
          email: session.user.email || "",
        }));
      }
      
      setInitialLoading(false);
    }

    getUserData();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error: updateError } = await supabase
      .from("users")
      .update({
        name: formData.name,
        institution: formData.institution,
        career_goal: formData.career_goal,
        education: formData.education,
        experience_level: formData.experience_level,
        skills: formData.skills,
      })
      .eq("id", session.user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(null), 3000);
    }
    setLoading(false);
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
      <DashboardSidebar />

      <main className="pl-64 min-h-screen flex flex-col">
        <DashboardHeader />

        <div className="p-8 max-w-4xl mx-auto w-full">
          {/* Back Button */}
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar / Stats */}
            <div className="w-full md:w-1/3 space-y-6">
              <div className="p-6 glass rounded-3xl text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-serif font-bold text-3xl mb-4 shadow-lg shadow-accent-purple/20 relative z-10">
                  {formData.name.charAt(0).toUpperCase() || "U"}
                </div>
                <h2 className="text-xl font-serif font-medium relative z-10">{formData.name || "User"}</h2>
                <p className="text-gray-500 text-sm mb-4 relative z-10 font-light">{formData.email}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[10px] font-bold uppercase tracking-wider relative z-10">
                  <Award className="w-3 h-3" />
                  <span>Elite Member</span>
                </div>
              </div>

              {/* Skill Vector Score Card */}
              <div className="p-6 glass rounded-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-3.5 h-3.5 text-accent-blue" />
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Skill Vector Score</h3>
                  </div>

                  {/* Circular progress */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
                        <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                        <circle
                          cx="40" cy="40" r="30" fill="none"
                          stroke={!skillVectorScore ? '#374151' : skillVectorScore >= 75 ? '#10b981' : skillVectorScore >= 50 ? '#00f0ff' : skillVectorScore >= 25 ? '#f59e0b' : '#ef4444'}
                          strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 30}`}
                          strokeDashoffset={`${2 * Math.PI * 30 * (1 - (skillVectorScore || 0) / 100)}`}
                          style={{ filter: `drop-shadow(0 0 4px currentColor)`, transition: 'stroke-dashoffset 1s ease' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-black" style={{ color: !skillVectorScore ? '#374151' : skillVectorScore >= 75 ? '#10b981' : skillVectorScore >= 50 ? '#00f0ff' : '#f59e0b' }}>
                          {skillVectorScore || 0}
                        </span>
                        <span className="text-[8px] text-gray-600 font-bold">/100</span>
                      </div>
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${
                        !skillVectorScore ? 'text-gray-600' :
                        skillVectorScore >= 75 ? 'text-emerald-400' :
                        skillVectorScore >= 50 ? 'text-[#00f0ff]' :
                        skillVectorScore >= 25 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {!skillVectorScore ? 'Not Analyzed' :
                          skillVectorScore >= 75 ? 'Elite' :
                          skillVectorScore >= 50 ? 'Strong' :
                          skillVectorScore >= 25 ? 'Growing' : 'Emerging'}
                      </p>
                      <p className="text-[10px] text-gray-600 font-light mt-1 leading-relaxed">
                        {profileData?.vector_updated_at
                          ? `Updated ${new Date(profileData.vector_updated_at).toLocaleDateString()}`
                          : 'Go to Dashboard to analyze'}
                      </p>
                      {profileData?.skill_vector_score && (
                        <div className="mt-2 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-accent-blue" />
                          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Market Score</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 glass rounded-3xl">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Account Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs font-light">Roadmaps</span>
                    <span className="font-bold text-sm">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs font-light">Skills Tracked</span>
                    <span className="font-bold text-sm">{formData.skills.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs font-light">Member Since</span>
                    <span className="font-bold text-sm">
                      {profileData?.created_at 
                        ? new Date(profileData.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        : "March 2024"
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <div className="flex-1">
              <div className="p-8 glass rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-accent-purple">
                    <Sparkles size={160} />
                </div>
                
                <h3 className="text-xl font-serif font-medium mb-8 tracking-tight">Personal Information</h3>

                {message && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm"
                  >
                    {message}
                  </motion.div>
                )}

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-blue transition-colors" size={18} />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-accent-blue/30 transition-all font-light"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                      <div className="relative group opacity-50 cursor-not-allowed">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 text-sm cursor-not-allowed font-light"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Institution</label>
                      <div className="relative group">
                        <School className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-blue transition-colors" size={18} />
                        <input
                          type="text"
                          value={formData.institution}
                          onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-accent-blue/30 transition-all font-light"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Career Goal</label>
                      <div className="relative group">
                        <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-blue transition-colors" size={18} />
                        <input
                          type="text"
                          value={formData.career_goal}
                          onChange={(e) => setFormData({ ...formData, career_goal: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-accent-blue/30 transition-all font-light"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Education Level</label>
                      <div className="relative group">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-blue transition-colors" size={18} />
                        <select
                          value={formData.education}
                          onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-accent-blue/30 transition-all appearance-none font-light"
                        >
                          <option value="High School" className="bg-[#0a0a0a]">High School</option>
                          <option value="Undergraduate" className="bg-[#0a0a0a]">Undergraduate</option>
                          <option value="Graduate" className="bg-[#0a0a0a]">Graduate</option>
                          <option value="Doctorate" className="bg-[#0a0a0a]">Doctorate</option>
                          <option value="Working Professional" className="bg-[#0a0a0a]">Working Professional</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Experience Level</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Beginner", "Intermediate", "Advanced"].map((level) => (
                          <button
                            type="button"
                            key={level}
                            onClick={() => setFormData({ ...formData, experience_level: level })}
                            className={`py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg border transition-all ${
                              formData.experience_level === level
                                ? "bg-accent-purple/10 border-accent-purple text-accent-purple"
                                : "bg-white/5 border-white/10 text-gray-600 hover:border-white/20"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Skills</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add skill"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                        className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-blue/30 transition-all font-light"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="px-6 bg-white/5 text-white rounded-xl hover:bg-white/10 border border-white/10 transition-all text-[10px] font-bold uppercase tracking-widest"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.skills.map(skill => (
                        <span 
                          key={skill} 
                          className="px-3 py-1 bg-accent-purple/5 border border-accent-purple/20 text-accent-purple text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 group"
                        >
                          {skill}
                          <button 
                            type="button"
                            onClick={() => removeSkill(skill)} 
                            className="text-gray-600 hover:text-white transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                      {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          <Save size={18} className="text-gray-600" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
