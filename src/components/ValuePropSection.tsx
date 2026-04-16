"use client";

import { motion, Variants } from "framer-motion";
import { AlertCircle, Compass, DollarSign } from "lucide-react";

const problems = [
  {
    id: "guidance",
    title: "No Personalized Guidance",
    description:
      "Students lack structured, individualized career counseling. Generic advice leads to missed opportunities and wrong career choices.",
    icon: <AlertCircle size={32} className="text-red-400" />,
    gradient: "from-red-400/15 to-transparent",
    accent: "red",
  },
  {
    id: "roadmap",
    title: "No Foreign Education Roadmap",
    description:
      "There is no clear, step-by-step path for studying abroad — from exams and university shortlisting to SOPs, visas, and applications.",
    icon: <Compass size={32} className="text-purple-400" />,
    gradient: "from-purple-400/15 to-transparent",
    accent: "purple",
  },
  {
    id: "scholarships",
    title: "Hidden Scholarships & Jobs",
    description:
      "Students remain unaware of thousands of international scholarships, financial aid programs, and global job opportunities they qualify for.",
    icon: <DollarSign size={32} className="text-purple-400" />,
    gradient: "from-purple-400/15 to-transparent",
    accent: "purple",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: [0.76, 0, 0.24, 1], duration: 1.2 },
  },
};

export default function ValuePropSection() {
  return (
    <section id="features" className="py-32 relative z-20 bg-transparent">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          >
            <p className="text-red-400/80 text-sm font-medium tracking-widest uppercase mb-4">
              The Problem
            </p>
            <h2
              className="font-serif mb-6"
              style={{ fontSize: "clamp(1.75rem, 4vw, 3.5rem)" }}
            >
              Millions of students. <br />
              <span className="text-gray-500">Zero structured guidance.</span>
            </h2>
            <p className="text-gray-400 font-light max-w-2xl text-lg leading-relaxed">
              The career counseling industry is fragmented and reactive. We built Intellect to change that — an AI system that gives every student the roadmap they deserve.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {problems.map((problem) => (
            <motion.div
              key={problem.id}
              variants={cardVariants}
              whileHover={{ y: -10, transition: { duration: 0.15 } }}
              className="glass p-6 sm:p-8 lg:p-10 rounded-3xl relative overflow-hidden group border border-white/5 hover:border-white/20 transition-all duration-200"
            >
              <div
                className={`absolute -top-16 -right-16 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-gradient-to-bl ${problem.gradient} rounded-full blur-3xl group-hover:blur-2xl transition-all duration-200 opacity-50`}
              />

              <div className="mb-8 p-4 rounded-2xl bg-white/5 inline-block border border-white/10 group-hover:scale-110 transition-transform duration-200">
                {problem.icon}
              </div>

              <h3 className="text-xl sm:text-2xl font-medium mb-4 text-white font-serif">
                {problem.title}
              </h3>
              <p className="text-gray-400 leading-relaxed font-light">
                {problem.description}
              </p>

              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
