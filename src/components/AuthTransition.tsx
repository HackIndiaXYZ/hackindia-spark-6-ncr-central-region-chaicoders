"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTransitionStore } from "@/lib/transition-store";

export default function AuthTransition({ children }: { children: React.ReactNode }) {
  const setInactive = useTransitionStore((state) => state.setInactive);

  useEffect(() => {
    // Reset global transition state after navigation
    setInactive();
  }, [setInactive]);

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      exit={{ opacity: 0, filter: "blur(10px)", y: 20 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
