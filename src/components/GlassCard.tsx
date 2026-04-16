"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface GlassCardProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  category?: string;
  delay?: number;
}

/**
 * A ultra-premium glassmorphic card for high-end landing pages.
 */
export default function GlassCard({ 
  icon: Icon, 
  title, 
  description, 
  category, 
  delay = 0 
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className="group relative flex flex-col p-10 bg-white/[0.01] backdrop-blur-2xl border border-white/5 rounded-[2rem] overflow-hidden hover:bg-white/[0.03] transition-all duration-500"
    >
      {category && (
        <span className="text-[#C7966B] text-[10px] font-mono tracking-[0.5em] uppercase mb-10 block opacity-80">
          {category}
        </span>
      )}

      {Icon && (
        <div className="mb-10 w-fit">
          <Icon className="w-6 h-6 text-[#C7966B] opacity-80" />
        </div>
      )}

      <h3 className="text-2xl md:text-3xl font-semibold text-white/90 tracking-tight leading-tight mb-6">
        {title}
      </h3>

      <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-10 max-w-sm group-hover:text-gray-400 transition-colors">
        {description}
      </p>

      {/* Subtle Accent Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C7966B]/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000" />
    </motion.div>
  );
}
