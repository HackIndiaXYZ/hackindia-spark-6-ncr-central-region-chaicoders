"use client";

import { motion, Variants } from "framer-motion";
import {
  BrainCircuit,
  Sparkles,
  GraduationCap,
  Globe2,
  Briefcase,
  FileText,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

/* ─── Core Features from the project doc ─── */
const coreFeatures = [
  {
    icon: <BrainCircuit size={22} />,
    label: "AI Career Engine",
    color: "purple",
  },
  {
    icon: <FileText size={22} />,
    label: "Resume Builder",
    color: "blue",
  },
  {
    icon: <TrendingUp size={22} />,
    label: "Skill Gap Analysis",
    color: "purple",
  },
  {
    icon: <Briefcase size={22} />,
    label: "Job Tracking",
    color: "pink",
  },
  {
    icon: <ShieldCheck size={22} />,
    label: "Rejection Analysis",
    color: "amber",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: [0.76, 0, 0.24, 1], duration: 1 },
  },
};

const colorMap: Record<string, { border: string; text: string; glow: string }> = {
  purple: { border: "border-purple-500/30", text: "text-purple-400", glow: "shadow-[0_0_20px_rgba(138,43,226,0.25)]" },
  blue: { border: "border-blue-500/30", text: "text-blue-400", glow: "shadow-[0_0_20px_rgba(59,130,246,0.25)]" },
  cyan: { border: "border-cyan-400/30", text: "text-cyan-400", glow: "shadow-[0_0_20px_rgba(34,211,238,0.25)]" },
  pink: { border: "border-pink-400/30", text: "text-pink-400", glow: "shadow-[0_0_20px_rgba(244,114,182,0.25)]" },
  amber: { border: "border-amber-400/30", text: "text-amber-400", glow: "shadow-[0_0_20px_rgba(251,191,36,0.25)]" },
};

export default function RoadmapVisualization() {
  return (
    <section className="py-32 relative overflow-hidden bg-transparent">
      {/* Background atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">

        {/* ───────── SECTION 1: AI Processing Core Diagram ───────── */}
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="text-center mb-20"
          >
            <p className="text-purple-400 text-sm font-medium tracking-widest uppercase mb-4">
              Intelligence Architecture
            </p>
            <h2 className="font-serif font-medium mb-6" style={{ fontSize: "clamp(1.75rem, 4vw, 3.5rem)" }}>
              Your profile enters. <br />
              <span className="text-gray-500">A global roadmap exits.</span>
            </h2>
          </motion.div>

          {/* 3-column → Input → Engine → Output */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-0 items-center max-w-5xl mx-auto">

            {/* Left: Input */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="glass rounded-2xl p-8 border border-white/10"
            >
              <h3 className="font-serif text-xl text-white mb-5">What you provide</h3>
              <ul className="space-y-3">
                {["Academic background & transcripts", "Skills, interests & ambitions", "Target countries & dream roles", "Budget & financial context"].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                    className="flex items-center gap-3 text-gray-400 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Center: AI Core */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
              className="flex flex-col items-center justify-center relative mx-4 md:mx-12 py-8"
            >
              <div className="relative flex items-center justify-center">
                {/* Pulsing rings */}
                {[1, 2, 3].map((ring) => (
                  <motion.div
                    key={ring}
                    animate={{ scale: [1, 1.8 + ring * 0.3], opacity: [0.4, 0] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: ring * 0.5,
                      ease: "easeOut",
                    }}
                    className="absolute w-full h-full rounded-full border border-purple-500/40 pointer-events-none"
                  />
                ))}

                <div className="w-24 h-24 rounded-full glass flex items-center justify-center border border-purple-500/40 relative z-10 shadow-[0_0_40px_rgba(138,43,226,0.4)] bg-[#0a0a0a]">
                  <BrainCircuit className="text-purple-400" size={36} />
                  <Sparkles className="absolute -top-1 -right-1 text-purple-300 animate-pulse" size={14} />
                </div>
              </div>
              <p className="text-xs text-purple-300/70 mt-4 tracking-wider uppercase font-medium">AI Core</p>

              {/* Connecting arrows on desktop */}
              <div className="hidden md:block absolute left-0 top-1/2 -translate-x-full -translate-y-1/2">
                <div className="w-12 h-[1px] bg-gradient-to-r from-white/5 to-purple-500/50" />
              </div>
              <div className="hidden md:block absolute right-0 top-1/2 translate-x-full -translate-y-1/2 rotate-180">
                <div className="w-12 h-[1px] bg-gradient-to-r from-white/5 to-blue-400/50" />
              </div>
            </motion.div>

            {/* Right: Output */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.4 }}
              className="glass rounded-2xl p-8 border border-white/10"
            >
              <h3 className="font-serif text-xl text-white mb-5">What you receive</h3>
              <ul className="space-y-3">
                {["Personalized career roadmap", "University shortlist & admit strategy", "Scholarship matches & deadlines", "Visa process timeline", "Global job market analysis"].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                    className="flex items-center gap-3 text-gray-400 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* ───────── SECTION 2: Core Features Bento ───────── */}
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="text-center mb-16"
          >
            <p className="text-purple-400 text-sm font-medium tracking-widest uppercase mb-4">
              Core Capabilities
            </p>
            <h2 className="font-serif font-medium" style={{ fontSize: "clamp(1.75rem, 4vw, 3.5rem)" }}>
              Five engines. <span className="text-gray-500">One platform.</span>
            </h2>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {coreFeatures.map((f) => {
              const c = colorMap[f.color];
              return (
                <motion.div
                  key={f.label}
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className={`glass px-6 py-4 rounded-2xl border ${c.border} flex items-center gap-3 group hover:${c.glow} transition-all duration-300`}
                >
                  <div className={`${c.text} group-hover:scale-110 transition-transform`}>
                    {f.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    {f.label}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* ───────── SECTION 3: Three Pillars – University / Scholarships / Job Market ───────── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="text-center mb-16"
          >
            <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-4">
              Global Reach
            </p>
            <h2 className="font-serif font-medium" style={{ fontSize: "clamp(1.75rem, 4vw, 3.5rem)" }}>
              From student to <span className="text-gray-500">international professional.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

            {/* Pillar 1: University Roadmap */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.15 } }}
              className="glass rounded-3xl p-8 border border-white/5 hover:border-purple-500/20 transition-all duration-200 group relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-2xl group-hover:blur-xl transition-all duration-200" />
              <div className="mb-6 p-4 rounded-2xl bg-white/5 inline-block border border-white/10 group-hover:scale-110 transition-transform duration-200">
                <GraduationCap size={28} className="text-purple-400" />
              </div>
              <h3 className="font-serif text-xl text-white mb-4">University Roadmap</h3>
              <ul className="space-y-2.5 text-sm text-gray-400 font-light">
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-purple-500 mt-2 flex-shrink-0" />Country-specific guidance (USA, UK, Germany, etc.)</li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-purple-500 mt-2 flex-shrink-0" />Step-by-step exam roadmap: SAT, GRE, IELTS</li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-purple-500 mt-2 flex-shrink-0" />Smart university shortlisting by profile strength</li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-purple-500 mt-2 flex-shrink-0" />SOP, LOR & application guidance</li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-purple-500 mt-2 flex-shrink-0" />Visa process & timeline tracking</li>
              </ul>
            </motion.div>

            {/* Pillar 2: Scholarship & Financial Aid */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.25 }}
              whileHover={{ y: -8, transition: { duration: 0.15 } }}
              className="glass rounded-3xl p-8 border border-white/5 hover:border-purple-400/20 transition-all duration-200 group relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-bl from-purple-400/10 to-transparent rounded-full blur-2xl group-hover:blur-xl transition-all duration-200" />
              <div className="mb-6 p-4 rounded-2xl bg-white/5 inline-block border border-white/10 group-hover:scale-110 transition-transform duration-200">
                <Sparkles size={28} className="text-purple-400" />
              </div>
              <h3 className="font-serif text-xl text-white mb-4">Scholarship Finder</h3>
              <ul className="space-y-2.5 text-sm text-gray-400 font-light">
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-purple-400 mt-2 flex-shrink-0" />Scholarships filtered by eligibility & country</li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-purple-400 mt-2 flex-shrink-0" />Real-time deadline tracking & reminders</li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-purple-400 mt-2 flex-shrink-0" />Fully funded & partial funding suggestions</li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-purple-400 mt-2 flex-shrink-0" />Strategy optimization for acceptance</li>
              </ul>
            </motion.div>

            {/* Pillar 3: Job Market Roadmap */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.4 }}
              whileHover={{ y: -8, transition: { duration: 0.15 } }}
              className="glass rounded-3xl p-8 border border-white/5 hover:border-blue-400/20 transition-all duration-200 group relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full blur-2xl group-hover:blur-xl transition-all duration-200" />
              <div className="mb-6 p-4 rounded-2xl bg-white/5 inline-block border border-white/10 group-hover:scale-110 transition-transform duration-200">
                <Globe2 size={28} className="text-blue-400" />
              </div>
              <h3 className="font-serif text-xl text-white mb-4">Global Job Market</h3>
              <ul className="space-y-2.5 text-sm text-gray-400 font-light">
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-blue-400 mt-2 flex-shrink-0" />Country-wise job market insights & salary data</li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-blue-400 mt-2 flex-shrink-0" />Work visa pathways & requirements</li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-blue-400 mt-2 flex-shrink-0" />Post-study work opportunities</li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-blue-400 mt-2 flex-shrink-0" />Skill mapping to international job requirements</li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-blue-400 mt-2 flex-shrink-0" />Profile building for global companies</li>
              </ul>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
