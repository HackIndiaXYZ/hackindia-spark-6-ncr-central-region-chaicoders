"use client";

import { motion } from "framer-motion";
import { Zap, Globe2, GraduationCap, Briefcase } from "lucide-react";

const innovations = [
  {
    icon: <Zap className="w-6 h-6" />,
    stat: "3-in-1",
    label: "Career + Education + Jobs",
    desc: "The only platform combining career guidance, foreign education planning, and global job roadmaps into a single intelligence engine.",
  },
  {
    icon: <Globe2 className="w-6 h-6" />,
    stat: "190+",
    label: "Countries Covered",
    desc: "Country-specific guidance for universities, visa processes, job markets, and scholarships worldwide.",
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    stat: "End-to-End",
    label: "Student → Professional",
    desc: "Tracks your entire journey from student to international professional with personalized milestone tracking.",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    stat: "Real-time",
    label: "Live Opportunity Matching",
    desc: "Constantly updated scholarships, job openings, and visa policy changes matched precisely to your profile.",
  },
];

export default function SocialProofSection() {
  return (
    <section className="py-32 relative overflow-hidden bg-transparent border-t border-b border-white/[0.03]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-48 bg-[#8a2be2]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          >
            <p className="text-purple-400 text-sm font-medium tracking-widest uppercase mb-4">
              What Makes Us Different
            </p>
            <h2 className="font-serif font-medium mb-4" style={{ fontSize: "clamp(1.75rem, 4vw, 3.25rem)" }}>
              One platform for your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                entire global journey.
              </span>
            </h2>
            <p className="text-gray-400 font-light max-w-2xl mx-auto text-lg">
              No other system combines AI-powered career guidance with foreign education roadmaps and international job matching.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {innovations.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass rounded-2xl p-6 border border-white/5 hover:border-white/15 transition-all duration-500 group text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-gray-400 group-hover:text-purple-400 group-hover:border-purple-500/30 transition-all mb-4">
                {item.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-1 font-serif">{item.stat}</div>
              <div className="text-sm font-medium text-purple-300 mb-3">{item.label}</div>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
