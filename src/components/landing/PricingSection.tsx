"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";

interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  color: string;
  highlighted: boolean;
  tag?: string;
}

const plans: Plan[] = [
  {
    name: "Market Observer",
    price: "$0",
    description: "Start observing the signals without spending a dime.",
    features: [
      "3 signal reports/month",
      "Salary benchmarks",
      "Market trend overview",
      "Community access"
    ],
    cta: "Show me the data",
    color: "#A78BFA", // Violet
    highlighted: false
  },
  {
    name: "Intelligence Analyst",
    price: "$29",
    description: "For professionals who play the long game and want precision.",
    features: [
      "Unlimited real-time signals",
      "Demand forecasting",
      "AI Path Mapping",
      "Opportunity Alerts",
      "Priority priority briefs"
    ],
    cta: "Go Pro",
    color: "#84CC16", // Lime green
    highlighted: true,
    tag: "Most popular"
  },
  {
    name: "For teams",
    price: "Custom",
    description: "White-label intelligence for organizations and recruiters.",
    features: [
      "Custom API access",
      "Collaborative dashboards",
      "Bulk profile analysis",
      "Dedicated strategist",
      "SLA & Compliance"
    ],
    cta: "Contact our team",
    color: "#F97316", // Orange
    highlighted: false
  }
];

function PricingCard({ plan, index }: { plan: Plan; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div 
      className={`relative flex flex-col p-10 bg-white shadow-xl shadow-black/5 rounded-2xl border-t-[12px] transition-all duration-500 hover:shadow-2xl ${plan.highlighted ? 'scale-105 z-10 md:mt-[-20px]' : ''}`}
      style={{ borderTopColor: plan.color }}
    >
      {/* Hand-drawn style tag */}
      {plan.tag && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 transform -rotate-3">
          <span className="bg-[#84CC16] text-[#1A1A2E] text-xs font-mono font-bold px-4 py-1.5 rounded-full shadow-lg">
            {plan.tag.toUpperCase()}
          </span>
        </div>
      )}

      <h3 className="text-2xl font-serif text-[#1A1A2E] mb-2">{plan.name}</h3>
      <p className="text-sm text-[#4A4A68] mb-8 leading-relaxed">{plan.description}</p>
      
      <div className="mb-10">
        <span className="text-5xl font-mono font-bold text-[#1A1A2E] tracking-tighter">{plan.price}</span>
        {plan.price !== 'Custom' && <span className="text-[#4A4A68] font-mono text-sm ml-1">/mo</span>}
      </div>

      <ul className="flex flex-col gap-4 mb-12 flex-1">
        {plan.features.map(f => (
          <li key={f} className="flex items-start gap-3">
            <div className="mt-1 w-5 h-5 rounded-full bg-[#84CC16]/10 flex items-center justify-center shrink-0">
               <Check className="w-3 h-3 text-[#84CC16]" />
            </div>
            <span className="text-sm font-jakarta text-[#4A4A68]">{f}</span>
          </li>
        ))}
      </ul>

      <button 
        style={{ backgroundColor: plan.color }}
        className="text-white text-base font-bold py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
      >
        {plan.cta}
      </button>
    </div>
  );
}

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-28 md:py-40 bg-white">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-serif text-[#1A1A2E] tracking-tight">
            Pick what works <br className="hidden md:block" /> for you.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-stretch">
          {plans.map((p, i) => (
             <PricingCard key={p.name} plan={p} index={i} />
          ))}
        </div>
        
        <div className="mt-16 text-center">
           <p className="text-[#4A4A68] text-sm font-medium">Not sure which one? <a href="#" className="text-[#F97316] font-bold orange-underline">Talk to our career lead</a></p>
        </div>
      </div>
    </section>
  );
}
