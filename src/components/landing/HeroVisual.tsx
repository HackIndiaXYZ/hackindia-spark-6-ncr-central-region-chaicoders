"use client";

import { motion } from "framer-motion";

export default function HeroVisual() {
  return (
    <div className="relative w-full aspect-square md:aspect-[4/3] flex items-center justify-center pointer-events-none select-none">
      {/* Decorative squiggle background */}
      <svg className="absolute w-full h-full opacity-10" viewBox="0 0 500 500">
        <motion.path
          d="M 50,250 Q 150,150 250,250 T 450,250"
          fill="none"
          stroke="#F97316"
          strokeWidth="4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.path
          d="M 100,400 Q 250,300 400,400"
          fill="none"
          stroke="#A78BFA"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
        />
      </svg>

      {/* Hero Central Element */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: -2 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 bg-white hand-drawn-border p-12 shadow-2xl flex flex-col items-center justify-center transform rotate-[-2deg]"
      >
        <span className="text-[#84CC16] font-mono text-sm font-bold tracking-widest uppercase mb-4">
          LIVE SIGNAL
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-[80px] md:text-[100px] font-mono font-bold text-[#1A1A2E] leading-none">
            ₹18.4L
          </span>
        </div>
        <p className="text-[#4A4A68] text-lg text-center mt-4 font-jakarta font-medium">
          avg salary offer for <br /> <span className="text-[#F97316]">Senior PM roles</span> this quarter
        </p>

        {/* Floating Data Chips */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-6 -right-12 bg-[#38BDF8] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg"
        >
          +14% Demand
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 -left-16 bg-[#A78BFA] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg transform rotate-6"
        >
          High Mobility
        </motion.div>
      </motion.div>
    </div>
  );
}
