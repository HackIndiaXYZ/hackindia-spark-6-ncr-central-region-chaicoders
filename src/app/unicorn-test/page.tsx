"use client";

import UnicornComponent from "@/components/UnicornComponent";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

/**
 * Demo page focusing on Unicorn Studio integration.
 */
export default function UnicornDemoPage() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      <Navbar />
      
      {/* Unicorn Studio Background Effect */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
        <UnicornComponent 
          projectId="KR4Lp50pTeNcFzJcT0Qd" 
          className="w-full h-full"
        />
      </div>

      {/* Overlay Content to make it look premium */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-[#C7966B] font-black tracking-[1em] uppercase text-xs md:text-sm mb-6"
        >
          Next-Gen Career Intelligence
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, scale: 1, letterSpacing: "-0.05em" }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
          className="text-white text-7xl md:text-[12vw] font-black uppercase tracking-tighter leading-none mb-12 drop-shadow-2xl"
        >
          INTELLE<span className="text-[#C7966B]">CT</span>
        </motion.h1>

        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "300px" }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="h-1 bg-gradient-to-r from-transparent via-[#C7966B] to-transparent mb-12"
        ></motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-gray-400 max-w-xl text-lg md:text-xl font-medium tracking-wide leading-relaxed italic"
        >
          "Our shader-driven intelligence layer provides real-time visualization of your career vector and market trajectory."
        </motion.p>
      </div>

      {/* Footer-like status line */}
      <div className="absolute bottom-12 left-0 right-0 z-10 flex justify-between px-12 md:px-24">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-[#C7966B] animate-pulse"></div>
          <span className="text-white/40 text-[10px] font-black tracking-widest uppercase">Systems Active</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-[10px] font-black tracking-widest uppercase">Vector ID: KR4LP50...</span>
        </div>
      </div>
    </main>
  );
}
