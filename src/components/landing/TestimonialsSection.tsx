"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    quote: "I negotiated 30% more because I knew exactly what the market was paying. CareerIQ told me before I even asked.",
    name: "Priya S.",
    role: "Senior Product Manager",
    company: "Google",
    feature: "Salary Intelligence",
    color: "#F97316"
  },
  {
    quote: "The skill forecasting predicted the GenAI wave months early. I retooled before my company even knew they needed it.",
    name: "Marcus K.",
    role: "Engineering Director",
    company: "Stripe",
    feature: "Demand Forecasting",
    color: "#84CC16"
  }
];

const logos = ["Google", "Stripe", "McKinsey", "Meta", "Amazon", "Gooldman Sachs", "Netflix", "JPMorgan"];

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="relative py-28 md:py-40 bg-[#FAFAF7]">
      <div className="max-w-[1000px] mx-auto px-6 text-center">
        {/* Section Header */}
        <div className="mb-20">
          <span className="text-[#F97316] font-mono text-[11px] font-bold uppercase tracking-[0.12em] mb-4 block">
            PEOPLE MAKING MOVES
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#1A1A2E] tracking-tight">
            From the professionals <br className="hidden md:block" /> making the real data-driven moves.
          </h2>
        </div>

        {/* Big Serif Quotes */}
        <div className="flex flex-col gap-24">
          {testimonials.map((t, i) => (
            <motion.div 
               key={t.name}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: i * 0.1 }}
               className="group"
            >
               <h3 className="text-3xl md:text-5xl font-serif text-[#1A1A2E] leading-snug mb-10 text-center max-w-4xl mx-auto">
                 &ldquo;{t.quote}&rdquo;
               </h3>
               
               <div className="flex flex-col items-center gap-6">
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-full border-2 border-black/10 flex items-center justify-center bg-white shadow-sm">
                      <span className="text-[#1A1A2E] font-bold text-base">{t.name.split('')[0]}</span>
                   </div>
                   <div className="text-left">
                      <p className="font-bold text-[#1A1A2E] text-base">{t.name}</p>
                      <p className="text-[#4A4A68] text-sm">{t.role} @ {t.company}</p>
                   </div>
                 </div>

                 {/* Feature Data Chip */}
                 <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-black/5 shadow-sm transform group-hover:rotate-1 transition-transform">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                    <span className="text-[12px] font-mono font-bold text-[#1A1A2E]">
                      Used: {t.feature}
                    </span>
                 </div>
               </div>
            </motion.div>
          ))}
        </div>

        {/* Ticker Logos */}
        <div className="mt-32 pt-20 border-t border-black/5 relative overflow-hidden">
          <div className="flex animate-scroll-x gap-24 whitespace-nowrap overflow-visible">
            {[...logos, ...logos].map((logo, i) => (
              <span key={i} className="text-[#1A1A2E]/30 font-bold text-xl uppercase tracking-widest leading-none">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
