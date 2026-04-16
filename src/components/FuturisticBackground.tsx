"use client";

import { motion } from "framer-motion";

export default function FuturisticBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#020202]">
      {/* Dynamic Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      
      {/* Scanning Line Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-scan shadow-[0_0_15px_rgba(0,240,255,0.5)]"></div>
      </div>

      {/* Floating Radial Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse-slow ml-20"></div>
      
      {/* Subtle Noise (handled in layout, but adding another layer for depth) */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
}
