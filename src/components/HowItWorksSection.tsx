"use client";

import { motion } from "framer-motion";
import { UserCircle, Bot, Map, Rocket } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Submit Your Profile",
    icon: <UserCircle size={24} />,
    desc: "Enter your academics, skills, goals, target countries, and budget. The more context, the smarter the output.",
  },
  {
    id: 2,
    title: "AI Generates Roadmap",
    icon: <Bot size={24} />,
    desc: "Our intelligence engine maps your profile to optimal career paths, top universities, scholarships, and job markets globally.",
  },
  {
    id: 3,
    title: "Explore Opportunities",
    icon: <Map size={24} />,
    desc: "Browse curated university shortlists, scholarship matches with deadlines, and country-specific job market insights.",
  },
  {
    id: 4,
    title: "Execute & Track",
    icon: <Rocket size={24} />,
    desc: "Follow your personalized timeline — exam prep, applications, visa steps, and job search — with real-time milestone tracking.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="roadmap" className="py-32 relative overflow-hidden bg-transparent">
      <div className="container mx-auto px-6 md:px-12 relative z-10">

        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          >
            <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-4">
              System Workflow
            </p>
            <h2 className="font-serif font-medium text-white mb-6" style={{ fontSize: "clamp(1.75rem, 4vw, 3.5rem)" }}>
              The Intelligence Pipeline
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto font-light text-lg">
              Four steps from input to international career placement. Every step data-driven, every recommendation personalized.
            </p>
          </motion.div>
        </div>

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-start max-w-5xl mx-auto">

          {/* Connecting Line (Desktop) */}
          <div className="absolute top-8 md:top-8 left-[5%] w-[90%] h-[1px] bg-white/10 hidden md:block -translate-y-1/2">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 2, ease: [0.76, 0, 0.24, 1] }}
              className="w-full h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 origin-left"
            />
          </div>

          {/* Connecting Line (Mobile) */}
          <div className="absolute left-[2.25rem] top-0 bottom-0 w-[1px] bg-white/10 md:hidden block">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 2, ease: [0.76, 0, 0.24, 1] }}
              className="w-full h-full bg-gradient-to-b from-purple-500 via-blue-500 to-cyan-400 origin-top"
            />
          </div>

          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 + idx * 0.15 }}
              className="relative flex flex-row md:flex-col items-center md:items-start text-left md:text-center w-full mb-14 md:mb-0 group"
            >
              {/* Step Icon */}
              <div className="relative z-10 w-16 h-16 md:mx-auto rounded-full bg-[#050505] border-[2px] border-white/20 text-gray-400 flex items-center justify-center mb-0 md:mb-6 flex-shrink-0 group-hover:border-purple-400 group-hover:text-purple-400 group-hover:shadow-[0_0_25px_rgba(138,43,226,0.5)] transition-all duration-500 mr-6 md:mr-0">
                {step.icon}
                <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-white/10 text-white text-xs flex items-center justify-center font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  0{step.id}
                </div>
              </div>

              {/* Step Text */}
              <div className="md:px-2">
                <h3 className="text-lg font-medium text-white mb-2 font-serif group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-blue-300 transition-all">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed max-w-[220px] md:mx-auto">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
