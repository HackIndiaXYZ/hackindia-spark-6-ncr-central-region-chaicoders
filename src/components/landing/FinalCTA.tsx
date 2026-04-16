"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section className="relative bg-[#F97316] py-32 md:py-48 overflow-hidden">
      {/* Playful background texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="dotpattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dotpattern)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto px-6 text-center">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-8xl font-serif text-white tracking-tighter leading-none mb-10"
        >
          Ready to stop <br /> guessing?
        </motion.h2>
        
        <p className="text-xl md:text-2xl text-white/90 font-jakarta max-w-xl mx-auto mb-16 leading-relaxed">
          The job market isn&apos;t a mystery. It&apos;s a series of signals. Join 40,000 professionals who already know what the market is doing.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-12 py-5 bg-white text-[#F97316] text-lg font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            Start free
          </Link>
          <button
            className="w-full sm:w-auto px-12 py-5 border-2 border-white/40 text-white text-lg font-bold rounded-2xl hover:bg-white/10 hover:border-white transition-all"
          >
            See a live demo
          </button>
        </div>

        <div className="mt-12 flex justify-center items-center gap-2">
           <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 20 20">
             <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
           </svg>
           <span className="text-white/70 text-sm font-medium">Free forever, no card needed.</span>
        </div>
      </div>
    </section>
  );
}
