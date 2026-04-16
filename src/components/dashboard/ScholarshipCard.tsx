import React from "react";
import { GraduationCap, MapPin, Clock, ArrowUpRight, DollarSign, Bookmark, Award } from "lucide-react";
import { motion } from "framer-motion";

interface ScholarshipCardProps {
  id: number | string;
  title: string;
  provider: string;
  location: string;
  amount: string;
  deadline: string;
  matchScore: number;
  tags: string[];
  isPremium?: boolean;
  status?: "open" | "closed" | "closing_soon";
  onClick?: () => void;
}

export function ScholarshipCard({
  id,
  title,
  provider,
  location,
  amount,
  deadline,
  matchScore,
  tags,
  isPremium = false,
  status = "open",
  onClick,
}: ScholarshipCardProps) {
  const isClosed = status === "closed";

  return (
    <motion.div 
      layoutId={`scholarship-${id}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`group relative bg-[#1A1926] rounded-[24px] border border-[#ffffff05] p-6 hover:border-[#A05CFF]/30 hover:shadow-[0_8px_30px_rgba(160,92,255,0.1)] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer ${isClosed ? "grayscale-[0.8] opacity-80" : ""}`}
    >
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-[150px] h-[150px] bg-gradient-to-br from-[#A05CFF]/10 to-transparent blur-[50px] translate-x-1/2 -translate-y-1/2 group-hover:from-[#A05CFF]/20 transition-colors ${isClosed ? "hidden" : ""}`} />

      <div>
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#ffffff05] border border-[#ffffff10] flex items-center justify-center text-[#A05CFF] group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[18px] font-semibold text-white/95 group-hover:text-white transition-colors truncate">
                  {title}
                </h3>
                {isClosed && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-bold uppercase tracking-widest shrink-0">
                    Closed
                  </span>
                )}
                {status === "closing_soon" && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-bold uppercase tracking-widest shrink-0 animate-pulse">
                    Hot
                  </span>
                )}
              </div>
              <p className="text-[14px] text-[#8E8B9F] truncate">{provider}</p>
            </div>
          </div>
          <button 
            className="text-[#8E8B9F] hover:text-[#A05CFF] transition-colors shrink-0 ml-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Bookmark className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffffff05] border border-[#ffffff0a] text-[12px] font-medium text-[#8E8B9F]">
            <MapPin className="w-3.5 h-3.5" />
            {location}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffffff05] border border-[#ffffff0a] text-[12px] font-medium text-[#8E8B9F]">
            <DollarSign className="w-3.5 h-3.5" />
            {amount}
          </span>
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffffff05] border border-[#ffffff0a] text-[12px] font-medium transition-colors ${status === "closing_soon" ? "text-amber-500 border-amber-500/20 bg-amber-500/5" : "text-[#8E8B9F]"}`}>
            <Clock className="w-3.5 h-3.5" />
            {isClosed ? "Ended" : `Ends ${deadline}`}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-md bg-[#A05CFF]/10 text-[#A05CFF] text-[11px] font-bold uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
          {isPremium && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-500 border border-amber-500/20 text-[11px] font-bold uppercase tracking-wider">
              <Award className="w-3 h-3" /> Anchor
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#ffffff0a] relative z-10">
        <div>
          <p className="text-[12px] text-[#8E8B9F] mb-1">Fit Score</p>
          <div className="flex items-center gap-2">
            <div className="w-[100px] h-2 bg-[#ffffff05] rounded-full overflow-hidden border border-[#ffffff0a]">
              <motion.div 
                className={`h-full rounded-full ${isClosed ? "bg-gray-500" : "bg-gradient-to-r from-[#6035EE] to-[#A05CFF]"}`}
                initial={{ width: 0 }}
                animate={{ width: `${matchScore}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{ width: `${matchScore}%` }}
              />
            </div>
            <span className="text-[14px] font-bold text-white/90">{matchScore}%</span>
          </div>
        </div>

        <button className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors ${isClosed ? "bg-white/10 text-white/40 hover:bg-white/20" : "bg-white text-black hover:bg-[#E3D9FF]"}`}>
          {isClosed ? "Show Active Alternatives" : "View Details"} <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

