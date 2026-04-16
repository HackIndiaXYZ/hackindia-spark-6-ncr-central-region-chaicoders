"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransitionStore } from "@/lib/transition-store";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const triggerTransition = useTransitionStore((state) => state.triggerTransition);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTransition = (e: React.MouseEvent<HTMLAnchorElement>, href: string, color: string) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    triggerTransition(x, y, color);

    setTimeout(() => {
      router.push(href);
    }, 800); // Wait for the ball to reach center and start growing
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 1.0 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-black/20 backdrop-blur-lg border-b border-white/10 py-4 shadow-lg shadow-black/50" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="text-2xl font-serif tracking-tighter font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Intellect
          </div>

          <ul className="hidden md:flex gap-8 text-sm font-medium tracking-wide">
            {["Home", "Features", "Roadmap", "Contact"].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} className="text-gray-300 hover:text-white transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-accent-blue)] transition-all group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/login" 
              onClick={(e) => handleTransition(e, "/login", "#6b21a8")} 
              className="px-5 py-2 rounded-full border border-gray-600 hover:border-white transition-all text-sm font-medium"
            >
              Log In
            </Link>
            <Link 
              href="/signup" 
              onClick={(e) => handleTransition(e, "/signup", "#ffffff")} 
              className="px-5 py-2 rounded-full bg-white text-black hover:bg-gray-200 transition-all text-sm font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
