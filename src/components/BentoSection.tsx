"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  Target, 
  Microscope, 
  MapPin, 
  Search, 
  Cpu, 
  Globe, 
  Workflow 
} from "lucide-react";

const bentoItems = [
  {
    title: "AI Resonator",
    description: "Deep-tissue skill extraction from legacy PDF structures using proprietary neural patterns.",
    icon: <Cpu className="w-6 h-6 text-cyan-400" />,
    className: "md:col-span-2 md:row-span-2 bg-gradient-to-br from-cyan-950/40 to-black/80",
    illustration: (
      <div className="absolute right-0 bottom-0 w-32 h-32 opacity-20 pointer-events-none overflow-hidden">
        <div className="grid grid-cols-4 gap-1 p-2">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0.1 }}
              animate={{ opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              className="w-full h-2 bg-cyan-400 rounded-sm"
            />
          ))}
        </div>
      </div>
    )
  },
  {
    title: "Vector Pipeline",
    description: "Projecting career data into 512-D mathematical clusters.",
    icon: <Workflow className="w-6 h-6 text-purple-400" />,
    className: "md:col-span-1 md:row-span-1 bg-neutral-900/40"
  },
  {
    title: "Global Mesh",
    description: "Real-time tracking of 50M+ job vacancies across the planet.",
    icon: <Globe className="w-6 h-6 text-emerald-400" />,
    className: "md:col-span-1 md:row-span-1 bg-neutral-900/40"
  },
  {
    title: "Strategic Maps",
    description: "12-month adaptive career velocity planners with precision-aimed targets.",
    icon: <Target className="w-6 h-6 text-rose-400" />,
    className: "md:col-span-2 md:row-span-1 bg-gradient-to-r from-neutral-900/60 to-rose-950/20"
  }
];

export default function BentoSection() {
  return (
    <section className="py-24 px-6 md:px-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col gap-4"
        >
          <span className="text-cyan-500 font-mono text-[10px] tracking-[0.5em] uppercase">SYSTEM_CAPABILITIES_01</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter">
            INTELLIGENT <span className="text-glow">INFRASTRUCTURE</span>
          </h2>
          <div className="w-24 h-1 bg-cyan-500/50"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px]">
          {bentoItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`group relative p-8 glass-dark rounded-[2rem] border border-white/5 hover:border-cyan-500/30 transition-all duration-500 overflow-hidden ${item.className}`}
            >
              <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                <div className="flex flex-col gap-4">
                  <div className="p-3 w-fit rounded-2xl bg-white/5 border border-white/10 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20 transition-colors duration-500">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-glow transition-all duration-500">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-[280px]">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-600 tracking-widest group-hover:text-cyan-500/50 transition-colors duration-500">
                  <span className="w-8 h-[1px] bg-gray-800 group-hover:bg-cyan-500/30"></span>
                  L_ACTIVE_MDL_00{idx+1}
                </div>
              </div>
              
              {/* Illustration Background */}
              {item.illustration}

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-cyan-500/0 group-hover:via-cyan-500/5 transition-all duration-700 pointer-events-none"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
