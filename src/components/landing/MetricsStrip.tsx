"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface MetricProps {
  numericValue: number;
  suffix: string;
  label: string;
  isVisible: boolean;
  color: string;
}

function AnimatedMetric({ numericValue, suffix, label, isVisible, color }: MetricProps) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = eased * numericValue;

      if (numericValue >= 1000000) {
        setDisplay((current / 1000000).toFixed(1));
      } else if (numericValue >= 1000) {
        setDisplay(Math.floor(current / 1000).toString());
      } else {
        setDisplay(Math.floor(current).toString());
      }

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isVisible, numericValue]);

  return (
    <div className="flex-1 flex flex-col items-center py-10 md:py-16">
      <div className="flex items-baseline gap-1 relative">
        <span 
          className="font-mono text-5xl md:text-[80px] font-bold tracking-tighter"
          style={{ color: color }}
        >
          {display}
        </span>
        <span 
          className="font-mono text-2xl md:text-3xl font-bold"
          style={{ color: color }}
        >
          {suffix}
        </span>
        
        {/* Hand-drawn accent squiggle for rhythm */}
        {(label.includes("accuracy") || label.includes("tracked")) && (
          <svg className="absolute -bottom-4 left-0 w-full h-4 overflow-visible" viewBox="0 0 100 20">
            <motion.path
              d="M 5,10 Q 50,2 95,10"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isVisible ? { pathLength: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </svg>
        )}
      </div>
      <span className="text-[13px] md:text-sm font-jakarta text-[#4A4A68] mt-6 text-center max-w-[120px] leading-snug">
        {label}
      </span>
    </div>
  );
}

const metrics = [
  { numericValue: 2400000, suffix: "M+", label: "signals tracked this week", color: "#F97316" },
  { numericValue: 340, suffix: "K", label: "salary data points", color: "#1A1A2E" },
  { numericValue: 98, suffix: "", label: "industries we watch", color: "#F97316" },
  { numericValue: 87, suffix: "%", label: "prediction accuracy", color: "#1A1A2E" },
];

export default function MetricsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative w-full bg-[#EDE9FE] py-4"
    >
      <div className="max-w-[1200px] mx-auto flex flex-wrap justify-between items-center px-6">
        {metrics.map((metric, i) => (
          <AnimatedMetric key={metric.label} {...metric} isVisible={isInView} />
        ))}
      </div>
    </section>
  );
}
