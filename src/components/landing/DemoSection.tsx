"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const roles = ["Product Manager", "Software Engineer", "Data Scientist", "UX Designer"];
const industries = ["Tech", "Finance", "Healthcare", "Consulting"];
const locations = ["San Francisco", "New York", "London", "Singapore"];

function MiniChart({ color = "#4F6EF7", trend = "up" }: { color?: string; trend?: string }) {
  const path =
    trend === "up"
      ? "M0,35 Q15,33 30,30 T60,22 T90,15 T120,10"
      : "M0,15 Q15,18 30,22 T60,28 T90,32 T120,35";

  return (
    <svg viewBox="0 0 120 45" className="w-full h-8">
      <defs>
        <linearGradient id={`dg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${path} L120,45 L0,45 Z`}
        fill={`url(#dg-${color})`}
      />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function DemoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedRole, setSelectedRole] = useState(0);
  const [selectedIndustry, setSelectedIndustry] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(0);

  const salaryData: Record<string, string> = {
    "0-0-0": "$195K",
    "0-1-0": "$185K",
    "1-0-0": "$210K",
    "1-0-1": "$198K",
    "2-0-0": "$205K",
    "3-0-0": "$165K",
  };

  const key = `${selectedRole}-${selectedIndustry}-${selectedLocation}`;
  const salary = salaryData[key] || "$188K";

  return (
    <section id="demo" className="relative py-28 md:py-36 bg-[#060D1A]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-label block mb-4">Live Demo</span>
          <h2 className="text-3xl md:text-[48px] font-bold text-[#F4F5F7] tracking-tight">
            See the intelligence in action.
          </h2>
        </div>

        {/* Interactive dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-[#0A1628] border border-[#1E2F5C] rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Left sidebar */}
            <div className="lg:w-64 border-b lg:border-b-0 lg:border-r border-[#1E2F5C] p-5 bg-[#0D1A30]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#18C78A] animate-live-pulse" />
                <span className="text-[10px] font-mono text-[#8B93A7] uppercase tracking-wider">
                  Career Profile
                </span>
              </div>

              {/* Role selector */}
              <div className="mb-5">
                <span className="text-[10px] font-mono text-[#4F6EF7] uppercase tracking-wider block mb-2">
                  Role
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {roles.map((role, i) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(i)}
                      className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-all duration-200 ${
                        selectedRole === i
                          ? "bg-[#4F6EF7] text-white"
                          : "bg-[#1E2F5C]/40 text-[#8B93A7] hover:text-[#F4F5F7]"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Industry selector */}
              <div className="mb-5">
                <span className="text-[10px] font-mono text-[#4F6EF7] uppercase tracking-wider block mb-2">
                  Industry
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {industries.map((ind, i) => (
                    <button
                      key={ind}
                      onClick={() => setSelectedIndustry(i)}
                      className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-all duration-200 ${
                        selectedIndustry === i
                          ? "bg-[#4F6EF7] text-white"
                          : "bg-[#1E2F5C]/40 text-[#8B93A7] hover:text-[#F4F5F7]"
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location selector */}
              <div>
                <span className="text-[10px] font-mono text-[#4F6EF7] uppercase tracking-wider block mb-2">
                  Location
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {locations.map((loc, i) => (
                    <button
                      key={loc}
                      onClick={() => setSelectedLocation(i)}
                      className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-all duration-200 ${
                        selectedLocation === i
                          ? "bg-[#4F6EF7] text-white"
                          : "bg-[#1E2F5C]/40 text-[#8B93A7] hover:text-[#F4F5F7]"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Center panel — salary trend */}
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#8B93A7] uppercase tracking-wider">
                    Median Salary — {roles[selectedRole]}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-mono font-bold text-[#F4F5F7]">
                      {salary}
                    </span>
                    <span className="text-[12px] font-mono text-[#18C78A]">+8.2% YoY ▲</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {["1Y", "3Y", "5Y"].map((period, i) => (
                    <button
                      key={period}
                      className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        i === 0
                          ? "bg-[#4F6EF7]/20 text-[#4F6EF7]"
                          : "text-[#8B93A7] hover:text-[#F4F5F7]"
                      } transition-colors`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart area */}
              <div className="rounded-lg bg-[#0D1A30] border border-[#1E2F5C]/40 p-4">
                <svg viewBox="0 0 500 160" className="w-full h-40">
                  <defs>
                    <linearGradient id="demoChartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F6EF7" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#4F6EF7" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  {[0, 40, 80, 120, 160].map((y) => (
                    <line
                      key={y}
                      x1="0" y1={y} x2="500" y2={y}
                      stroke="#1E2F5C"
                      strokeWidth="0.5"
                      strokeDasharray="4 4"
                    />
                  ))}
                  {/* Area fill */}
                  <path
                    d="M0,130 Q50,125 100,115 T200,95 T300,70 T400,45 T500,25 L500,160 L0,160 Z"
                    fill="url(#demoChartFill)"
                  />
                  {/* Line */}
                  <path
                    d="M0,130 Q50,125 100,115 T200,95 T300,70 T400,45 T500,25"
                    fill="none"
                    stroke="#4F6EF7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Data point at end */}
                  <circle cx="500" cy="25" r="4" fill="#4F6EF7" />
                  <circle cx="500" cy="25" r="8" fill="#4F6EF7" opacity="0.2" className="animate-breathe" />
                </svg>
                {/* X-axis labels */}
                <div className="flex justify-between mt-2 px-1">
                  {["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map((m) => (
                    <span key={m} className="text-[9px] font-mono text-[#8B93A7]">{m}</span>
                  ))}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mt-5">
                {[
                  { label: "25th Pctl", value: "$162K", color: "#8B93A7" },
                  { label: "Median", value: salary, color: "#4F6EF7" },
                  { label: "75th Pctl", value: "$228K", color: "#18C78A" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#0D1A30] border border-[#1E2F5C]/40 rounded-lg p-3 text-center">
                    <span className="text-[9px] font-mono text-[#8B93A7] uppercase tracking-wider block mb-1">
                      {stat.label}
                    </span>
                    <span className="text-lg font-mono font-bold" style={{ color: stat.color }}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right panel — skill demand */}
            <div className="lg:w-56 border-t lg:border-t-0 lg:border-l border-[#1E2F5C] p-5 bg-[#0D1A30]">
              <span className="text-[10px] font-mono text-[#8B93A7] uppercase tracking-wider block mb-4">
                Trending Skills
              </span>

              {[
                { name: "GenAI", change: "+34%", trend: "up", color: "#18C78A" },
                { name: "Product Analytics", change: "+22%", trend: "up", color: "#18C78A" },
                { name: "Systems Design", change: "+18%", trend: "up", color: "#4F6EF7" },
                { name: "Agile/Scrum", change: "-5%", trend: "down", color: "#E84040" },
              ].map((skill) => (
                <div key={skill.name} className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-[#F4F5F7] font-medium">{skill.name}</span>
                    <span
                      className="text-[11px] font-mono font-semibold"
                      style={{ color: skill.color }}
                    >
                      {skill.change}
                    </span>
                  </div>
                  <MiniChart color={skill.color} trend={skill.trend} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#4F6EF7] text-white text-sm font-semibold rounded-full hover:bg-[#3B5CE5] transition-all duration-300"
          >
            Try it live
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
