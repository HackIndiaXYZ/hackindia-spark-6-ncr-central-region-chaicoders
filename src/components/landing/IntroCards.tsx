"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Compass, Target, Rocket } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="liquid-glass p-8 rounded-[2rem] flex flex-col items-start gap-4 group"
    >
      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-muted-foreground group-hover:text-foreground transition-colors duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-medium text-foreground mt-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

const IntroCards = () => {
  const features = [
    {
      icon: <Sparkles size={24} />,
      title: "AI Analysis",
      description: "Deep-dive into your skills and potential with our advanced analysis engine."
    },
    {
      icon: <Compass size={24} />,
      title: "Global Roadmaps",
      description: "Strategic career paths tailored to international standards and opportunities."
    },
    {
      icon: <Target size={24} />,
      title: "Precision Tracking",
      description: "Real-time monitoring of job trends and scholarship openings worldwide."
    },
    {
      icon: <Rocket size={24} />,
      title: "Future Ready",
      description: "Prepare for the jobs of tomorrow with predictive industry intelligence."
    }
  ];

  return (
    <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            index={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default IntroCards;
