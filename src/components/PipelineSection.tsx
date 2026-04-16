"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const PIPELINE_STEPS = [
  {
    title: "RESUME DIGESTION",
    count: "01",
    desc: "Our neural engine decomposes your history into a multi-dimensional skill vector.",
  },
  {
    title: "MARKET MAPPING",
    count: "02",
    desc: "Real-time cross-referencing against 5M+ active global job listings for fit analysis.",
  },
  {
    title: "VECTOR ALIGNMENT",
    count: "03",
    desc: "Mathematical skill-gap identification and prioritized learning trajectory generation.",
  },
  {
    title: "EXECUTION PLAN",
    count: "04",
    desc: "A validated 12-month career sprint roadmap tailored to your specific market data.",
  },
];

export default function PipelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const glowY = useTransform(scrollYProgress, [0, 1], ["-10%", "110%"]);

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[250vh] bg-transparent flex flex-col items-center py-40 overflow-hidden"
    >
      {/* Dynamic Background Glow - Accent on the track */}
      <motion.div 
        style={{ y: glowY }}
        className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#C7966B]/10 blur-[150px] rounded-full pointer-events-none"
      />

      {/* Sticky Header */}
      <div className="sticky top-40 z-10 w-full px-6 md:px-20 mb-60 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-[#C7966B] text-[10px] md:text-sm font-black tracking-[0.5em] uppercase mb-6"
        >
          Operational Intelligence Workflow
        </motion.p>
        <h2 className="text-white text-7xl md:text-[10vw] font-black uppercase tracking-tighter leading-none mb-10">
          THE <br /> PIPELINE
        </h2>
        <div className="flex justify-center">
          <div className="h-[1px] w-40 bg-white/20"></div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="absolute left-6 md:left-20 top-0 bottom-0 w-[1px] bg-white/5">
        <motion.div 
          style={{ 
            height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
            boxShadow: "0 0 30px rgba(199, 150, 107, 0.6)"
          }}
          className="w-full bg-[#C7966B]"
        />
      </div>

      {/* Pipeline Steps - Glass Cards */}
      <div className="flex flex-col gap-[40vh] w-full px-12 md:px-40 mt-40">
        {PIPELINE_STEPS.map((step, i) => (
          <PipelineStep key={step.count} step={step} index={i} />
        ))}
      </div>

      {/* Final Ghost Text */}
      <div className="absolute bottom-20 right-0 opacity-[0.03] select-none pointer-events-none">
        <span className="text-[30vw] font-black uppercase leading-none tracking-tighter text-white">
          PIPELINE
        </span>
      </div>
    </section>
  );
}

function PipelineStep({ step, index }: { step: any; index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-3xl flex flex-col gap-10 bg-white/[0.03] p-16 md:p-20 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
    >
      <span className="text-[#C7966B] text-4xl md:text-9xl font-black italic opacity-10 leading-none">
        {step.count}
      </span>
      <h3 className="text-white text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none -mt-4">
        {step.title}
      </h3>
      <p className="text-gray-400 text-lg md:text-2xl font-medium leading-relaxed max-w-xl">
        {step.desc}
      </p>
      <div className="w-32 h-[1px] bg-[#C7966B]/50 hover:w-48 transition-all duration-700"></div>
    </motion.div>
  );
}
