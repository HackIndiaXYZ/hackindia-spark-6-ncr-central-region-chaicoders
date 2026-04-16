"use client";

import { 
  TrendingUp, 
  TrendingDown, 
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  trend: number;
  color: string;
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color 
}: StatsCardProps) {
  const isPositive = trend >= 0;

  const colorMap: Record<string, string> = {
    blue: "#00f0ff",
    purple: "#8a2be2",
    cyan: "#00f0ff",
    indigo: "#8a2be2",
    rose: "#ff007f",
    emerald: "#10b981",
    amber: "#f59e0b"
  };

  const activeColor = "#C7966B";

  return (
    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 shadow-2xl">
      <div className="flex items-start justify-between mb-8">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center border border-[#C7966B]/20 bg-[#C7966B]/5 shadow-inner transition-all duration-700 group-hover:bg-[#C7966B]/20 group-hover:border-[#C7966B]/40"
          style={{ color: activeColor }}
        >
          <Icon className="w-7 h-7" />
        </div>
        <div className={cn(
          "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg",
          isPositive ? "bg-[#C7966B]/10 text-[#C7966B]" : "bg-white/5 text-white/40"
        )}>
          {isPositive ? "↑" : "↓"}{Math.abs(trend)}%
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-[#C7966B] text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-80">{title}</h3>
        <div className="flex flex-col gap-2">
          <span className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{value}</span>
          <span className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">{subtitle}</span>
        </div>
      </div>

      {/* Decorative Glow */}
      <div 
        className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-all duration-1000"
        style={{ backgroundColor: activeColor }}
      />
    </div>
  );
}
