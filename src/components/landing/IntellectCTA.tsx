"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const IntellectCTA = () => {
  const router = useRouter();

  return (
    <section className="relative py-40 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-foreground/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-8xl text-foreground mb-12"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Ready to chart <br />
          your <em className="not-italic text-muted-foreground">new path?</em>
        </motion.h2>
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1, delay: 0.2 }}
           className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <button 
            onClick={() => router.push("/signup")}
            className="liquid-glass rounded-full px-12 py-5 text-lg text-foreground hover:scale-[1.03] transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            Begin Journey
          </button>
          <button 
            onClick={() => router.push("/dashboard/roadmaps")}
            className="rounded-full px-12 py-5 text-lg text-muted-foreground hover:text-foreground transition-all cursor-pointer border border-white/10 hover:border-white/20 hover:bg-white/5"
          >
            View Sample Roadmap
          </button>
        </motion.div>
      </div>
    </section>
  );
};


export default IntellectCTA;
