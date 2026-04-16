"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FileText, Cpu, Map, GraduationCap, Briefcase } from "lucide-react";

const pipelineSteps = [
  {
    icon: <FileText size={20} />,
    title: "Data Intake",
    description: "Multi-format resume & profile parsing."
  },
  {
    icon: <Cpu size={20} />,
    title: "AI Analysis",
    description: "Deep skill extraction & gap identification."
  },
  {
    icon: <Map size={20} />,
    title: "Optimization",
    description: "Roadmap synthesis & path probability."
  },
  {
    icon: <GraduationCap size={20} />,
    title: "Targeting",
    description: "Resource matching & scholarship tracking."
  },
  {
    icon: <Briefcase size={20} />,
    title: "Deployment",
    description: "Real-world application & career launch."
  }
];

const CareerPipeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const beamWidth = useTransform(scrollYProgress, [0.1, 0.8], ["0%", "100%"]);
  const glowOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.7, 0.8], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 
            className="text-4xl md:text-6xl text-foreground mb-6"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            The Intellect <em className="not-italic text-muted-foreground">Pipeline</em>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A continuous flow of intelligence from identification to achievement.
          </p>
        </div>

        <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-white/5 z-0" />
          
          {/* Glowing Beam */}
          <motion.div 
            style={{ width: beamWidth, opacity: glowOpacity }}
            className="hidden md:block absolute top-[39px] left-0 h-[3px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_20px_rgba(255,255,255,0.8)] z-10 origin-left"
          />

          {pipelineSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="relative z-20 flex flex-col items-center text-center flex-1"
            >
              {/* Node */}
              <div className="w-20 h-20 rounded-full liquid-glass flex items-center justify-center mb-6 text-foreground shadow-[0_0_30px_rgba(255,255,255,0.05)] group hover:scale-110 transition-transform duration-500 bg-background/80">
                {step.icon}
                
                {/* Connecting Pulsing Dot */}
                <div className="absolute -inset-1 rounded-full bg-white/5 animate-pulse -z-10" />
              </div>


              <h3 className="text-xl font-medium text-foreground mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
                {step.title}
              </h3>
              <p className="text-muted-foreground text-xs max-w-[150px] leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Decorative vertical lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />
    </section>
  );
};

export default CareerPipeline;
