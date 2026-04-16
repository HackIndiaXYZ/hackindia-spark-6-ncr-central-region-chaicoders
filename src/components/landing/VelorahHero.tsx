"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const VelorahHero = () => {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Fullscreen Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" 
          type="video/mp4" 
        />
        Your browser does not support the video tag.
      </video>

      {/* Bottom Gradient Fade */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent z-[1]" />


      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center pt-32 pb-40 py-[90px]">
        {/* Headline */}
        <h1 
          className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] font-normal text-foreground animate-fade-rise"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          We build <em className="not-italic text-muted-foreground">intelligent</em> <em className="not-italic text-muted-foreground">futures.</em>
        </h1>

        {/* Subtext */}
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay">
          The first AI-powered system combining career guidance, global roadmap planning, 
          and real-time opportunity tracking for students and professionals.
        </p>


        {/* Hero CTA Button */}
        <button 
          onClick={() => router.push("/signup")}
          className="liquid-glass rounded-full px-14 py-5 text-base text-foreground mt-12 hover:scale-[1.03] transition-all cursor-pointer animate-fade-rise-delay-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
        >
          Begin Journey
        </button>
      </div>
    </section>
  );
};

export default VelorahHero;
