"use client";

import Link from "next/link";

const footerLinks = {
  Intelligence: ["Market Signals", "Salary Pulse", "Career Paths", "Hiring Forecasting"],
  Company: ["Our Mission", "Careers", "The Lab", "Press"],
  Help: ["Contact", "Privacy", "Security", "Terms"]
};

export default function LandingFooter() {
  return (
    <footer className="relative bg-white pt-24 pb-12 px-6 md:px-12 border-t border-black/5">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-16 mb-24">
          {/* Logo Brand Column */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-1 mb-8 group">
              <span className="text-[#1A1A2E] font-bold text-3xl tracking-tighter">
                Career<span className="text-[#F97316]">IQ</span>
                <span className="text-[#F97316]">.</span>
              </span>
            </Link>
            <p className="text-[#4A4A68] text-lg leading-relaxed max-w-sm mb-8">
              We started CareerIQ because we were tired of the job market being a game of chance. Careers should be data-driven, not luck-driven.
            </p>
            <div className="flex gap-6">
              {['Twitter', 'LinkedIn'].map(s => (
                 <a key={s} href="#" className="font-bold text-[#1A1A2E] hover:text-[#F97316] transition-colors">
                   {s}
                 </a>
              ))}
            </div>
          </div>

          {/* Nav Categories */}
          {Object.entries(footerLinks).map(([cat, links]) => (
            <div key={cat}>
               <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#F97316] mb-8">{cat}</h4>
               <ul className="flex flex-col gap-4">
                 {links.map(l => (
                   <li key={l}>
                      <a href="#" className="text-[#4A4A68] hover:text-[#1A1A2E] font-medium transition-colors">{l}</a>
                   </li>
                 ))}
               </ul>
            </div>
          ))}
        </div>

        {/* Human Touch Bottom Line */}
        <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm text-[#4A4A68] font-medium">
            &copy; 2026 CareerIQ. Made with too much coffee and a genuine belief that careers should be less mysterious.
          </p>
          <div className="flex items-center gap-4 bg-[#FAFAF7] px-4 py-2 rounded-full border border-black/5">
             <span className="w-2 h-2 rounded-full bg-[#84CC16]" />
             <span className="text-xs font-mono font-bold text-[#1A1A2E]">MARKET DATA FEED: 100% UP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
