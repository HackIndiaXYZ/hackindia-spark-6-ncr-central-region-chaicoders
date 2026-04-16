import { ExternalLink, Plus } from "lucide-react";

interface BryzosCardProps {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  metric1: string; // e.g. "20' Length(s)"
  metric2: string; // e.g. "$0.5000 / ft"
  label: string;
}

export function BryzosCard({ icon, title, subtitle, description, metric1, metric2, label }: BryzosCardProps) {
  return (
    <div className="group relative w-full bg-white/[0.02] backdrop-blur-3xl rounded-[2rem] p-8 transition-all duration-700 hover:bg-white/[0.05] border border-white/5 hover:border-[#C7966B]/20 flex items-center gap-10 overflow-hidden shadow-2xl">
      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 w-60 h-60 bg-[#C7966B]/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      {/* Icon / Thumbnail Box */}
      <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-all duration-700 group-hover:scale-105 group-hover:border-[#C7966B]/30 shadow-inner">
        {icon || <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C7966B] to-black opacity-60 shadow-[0_15px_30px_rgba(199,150,107,0.3)]" />}
      </div>
 
      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
        {/* Title/Subtitle */}
        <div className="col-span-1 min-w-0">
          <h4 className="text-[12px] font-black text-white uppercase tracking-tight group-hover:text-[#C7966B] transition-colors duration-500 truncate">{title}</h4>
          <p className="text-[10px] font-black text-[#C7966B] mt-2 uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-all">{subtitle}</p>
        </div>
 
        {/* Description */}
        <div className="col-span-1 min-w-0 hidden md:block">
          <p className="text-[11px] text-white/40 font-bold uppercase tracking-tight leading-relaxed group-hover:text-white/60 transition-colors">{description}</p>
        </div>
 
        {/* Metric 1 */}
        <div className="col-span-1 hidden lg:block">
          <p className="text-[12px] text-white font-black uppercase tracking-widest">{metric1}</p>
        </div>
 
        {/* Metric 2 */}
        <div className="col-span-1 hidden lg:block">
          <p className="text-[12px] text-[#C7966B] font-black uppercase tracking-widest">{metric2}</p>
        </div>
 
        {/* Label and CTA */}
        <div className="col-span-1 flex justify-end items-center gap-6">
          <span className="text-[9px] px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 font-black uppercase tracking-widest hidden xl:block">
            {label}
          </span>
          <button className="w-10 h-10 rounded-full bg-[#C7966B] flex items-center justify-center text-white scale-90 group-hover:scale-100 active:scale-95 transition-all duration-500 shadow-[0_10px_20px_rgba(199,150,107,0.3)]">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
