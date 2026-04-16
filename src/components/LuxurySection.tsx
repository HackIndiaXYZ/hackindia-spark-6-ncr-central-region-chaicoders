"use client";

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useRef, useMemo } from "react";
import Image from "next/image";

interface LuxurySectionProps {
  category: string;
  title: string;
  description: string;
  imageSrc: string;
  isFirst?: boolean;
  barColor?: string;
}

export default function LuxurySection({ 
  category, 
  title, 
  description, 
  imageSrc, 
  isFirst = false,
  barColor = "#FF4B4B"
}: LuxurySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax for background image
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  
  // Reveal animation (clip-path)
  const clipProgress = useTransform(scrollYProgress, [0, 0.4], ["inset(100% 0px 0px 0px)", "inset(0% 0px 0px 0px)"]);

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-[120vh] w-full flex flex-col bg-black overflow-hidden"
    >
      {/* Sticky Category Bar */}
      <div 
        style={{ backgroundColor: barColor }} 
        className="sticky top-0 z-40 w-full py-3 px-6 overflow-hidden"
      >
        <motion.div 
          initial={{ x: "100%" }}
          whileInView={{ x: "0%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-between items-center"
        >
          <span className="text-white text-xs font-bold tracking-[0.3em] uppercase">
            {category}
          </span>
          <div className="h-[1px] flex-grow mx-8 bg-white/30 hidden md:block"></div>
          <span className="text-white/70 text-[10px] font-medium tracking-[0.2em] uppercase">
            Career Intel v2.0
          </span>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div ref={containerRef} className="relative flex-grow w-full flex flex-col md:flex-row items-center justify-center pt-20 px-6 md:px-20 gap-12">
        
        {/* Visual Background / Image Container */}
        <motion.div 
          style={{ clipPath: clipProgress }}
          className="relative w-full aspect-[4/5] md:aspect-square md:w-[60vw] max-w-4xl overflow-hidden shadow-2xl group"
        >
          <motion.div style={{ y }} className="absolute inset-0 scale-110">
            <Image 
              src={imageSrc} 
              alt={title} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority={isFirst}
            />
          </motion.div>
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </motion.div>

        {/* Text Content - Glassmorphic Card */}
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="z-10 w-full md:w-[45vw] flex flex-col items-start gap-8 md:-ml-32 bg-white/5 backdrop-blur-2xl p-12 md:p-16 border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <div className="flex flex-wrap overflow-hidden">
            {title.split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: "100%" }}
                whileInView={{ y: "0%" }}
                transition={{ 
                   duration: 0.8, 
                   delay: i * 0.03, 
                   ease: [0.76, 0, 0.24, 1] 
                }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-white"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col gap-8"
          >
            <p className="text-gray-300 text-lg md:text-xl font-medium leading-relaxed max-w-md">
              {description}
            </p>
            <button 
              style={{ "--hover-bg": barColor } as any}
              className="self-start group relative overflow-hidden py-4 px-10 bg-white text-black text-xs font-black tracking-[0.3em] uppercase transition-all duration-700 rounded-full"
            >
              <span className="relative z-10">Explore Matrix</span>
              <div 
                style={{ backgroundColor: barColor }}
                className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
              ></div>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Category Ghost Text */}
      <div className="absolute bottom-10 left-10 opacity-[0.15] select-none pointer-events-none">
        <span className="text-[20vw] font-black uppercase leading-none tracking-tighter whitespace-nowrap">
          {category}
        </span>
      </div>
    </section>
  );
}
