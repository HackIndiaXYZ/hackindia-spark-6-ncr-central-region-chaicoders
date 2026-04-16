"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { label: "Signals", href: "#features" },
  { label: "Salary", href: "#demo" },
  { label: "Careers", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] h-20 flex items-center justify-between px-6 md:px-12 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md border-b border-[#FAFAF7]"
            : "bg-white"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="text-[#1A1A2E] font-bold text-2xl tracking-tighter">
            Career<span className="text-[#F97316]">IQ</span>
            <span className="text-[#F97316]">.</span>
          </span>
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="orange-underline text-[#1A1A2E] text-[15px] font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/login"
            className="text-[#1A1A2E] text-[15px] font-medium hover:text-[#F97316] transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-white text-[15px] font-semibold px-6 py-3 rounded-full bg-[#F97316] hover:bg-[#EA580C] hover:scale-105 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
          >
            Get early access
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Open menu"
        >
          <span className="block w-6 h-[2px] bg-[#1A1A2E]" />
          <span className="block w-6 h-[2px] bg-[#1A1A2E]" />
          <span className="block w-4 h-[2px] bg-[#F97316] self-end" />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-[200]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 w-full sm:w-[80vw] h-full bg-[#FFFFFF] z-[300] flex flex-col p-8"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="self-end text-[#1A1A2E] text-sm font-bold uppercase tracking-widest mb-12 hover:text-[#F97316] transition-colors"
              >
                CLOSE ✕
              </button>
              <div className="flex flex-col gap-8">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="text-[#1A1A2E] text-3xl font-serif tracking-tight"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
              <div className="mt-auto flex flex-col gap-4">
                <Link
                  href="/login"
                  className="text-center py-4 text-[#1A1A2E] font-bold text-lg hover:text-[#F97316]"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="text-center py-4 bg-[#F97316] text-white text-lg font-bold rounded-xl"
                >
                  Get early access
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
