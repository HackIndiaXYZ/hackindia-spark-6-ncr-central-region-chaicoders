"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useTransitionStore } from "@/lib/transition-store";

export default function GlobalTransitionOverlay() {
  const { isActive, startPoint, color, randomFactor } = useTransitionStore();
  const [dimensions, setDimensions] = useState(() => {
    if (typeof window === "undefined") return { width: 0, height: 0 };
    return { width: window.innerWidth, height: window.innerHeight };
  });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Use memo to ensure control points are stable and pre-calculated
  const pathData = useMemo(() => {
    if (!dimensions.width) return null;
    
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    // Simpler, more stable calculation for GPU-accelerated transforms
    const cpX = startPoint.x + (centerX - startPoint.x) * randomFactor + (Math.sin(randomFactor * Math.PI) * 150);
    const cpY = startPoint.y + (centerY - startPoint.y) * 0.5 + (Math.cos(randomFactor * Math.PI) * 150);

    return { centerX, centerY, cpX, cpY };
  }, [dimensions, startPoint, randomFactor]);

  if (!pathData) return null;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[10000] pointer-events-none will-change-transform"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          {/* Main animated ball with GPU-optimized properties */}
          <motion.div
            initial={{ 
              x: startPoint.x, 
              y: startPoint.y, 
              scale: 0,
              opacity: 1
            }}
            animate={{ 
              x: [startPoint.x, pathData.cpX, pathData.centerX],
              y: [startPoint.y, pathData.cpY, pathData.centerY],
              scale: [0, 1.2, 1, 150],
            }}
            transition={{
              duration: 1.1,
              times: [0, 0.45, 0.65, 1],
              ease: [0.76, 0, 0.24, 1] // Custom cubic-bezier for smooth motion
            }}
            className="absolute top-0 left-0 rounded-full will-change-transform"
            style={{
              backgroundColor: color,
              width: "40px",
              height: "40px",
              marginLeft: "-20px", 
              marginTop: "-20px",
              boxShadow: `0 0 70px ${color}, 0 0 100px ${color}80`, // Layered glow for neon look
              backfaceVisibility: "hidden",
              transformStyle: "preserve-3d"
            }}
          />

          {/* Optimized Trail Effect */}
          <motion.div
            initial={{ 
              x: startPoint.x, 
              y: startPoint.y, 
              scale: 0,
              opacity: 0.4
            }}
            animate={{ 
              x: [startPoint.x, pathData.cpX, pathData.centerX],
              y: [startPoint.y, pathData.cpY, pathData.centerY],
              scale: [0, 0.7, 0.4, 0],
            }}
            transition={{
              duration: 0.7,
              times: [0, 0.5, 0.7, 1],
              ease: "easeOut"
            }}
            className="absolute top-0 left-0 rounded-full border border-white/20 will-change-transform"
            style={{
              width: "50px",
              height: "50px",
              marginLeft: "-25px",
              marginTop: "-25px"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
