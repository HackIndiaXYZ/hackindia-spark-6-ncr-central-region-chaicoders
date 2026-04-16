"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ProductPreview = () => {
  const { scrollYProgress } = useScroll();
  const rotateX = useTransform(scrollYProgress, [0.3, 0.6], [15, 0]);
  const scale = useTransform(scrollYProgress, [0.3, 0.6], [0.8, 1]);

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center mb-20">
        <h2 
          className="text-4xl md:text-6xl text-foreground mb-6"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Your future, <em className="not-italic text-muted-foreground">visualized.</em>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          A panoramic view of your career progression. Every milestone, every opportunity, perfectly mapped.
        </p>
      </div>

      <div className="perspective-[2000px] w-full max-w-6xl mx-auto">
        <motion.div
          style={{ rotateX, scale }}
          className="liquid-glass rounded-[2.5rem] p-4 p-8 border border-white/10 shadow-2xl relative"
        >
          {/* Dashboard Preview Image */}
          <div className="rounded-[1.5rem] overflow-hidden bg-black/40">
            <img 
              src="/intellect_dashboard_preview.png" 
              alt="Intellect Dashboard" 
              className="w-full h-auto object-cover"
            />
          </div>

          
          {/* Overlay glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
};

export default ProductPreview;
