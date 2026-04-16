"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTransitionStore } from "@/lib/transition-store";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const setInactive = useTransitionStore((state) => state.setInactive);

  useEffect(() => {
    setInactive();
  }, [setInactive]);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[99999] bg-[#050505] pointer-events-none flex items-center justify-center overflow-hidden"
        initial={{ y: "0%" }}
        animate={{ y: "-100%" }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      >
        <motion.div 
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        >
          <div className="text-4xl md:text-6xl font-serif tracking-tighter font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Intellect<span className="text-[#C7966B]">.</span>
          </div>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C7966B] to-transparent"></div>
        </motion.div>
      </motion.div>
      {children}
    </>
  );
}
