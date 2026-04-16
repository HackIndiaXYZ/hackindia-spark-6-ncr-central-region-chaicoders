"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* Salary trend SVG path (upward trending) */
function SalaryChart() {
  const pathRef = useRef<SVGPathElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDrawn(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <svg viewBox="0 0 280 100" className="w-full h-24">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4F6EF7" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4F6EF7" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Fill area */}
      <path
        d="M0,80 Q30,78 60,70 T120,58 T180,40 T240,25 T280,15 L280,100 L0,100 Z"
        fill="url(#chartGrad)"
        opacity={drawn ? 1 : 0}
        style={{ transition: "opacity 1s ease-out" }}
      />
      {/* Line */}
      <path
        ref={pathRef}
        d="M0,80 Q30,78 60,70 T120,58 T180,40 T240,25 T280,15"
        fill="none"
        stroke="#4F6EF7"
        strokeWidth="2.5"
        strokeLinecap="round"
        className={drawn ? "animate-draw-line" : ""}
        style={{
          strokeDasharray: 500,
          strokeDashoffset: drawn ? 0 : 500,
          transition: "stroke-dashoffset 2.5s ease-out",
        }}
      />
      {/* Data point */}
      {drawn && (
        <circle cx="280" cy="15" r="4" fill="#4F6EF7" className="animate-breathe" />
      )}
    </svg>
  );
}

/* Skill demand bars */
function SkillBars() {
  const skills = [
    { name: "AI/ML", value: 92, color: "#4F6EF7" },
    { name: "Cloud", value: 85, color: "#18C78A" },
    { name: "Data Eng.", value: 78, color: "#4F6EF7" },
    { name: "Product", value: 71, color: "#F5A623" },
    { name: "DevOps", value: 65, color: "#18C78A" },
  ];

  return (
    <div className="flex flex-col gap-2.5">
      {skills.map((skill, i) => (
        <div key={skill.name} className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#8B93A7] w-16 text-right">
            {skill.name}
          </span>
          <div className="flex-1 h-[6px] bg-[#0A1628] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${skill.value}%` }}
              transition={{ duration: 1.2, delay: 0.8 + i * 0.15, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: skill.color }}
            />
          </div>
          <span className="text-[10px] font-mono text-[#F4F5F7] w-8">{skill.value}%</span>
        </div>
      ))}
    </div>
  );
}

/* Animated incrementing number */
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };

    const timer = setTimeout(() => requestAnimationFrame(tick), 800);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <span className="font-mono font-bold text-[#F4F5F7]">
      {display.toLocaleString()}{suffix}
    </span>
  );
}

export default function HeroDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-md lg:max-w-lg"
    >
      {/* Main dashboard card */}
      <div className="relative bg-[#0F1D3A]/80 backdrop-blur-xl border border-[#1E2F5C]/60 rounded-2xl overflow-hidden shadow-2xl shadow-[#4F6EF7]/5">
        {/* Frosted top edge */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#4F6EF7]/30 to-transparent" />

        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#1E2F5C]/40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#18C78A] animate-live-pulse" />
            <span className="text-[10px] font-mono text-[#8B93A7] uppercase tracking-wider">
              Market Intelligence
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#4F6EF7]">LIVE</span>
        </div>

        {/* Profile strip */}
        <div className="px-5 py-3 border-b border-[#1E2F5C]/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1E2F5C] flex items-center justify-center">
              <span className="text-[10px] font-bold text-[#4F6EF7]">SP</span>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#F4F5F7]">
                Sr. Product Manager
              </p>
              <p className="text-[10px] text-[#8B93A7]">Tech · 7 yrs experience</p>
            </div>
            <div className="ml-auto">
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-[#18C78A]/10 text-[#18C78A] border border-[#18C78A]/20">
                Above Market
              </span>
            </div>
          </div>
        </div>

        {/* Salary trend panel */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B93A7]">
              Salary Trend
            </span>
            <span className="text-[10px] font-mono text-[#18C78A]">+12% QoQ ▲</span>
          </div>
          <SalaryChart />
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-[#8B93A7] font-mono">Q1 2025</span>
            <span className="text-[10px] text-[#8B93A7] font-mono">Q1 2026</span>
          </div>
        </div>

        {/* Skill demand index */}
        <div className="px-5 pt-3 pb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B93A7]">
              Skill Demand Index
            </span>
            <span className="text-[10px] font-mono text-[#F5A623]">High Demand ●</span>
          </div>
          <SkillBars />
        </div>

        {/* Bottom stats strip */}
        <div className="flex border-t border-[#1E2F5C]/40">
          <div className="flex-1 py-3 px-4 text-center border-r border-[#1E2F5C]/40">
            <div className="text-[16px]"><AnimatedNumber value={94} suffix="%" /></div>
            <span className="text-[8px] text-[#8B93A7] font-mono uppercase tracking-wider">
              Match Rate
            </span>
          </div>
          <div className="flex-1 py-3 px-4 text-center border-r border-[#1E2F5C]/40">
            <div className="text-[16px]"><AnimatedNumber value={340} suffix="K" /></div>
            <span className="text-[8px] text-[#8B93A7] font-mono uppercase tracking-wider">
              Data Points
            </span>
          </div>
          <div className="flex-1 py-3 px-4 text-center">
            <div className="text-[16px]"><AnimatedNumber value={87} suffix="%" /></div>
            <span className="text-[8px] text-[#8B93A7] font-mono uppercase tracking-wider">
              Accuracy
            </span>
          </div>
        </div>
      </div>

      {/* Floating data badge */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute -top-3 -right-3 bg-[#18C78A]/10 backdrop-blur-md border border-[#18C78A]/20 rounded-lg px-3 py-1.5 animate-float"
      >
        <span className="text-[11px] font-mono font-semibold text-[#18C78A]">
          +12% QoQ
        </span>
      </motion.div>
    </motion.div>
  );
}
