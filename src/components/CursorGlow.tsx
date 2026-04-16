"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CursorGlow() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Springs for the outer ring (follows quickly, tight reaction)
  const springConfig = { damping: 25, stiffness: 400, mass: 0.2 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  // Springs for the glow blob (follows quickly but slightly softer than ring)
  const glowSpring = { damping: 25, stiffness: 250, mass: 0.5 };
  const glowX = useSpring(cursorX, glowSpring);
  const glowY = useSpring(cursorY, glowSpring);

  const triggerScroll = useCallback(() => {
    setIsScrolling(true);
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 200);
  }, []);

  useEffect(() => {
    document.body.style.cursor = "none";

    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onMouseOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const clickable =
        t.tagName === "A" ||
        t.tagName === "BUTTON" ||
        !!t.closest("a") ||
        !!t.closest("button") ||
        window.getComputedStyle(t).cursor === "pointer";
      setIsHoveringClickable(clickable);
    };

    const onMouseLeave = () => setIsVisible(false);

    // Use wheel event — works regardless of Lenis
    const onWheel = () => triggerScroll();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("wheel", onWheel);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [cursorX, cursorY, isVisible, triggerScroll]);

  const isGlowActive = isScrolling;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `* { cursor: none !important; }` }} />

      {/* ── 1. Precise dot ── */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none mix-blend-difference z-[9999] hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          width: 8,
          height: 8,
          backgroundColor: "#fff",
        }}
        animate={{ opacity: isVisible && !isGlowActive ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />

      {/* ── 2. Outer ring ── */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none mix-blend-difference z-[9998] hidden md:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isGlowActive ? 0 : isHoveringClickable ? 60 : 40,
          height: isGlowActive ? 0 : isHoveringClickable ? 60 : 40,
          opacity: isVisible && !isGlowActive ? 1 : 0,
          borderWidth: 1,
          borderColor: isHoveringClickable
            ? "rgba(255,255,255,0)"
            : "rgba(255,255,255,0.5)",
          backgroundColor: isHoveringClickable
            ? "rgba(255,255,255,0.9)"
            : "rgba(255,255,255,0)",
          scale: isHoveringClickable ? 1.15 : 1,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />

      {/* ── 3. Cyan glow (always rendered, opacity driven) ── */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9997] hidden md:block"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          width: 250,
          height: 250,
          background:
            "radial-gradient(circle, rgba(0,240,255,0.2) 0%, rgba(0,240,255,0.05) 40%, rgba(0,0,0,0) 70%)",
        }}
        animate={{
          opacity: isVisible ? (isGlowActive ? 1 : 0.4) : 0,
          scale: isGlowActive ? 1.2 : (isHoveringClickable ? 0.6 : 0.4),
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
    </>
  );
}
