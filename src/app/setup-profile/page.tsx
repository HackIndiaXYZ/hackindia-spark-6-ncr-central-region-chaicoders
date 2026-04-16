"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AuthTransition from "@/components/AuthTransition";
import {
  User,
  School,
  Target,
  Sparkles,
  Briefcase,
  ChevronRight,
  Loader2,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Wand2,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  institution: string;
  career_goal: string;
  education: string;
  experience_level: string;
  skills: string[];
}

type ParseStatus = "idle" | "uploading" | "parsing" | "success" | "error";

// ── Component ──────────────────────────────────────────────────────────────────

export default function SetupProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Resume upload state
  const [parseStatus, setParseStatus] = useState<ParseStatus>("idle");
  const [parseError, setParseError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [autofillHighlight, setAutofillHighlight] = useState(false);

  // Form State
  const [formData, setFormData] = useState<FormData>({
    name: "",
    institution: "",
    career_goal: "",
    education: "",
    experience_level: "Beginner",
    skills: [],
  });

  const [currentSkill, setCurrentSkill] = useState("");

  useEffect(() => {
    async function getUserData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const { user } = session;
      setFormData((prev: FormData) => ({
        ...prev,
        name: user.user_metadata?.full_name || user.user_metadata?.name || "",
      }));

      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFormData({
          name: profile.name || user.user_metadata?.full_name || "",
          institution: profile.institution || "",
          career_goal: profile.career_goal || "",
          education: profile.education || "",
          experience_level: profile.experience_level || "Beginner",
          skills: profile.skills || [],
        });
      }
      setInitialLoading(false);
    }
    getUserData();
  }, [router]);

  // ── Resume Parsing ──────────────────────────────────────────────────────────
  const loadingSteps = ["Scanning data structure...", "Extracting intelligence...", "Mapping trajectory...", "Finalizing profile..."];
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);

  useEffect(() => {
    if (parseStatus !== "uploading" && parseStatus !== "parsing") {
      setLoadingStepIdx(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStepIdx((s: number) => Math.min(s + 1, loadingSteps.length - 1));
    }, 1500);
    return () => clearInterval(interval);
  }, [parseStatus]);

  const parseResume = useCallback(async (file: File) => {
    setParseStatus("uploading");
    setParseError(null);
    setUploadedFileName(file.name);

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    const body = new FormData();
    body.append("resume", file);
    if (userId) body.append("userId", userId);

    try {
      setParseStatus("parsing");
      const res = await fetch("/api/parse-resume", { method: "POST", body });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to parse resume.");

      const d = json.data;
      setFormData((prev: FormData) => ({
        name: d.name?.trim() || prev.name,
        institution: d.institution?.trim() || prev.institution,
        career_goal: d.career_goal?.trim() || prev.career_goal,
        education: d.education?.trim() || prev.education,
        experience_level: d.experience_level?.trim() || prev.experience_level,
        skills: Array.isArray(d.skills) && d.skills.length > 0 ? d.skills : prev.skills,
      }));
      setParseStatus("success");
      setAutofillHighlight(true);
      setTimeout(() => setAutofillHighlight(false), 2000);
    } catch (err: any) {
      setParseStatus("error");
      setParseError(`Extraction failure: ${err.message}`);
    }
  }, []);

  const handleFileSelect = (file: File | null | undefined) => {
    if (!file) return;
    parseResume(file);
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
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

    if (updateError) setError(updateError.message);
    else router.push("/dashboard");
    setLoading(false);
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData((prev: FormData) => ({ ...prev, skills: [...prev.skills, currentSkill.trim()] }));
      setCurrentSkill("");
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-12 h-12 text-[#C7966B] animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50 animate-pulse">Loading Protocol</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero_organic_intel_bg_1775323851016.png" 
          alt="Background" 
          fill 
          className="object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#C7966B]/5 blur-[120px] rounded-full pointer-events-none" />

      <AuthTransition>
        <div className="max-w-[800px] w-full mx-auto relative z-10 flex flex-col md:flex-row gap-12 items-center">
          
          <div className="hidden md:flex flex-col gap-10 items-center w-8">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all duration-500 ${i <= step ? "bg-[#C7966B] scale-150 rotate-45 shadow-[0_0_10px_#C7966B]" : "bg-white/10"}`} 
              />
            ))}
          </div>

          <div className="flex-1 w-full glass rounded-[3rem] p-8 md:p-16 border border-white/5 backdrop-blur-3xl bg-white/[0.02]">
            
            <div className="mb-12 relative z-10">
              <span className="text-[#C7966B] text-[10px] font-black tracking-[0.5em] uppercase mb-4 block">Onboarding v2.0</span>
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
                COMPLETE YOUR <br /> PROFILE
              </h1>
            </div>

            <ResumeUploadZone
              parseStatus={parseStatus}
              parseError={parseError}
              uploadedFileName={uploadedFileName}
              fileInputRef={fileInputRef}
              onFileSelect={handleFileSelect}
              loadingStepIdx={loadingStepIdx}
              loadingSteps={loadingSteps}
            />

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                  <Input 
                    label="IDENTIFIER" 
                    placeholder="FULL NAME" 
                    value={formData.name} 
                    onChange={(v: string) => setFormData({...formData, name: v})} 
                    icon={<User size={16}/>}
                    highlight={autofillHighlight && !!formData.name}
                  />
                  <Input 
                    label="AFFILIATION" 
                    placeholder="INSTITUTION / ORGANIZATION" 
                    value={formData.institution} 
                    onChange={(v: string) => setFormData({...formData, institution: v})} 
                    icon={<School size={16}/>}
                    highlight={autofillHighlight && !!formData.institution}
                  />
                  <button onClick={() => setStep(2)} disabled={!formData.name || !formData.institution} className="w-full bg-white text-black py-6 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-[#C7966B] hover:text-white transition-all duration-500 disabled:opacity-50">
                    NEXT PHASE
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                  <Input 
                    label="TRAJECTORY" 
                    placeholder="CAREER AMBITION" 
                    value={formData.career_goal} 
                    onChange={(v: string) => setFormData({...formData, career_goal: v})} 
                    icon={<Target size={16}/>}
                    highlight={autofillHighlight && !!formData.career_goal}
                  />
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">LEVEL OF COMPETENCE</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Undergraduate", "Graduate", "Professional"].map(level => (
                        <button key={level} onClick={() => setFormData({...formData, education: level})} className={`py-4 text-[8px] font-black uppercase border transition-all ${formData.education === level ? "border-[#C7966B] text-[#C7966B]" : "border-white/5 text-white/40 hover:border-white/20"}`}>
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="flex-1 py-6 border border-white/10 text-[10px] font-black text-white/40 uppercase hover:bg-white/5">BACK</button>
                    <button onClick={() => setStep(3)} disabled={!formData.career_goal || !formData.education} className="flex-[2] bg-white text-black py-6 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-[#C7966B] hover:text-white transition-all duration-500 disabled:opacity-50">FINAL STEP</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                  <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">CORE SKILLSET ({formData.skills.length})</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="ADD SKILL" value={currentSkill} onChange={e => setCurrentSkill(e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill()} className="flex-1 bg-transparent border-b border-white/10 text-white text-xs font-bold uppercase tracking-[0.2em] py-3 focus:outline-none focus:border-[#C7966B]"/>
                      <button onClick={addSkill} className="px-6 border border-white/10 text-[10px] font-black text-white hover:bg-[#C7966B] transition-all">ADD</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map(s => (
                        <span key={s} className="px-3 py-1.5 bg-white/5 border border-white/10 text-white text-[8px] font-bold uppercase tracking-widest flex items-center gap-2">
                          {s} <X size={10} className="cursor-pointer" onClick={() => setFormData({...formData, skills: formData.skills.filter(sk => sk !== s)})}/>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="flex-1 py-6 border border-white/10 text-[10px] font-black text-white/40 uppercase hover:bg-white/5">BACK</button>
                    <button onClick={handleUpdateProfile} disabled={loading || formData.skills.length === 0} className="flex-[2] bg-white text-black py-6 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-[#C7966B] hover:text-white transition-all duration-500 shadow-[0_0_30px_rgba(199,150,107,0.3)]">
                      {loading ? "SAVING..." : "COMPLETE PROTOCOL"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </AuthTransition>
      <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => handleFileSelect(e.target.files?.[0])} />
    </div>
  );
}

function Input({ label, placeholder, value, onChange, icon, highlight }: any) {
  return (
    <div className={`space-y-4 transition-all duration-500 ${highlight ? "scale-[1.02]" : ""}`}>
      <label className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">{label}</span>
        {highlight && <span className="text-[8px] font-black text-[#C7966B] uppercase tracking-[0.2em] animate-pulse">✦ AI SYNCHRONIZED</span>}
      </label>
      <div className="relative group border-b border-white/10 focus-within:border-[#C7966B] transition-all">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#C7966B] transition-colors">{icon}</div>
        <input type="text" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} className="w-full bg-transparent text-white text-xs font-bold uppercase tracking-[0.2em] py-4 pl-10 focus:outline-none"/>
      </div>
    </div>
  );
}

function ResumeUploadZone({ parseStatus, uploadedFileName, fileInputRef, onFileSelect, loadingStepIdx, loadingSteps }: any) {
  const isParsing = parseStatus === "uploading" || parseStatus === "parsing";
  const isSuccess = parseStatus === "success";

  return (
    <div 
      onClick={() => !isParsing && fileInputRef.current?.click()}
      className={`mb-12 p-8 border border-dashed rounded-3xl transition-all flex flex-col items-center text-center gap-4 cursor-pointer
        ${isParsing ? "border-[#C7966B] bg-[#C7966B]/5" : isSuccess ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/10 hover:border-[#C7966B] bg-white/[0.02]"}`}
    >
      <div className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-2xl">
        {isParsing ? <Loader2 size={18} className="text-[#C7966B] animate-spin" /> : 
         isSuccess ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Upload size={18} className="text-white/40" />}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-2">
          {isParsing ? loadingSteps[loadingStepIdx] : isSuccess ? "Protocol Updated" : "AI Sync Enabled"}
        </p>
        <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">
          {uploadedFileName || "Drop Resume (PDF/DOCX) for auto-fill"}
        </p>
      </div>
    </div>
  );
}
