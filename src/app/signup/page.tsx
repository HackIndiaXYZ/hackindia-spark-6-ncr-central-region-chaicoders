"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Grid, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Spline from "@splinetool/react-spline";
import AuthTransition from "@/components/AuthTransition";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(searchParams.get("error"));
  const [message, setMessage] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!agreed) {
      setError("Authorization required. Please accept Terms.");
      return;
    }
    if (password.length < 6) {
      setError("Token too short. Password must be 6+ characters.");
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Account synchronized. Check your email to activate.");
      setTimeout(() => router.push("/login"), 3000);
    }
    setLoading(false);
  }

  async function handleSocialSignup(provider: "google" | "github") {
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
        <div className="max-w-[1200px] w-full mx-auto flex flex-col md:flex-row min-h-[750px] relative z-10 border border-white/10 backdrop-blur-3xl bg-black/40 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          
          {/* Left Side – Precise Form */}
          <div className="flex-1 px-8 py-16 md:px-20 md:py-24 flex flex-col justify-center bg-black/60 order-2 md:order-1">
            <div className="max-w-[400px] w-full mx-auto">
              
              {/* Header */}
              <div className="flex flex-col gap-2 mb-12">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">INTELLECT</h1>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Initiate your profile</p>
                  <Link href="/login" className="text-[10px] text-[#C7966B] font-bold uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center gap-2">
                    <ArrowLeft size={10} /> Back to Login
                  </Link>
                </div>
              </div>

              {/* Status Messages */}
              {error && <div className="mb-6 p-4 bg-red-500/10 border-l-2 border-red-500 text-red-500 text-[10px] font-bold uppercase tracking-widest">{error}</div>}
              {message && <div className="mb-6 p-4 bg-[#C7966B]/10 border-l-2 border-[#C7966B] text-[#C7966B] text-[10px] font-bold uppercase tracking-widest">{message}</div>}

              {/* Form */}
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="group border-b border-white/10 focus-within:border-[#C7966B] transition-all py-2">
                  <input
                    type="text"
                    placeholder="FULL NAME"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent text-white text-xs font-bold uppercase tracking-[0.2em] py-2 focus:outline-none"
                  />
                </div>
                <div className="group border-b border-white/10 focus-within:border-[#C7966B] transition-all py-2">
                  <input
                    type="email"
                    placeholder="CONTACT EMAIL"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-white text-xs font-bold uppercase tracking-[0.2em] py-2 focus:outline-none"
                  />
                </div>
                <div className="group border-b border-white/10 focus-within:border-[#C7966B] transition-all py-2 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="SECURITY PASS"
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

                {/* Terms */}
                <div className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="appearance-none w-4 h-4 border border-white/10 bg-transparent checked:bg-[#C7966B] cursor-pointer transition-all"
                  />
                  <label htmlFor="terms" className="text-[8px] text-gray-500 font-black uppercase tracking-[0.3em] cursor-pointer">
                    I ACCEPT THE PROTOCOL TERMS
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative overflow-hidden bg-white text-black py-5 mt-4 hover:bg-[#C7966B] hover:text-white transition-all duration-500 disabled:opacity-50"
                >
                  <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.5em]">
                    {loading ? "INITIALIZING..." : "CREATE PROFILE"}
                  </span>
                </button>
              </form>

              {/* Social Auth */}
              <div className="mt-12 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-[1px] bg-white/5" />
                  <span className="text-[8px] text-gray-700 font-bold uppercase tracking-[0.4em]">Alternative Entry</span>
                  <div className="flex-1 h-[1px] bg-white/5" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => handleSocialSignup("google")} className="py-4 border border-white/5 text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white transition-all">
                    GOOGLE
                  </button>
                  <button onClick={() => handleSocialSignup("github")} className="py-4 border border-white/5 text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white transition-all">
                    GITHUB
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side – Editorial Visual */}
          <div className="relative hidden md:flex md:w-[50%] overflow-hidden bg-[#1a1a1a] order-1 md:order-2">
            <div className="absolute top-1/2 right-0 -translate-y-1/2 rotate-90 opacity-10 pointer-events-none whitespace-nowrap">
              <span className="text-[20vh] font-black uppercase tracking-tighter text-white">JOIN US</span>
            </div>
            
            <div className="relative w-full h-full p-20 flex flex-col justify-start gap-6 z-10">
              <div className="w-12 h-1 bg-[#C7966B]"></div>
              <h2 className="text-6xl font-black uppercase text-white leading-none tracking-tighter italic">
                START <br /> YOUR MOVE
              </h2>
              <p className="text-gray-400 text-sm font-medium tracking-widest uppercase">
                Intellect Engine Onboarding v1.0
              </p>
            </div>
          </div>
        </div>
      </AuthTransition>
    </div>
  );
}
