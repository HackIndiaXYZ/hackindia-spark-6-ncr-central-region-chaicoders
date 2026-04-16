"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center opacity-50 z-0">
      <div className="text-2xl font-serif tracking-tighter font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 animate-pulse">
        Intellect
      </div>
    </div>
  ),
});

import { useRouter } from "next/navigation";
import { useTransitionStore } from "@/lib/transition-store";

export default function HeroSection() {
  const router = useRouter();
  const triggerTransition = useTransitionStore((state) => state.triggerTransition);
  const { scrollY } = useScroll();

  const handleGetStarted = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    triggerTransition(x, y, "#ffffff");
    setTimeout(() => {
      router.push("/signup");
    }, 800);
  };
  
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section id="home" className="relative w-full min-h-screen max-h-screen overflow-hidden flex items-center bg-transparent">
      {/* Spline Background */}
      <motion.div 
        className="absolute inset-0 w-full h-full z-0 cursor-move"
        style={{ y, opacity }}
      >
        <div className="absolute inset-y-0 right-0 w-full lg:w-3/4 h-full">
          <Spline scene="https://prod.spline.design/OaCLvzhQpnD3E-b6/scene.splinecode" />
        </div>
      </motion.div>

      {/* Hero Content */}
      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col justify-center h-full pt-10 pointer-events-none">
        <div className="max-w-3xl pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 1.0 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="glass px-4 py-2 rounded-full text-xs font-semibold tracking-wider text-purple-300 flex items-center gap-2 uppercase border border-purple-500/20 shadow-[0_0_20px_rgba(138,43,226,0.3)]">
              <Sparkles size={14} />
              AI-Powered Career Intelligence
            </div>
          </motion.div>

          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 1.1 }}
              className="font-serif font-medium leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}
            >
              We build <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-white">
                intelligent
              </span>{" "}
              futures
            </motion.h1>
          </div>

          <div className="overflow-hidden mb-10">
            <motion.p
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 1.2 }}
              className="text-gray-400 max-w-xl font-light leading-relaxed" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}
            >
              The first AI-powered system combining career guidance, global roadmap planning, and real-time opportunity tracking for students and professionals.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 1.3 }}
            className="flex flex-col sm:flex-row gap-5"
          >
            <button 
              onClick={handleGetStarted}
              className="group relative px-8 py-4 bg-white text-black font-semibold rounded-full overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-transform hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#e0e0e0] to-white z-0"></div>
            </button>
            <button className="px-8 py-4 glass text-white font-semibold rounded-full hover:bg-white/10 transition-all border border-white/20 hover:border-white/40">
              Explore Roadmap
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
