"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    title: "Your market rate just changed. Here's by how much.",
    description: "We don't do static reports. CareerIQ tracks real-time salary shifts across 340K data points, so you never have to guess your worth during that mid-year review.",
    pullQuote: "Average increase for Cloud Engineers in London: +12.4%",
    accent: "#38BDF8", // Sky blue
    layout: "left",
    visual: (
      <div className="w-full h-[400px] bg-[#38BDF8] rounded-3xl flex items-center justify-center p-8 relative overflow-hidden group">
        <motion.div 
           whileHover={{ scale: 1.05, rotate: 2 }}
           className="bg-white p-6 hand-drawn-border shadow-xl transform group-hover:shadow-2xl transition-all"
        >
           <h4 className="font-mono text-xs text-[#38BDF8] font-bold tracking-widest mb-2 uppercase">SALARY SIGNAL</h4>
           <div className="text-4xl font-mono text-[#1A1A2E] mb-2">$142,000</div>
           <div className="text-sm font-jakarta text-[#84CC16] font-bold">+8% Above Market</div>
        </motion.div>
        
        {/* Playful background circles */}
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-white/20 blur-2xl" />
      </div>
    )
  },
  {
    title: "Market Demand Forecasting",
    description: "Most people find out their skills are outdated after the layoff. We tell you six months before. Our models identify rising skill requirements before the market corrects.",
    pullQuote: "Rising demand: GenAI Orchestration, Vector DBs, Human-in-loop Design.",
    accent: "#F97316", // Orange
    layout: "right",
    visual: (
      <div className="w-full h-[400px] bg-[#F97316] rounded-3xl flex items-center justify-center p-8 relative overflow-hidden group">
        <div className="w-full flex flex-col gap-3">
          {[
            { label: "GenAI", value: 95, color: "white" },
            { label: "Vector DB", value: 82, color: "white" },
            { label: "Rust", value: 74, color: "white" }
          ].map((item, i) => (
             <motion.div 
               key={item.label}
               initial={{ width: 0 }}
               whileInView={{ width: "100%" }}
               transition={{ duration: 1, delay: i * 0.2 }}
               className="flex flex-col gap-1"
             >
               <span className="text-white text-xs font-mono font-bold">{item.label}</span>
               <div className="h-8 bg-white/20 rounded-lg flex items-center px-4">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.value}%` }}
                    className="h-2 bg-white rounded-full"
                  />
               </div>
             </motion.div>
          ))}
        </div>
      </div>
    )
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-28 md:py-40 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="mb-24">
          <span className="text-[#A78BFA] font-mono text-[11px] font-bold uppercase tracking-[0.12em] mb-4 block">
            THE ENGINE IN ACTION
          </span>
          <h2 className="text-5xl md:text-7xl font-serif text-[#1A1A2E] leading-tight tracking-tight">
            Here&apos;s what we <br /> actually built.
          </h2>
        </div>

        {/* Dynamic Features Rows */}
        <div className="flex flex-col gap-32 md:gap-48">
          {features.map((feature, i) => (
            <div key={feature.title} className={`flex flex-col lg:flex-row gap-16 items-center ${feature.layout === 'right' ? 'lg:flex-row-reverse' : ''}`}>
              {/* Visual Panel */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex-1 w-full"
              >
                {feature.visual}
              </motion.div>

              {/* Text Context */}
              <div className="flex-1 max-w-xl">
                <h3 className="text-3xl md:text-4xl font-serif text-[#1A1A2E] mb-6 leading-snug">
                  {feature.title}
                </h3>
                <p className="text-lg text-[#4A4A68] leading-relaxed mb-8">
                  {feature.description}
                </p>
                <div className="flex items-start gap-4">
                  <div className="w-1 h-20 bg-[#F97316] shrink-0" />
                  <p className="text-xl font-serif italic text-[#1A1A2E] py-2">
                    &ldquo;{feature.pullQuote}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Editorial Callout */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
          className="mt-40 bg-[#EDE9FE] rounded-[3rem] p-12 md:p-24 text-center transform rotate-1"
        >
           <h3 className="text-3xl md:text-5xl font-serif text-[#1A1A2E] leading-tight mb-8">
             &ldquo;Most people find out their skills are outdated after the layoff. <br className="hidden md:block" /> We tell you six months before.&rdquo;
           </h3>
           <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse" />
              <span className="text-sm font-mono font-bold text-[#1A1A2E]">LIVE PREDICTION FEED: ACTIVE</span>
           </div>
        </motion.div>

        {/* Small Footnote Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-40">
           <div className="bg-[#FAFAF7] p-10 rounded-2xl border border-[#EDE9FE]">
              <span className="text-[#A78BFA] font-mono text-[11px] font-bold uppercase mb-4 block">EXTRA SIGNAL</span>
              <h4 className="text-2xl font-serif text-[#1A1A2E] mb-4">Career Path Mapping</h4>
              <p className="text-[#4A4A68] leading-relaxed">AI-generated paths showing you what moves actually lead to the next tier of compensation.</p>
           </div>
           <div className="bg-[#FAFAF7] p-10 rounded-2xl border border-[#EDE9FE]">
              <span className="text-[#F97316] font-mono text-[11px] font-bold uppercase mb-4 block">EXTRA SIGNAL</span>
              <h4 className="text-2xl font-serif text-[#1A1A2E] mb-4">Opportunity Alerts</h4>
              <p className="text-[#4A4A68] leading-relaxed">Signals that trigger only when the market aligns with your specific career profile.</p>
           </div>
        </div>
      </div>
    </section>
  );
}
