"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const VelorahNavbar = () => {
  const router = useRouter();

  return (
    <nav className="relative z-10 max-w-[1500px] mx-auto px-12 py-8 flex flex-row justify-between items-center animate-fade-rise">
      {/* Logo */}

      <div 
        className="text-3xl font-bold tracking-tight text-foreground"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        INTELLECT
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Intelligence</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Roadmap</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Opportunities</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
      </div>

      {/* CTA Button */}
      <button 
        onClick={() => router.push("/signup")}
        className="liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground hover:scale-[1.03] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
      >
        Begin Journey
      </button>
    </nav>
  );
};


export default VelorahNavbar;
