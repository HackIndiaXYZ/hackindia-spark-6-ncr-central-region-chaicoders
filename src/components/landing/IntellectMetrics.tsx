"use client";

import React from "react";
import { motion } from "framer-motion";

const stats = [
  { label: "AI Predictions", value: "94%" },
  { label: "Career Fields", value: "500+" },
  { label: "Global Users", value: "10k+" },
  { label: "Real-time Alerts", value: "24/7" }
];

const IntellectMetrics = () => {
  return (
    <section className="relative py-24 px-6 border-y border-white/5 bg-foreground/[0.01]">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-12">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex flex-col items-center flex-1 min-w-[150px]"
          >
            <div 
              className="text-5xl md:text-6xl text-foreground mb-2"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {stat.value}
            </div>
            <div className="text-muted-foreground text-sm uppercase tracking-widest text-center">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default IntellectMetrics;
