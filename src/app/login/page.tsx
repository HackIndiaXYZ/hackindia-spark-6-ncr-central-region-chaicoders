"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import AuthTransition from "@/components/AuthTransition";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(searchParams.get("error"));
  const [message, setMessage] = useState<string | null>(null);

  // ── Email / Password Login ──────────────────────────────────────────────────
  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data: { session }, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else if (session) {
      const { data: profile } = await supabase
        .from("users")
        .select("institution, career_goal")
        .eq("id", session.user.id)
        .single();

      if (!profile || !profile.institution || !profile.career_goal) {
        setMessage("Login successful! Technical setup required...");
        router.push("/setup-profile");
      } else {
        setMessage("Login successful! Redirecting…");
        router.push("/dashboard");
      }
    }
    setLoading(false);
  }

  // ── Social OAuth Handlers ──────────────────────────────────────────────────
  async function handleSocialLogin(provider: "google" | "github") {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black overflow-hidden relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero_organic_intel_bg_1775323851016.png" 
          alt="Background" 
          fill 
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-transparent" />
      </div>

      <AuthTransition>
        <div className="max-w-[1200px] w-full mx-auto flex flex-col md:flex-row min-h-[700px] relative z-10 border border-white/10 backdrop-blur-3xl bg-black/40 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          
          {/* Left Side – Editorial Visual */}
          <div className="relative hidden md:flex md:w-[50%] overflow-hidden bg-[#1a1a1a]">
            {/* Massive Ghost Text */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -rotate-90 opacity-10 pointer-events-none whitespace-nowrap">
              <span className="text-[20vh] font-black uppercase tracking-tighter text-white">LOGIN</span>
            </div>
            
            <div className="relative w-full h-full p-20 flex flex-col justify-end gap-6 z-10">
              <div className="w-12 h-1 bg-[#C7966B]"></div>
              <h2 className="text-6xl font-black uppercase text-white leading-none tracking-tighter">
                ACCESS <br /> THE ENGINE
              </h2>
              <p className="text-gray-400 text-sm font-medium tracking-widest uppercase">
                Global Career Intelligence v2.0
              </p>
            </div>
          </div>

          {/* Right Side – Precise Form */}
          <div className="flex-1 px-8 py-16 md:px-20 md:py-24 flex flex-col justify-center bg-black/60">
            <div className="max-w-[400px] w-full mx-auto">
              
              {/* Header */}
              <div className="flex flex-col gap-2 mb-12">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">INTELLECT</h1>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Return to your trajectory</p>
                  <Link href="/signup" className="text-[10px] text-[#C7966B] font-bold uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center gap-2">
                    Join Us <ArrowRight size={10} />
                  </Link>
                </div>
              </div>

              {/* Status Messages */}
              {error && <div className="mb-6 p-4 bg-red-500/10 border-l-2 border-red-500 text-red-500 text-[10px] font-bold uppercase tracking-widest">{error}</div>}
              {message && <div className="mb-6 p-4 bg-[#C7966B]/10 border-l-2 border-[#C7966B] text-[#C7966B] text-[10px] font-bold uppercase tracking-widest">{message}</div>}

              {/* Form */}
              <form onSubmit={handleEmailLogin} className="space-y-6">
                <div className="group border-b border-white/10 focus-within:border-[#C7966B] transition-all py-2">
                  <input
                    type="email"
                    placeholder="EMAIL IDENTIFIER"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-white text-xs font-bold uppercase tracking-[0.2em] py-2 focus:outline-none"
                  />
                </div>
                <div className="group border-b border-white/10 focus-within:border-[#C7966B] transition-all py-2 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="SECURITY TOKEN"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-white text-xs font-bold uppercase tracking-[0.2em] py-2 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>

                <div className="flex justify-end pr-1">
                  <Link href="/forgot-password" title="Recover Access" className="text-[8px] text-gray-600 font-black uppercase tracking-[0.3em] hover:text-[#C7966B]">
                    LOST ACCESS?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative overflow-hidden bg-white text-black py-5 mt-10 hover:bg-[#C7966B] hover:text-white transition-all duration-500 disabled:opacity-50"
                >
                  <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.5em]">
                    {loading ? "AUTHENTICATING..." : "INITIATE LOGIN"}
                  </span>
                </button>
              </form>

              {/* Social Auth */}
              <div className="mt-12 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-[1px] bg-white/5" />
                  <span className="text-[8px] text-gray-700 font-bold uppercase tracking-[0.4em]">External Gateways</span>
                  <div className="flex-1 h-[1px] bg-white/5" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => handleSocialLogin("google")} className="py-4 border border-white/5 text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white transition-all">
                    GOOGLE
                  </button>
                  <button onClick={() => handleSocialLogin("github")} className="py-4 border border-white/5 text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white transition-all">
                    GITHUB
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </AuthTransition>
    </div>
  );
}
