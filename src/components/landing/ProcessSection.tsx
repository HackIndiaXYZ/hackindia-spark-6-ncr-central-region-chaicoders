"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Upload & Analyze",
    description: "Our AI scans your resume and academic background to identify hidden strengths."
  },
  {
    number: "02",
    title: "Strategic Design",
    description: "We map out a global roadmap tailored to your specific career aspirations and goals."
  },
  {
    number: "03",
    title: "Launch & Track",
    description: "Get real-time alerts for scholarships, internships, and jobs that fit your path."
  }
];

const ProcessSection = () => {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 
              className="text-4xl md:text-6xl text-foreground mb-6"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              The path to <em className="not-italic text-muted-foreground">mastery.</em>
            </h2>
            <p className="text-muted-foreground text-lg">
              A streamlined three-step evolution to transform your career trajectory.
            </p>
          </div>
          <div className="hidden md:block h-px flex-1 bg-border mx-12 mb-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative"
            >
              <div 
                className="text-8xl font-bold text-foreground/5 absolute -top-12 -left-4 pointer-events-none"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {step.number}
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-medium text-foreground mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
