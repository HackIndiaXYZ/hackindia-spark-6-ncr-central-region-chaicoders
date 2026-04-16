"use client";

import { 
  LayoutDashboard, 
  Briefcase, 
  GraduationCap, 
  Map as MapIcon, 
  BookOpen, 
  Users, 
  Settings,
  Bookmark,
  FileText,
  MessageSquare,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function DashboardSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Job Market", icon: Briefcase, href: "/dashboard/jobs" },
    { name: "Scholarships", icon: GraduationCap, href: "/dashboard/scholarships" },
    { name: "Roadmaps", icon: MapIcon, href: "/dashboard/roadmaps" },
    { name: "Resume AI", icon: FileText, href: "/dashboard/resume" },
    { name: "Interview Prep", icon: MessageSquare, href: "/dashboard/interview" },
    { name: "Skill Bridge", icon: BookOpen, href: "/dashboard/skill-bridge" },
    { name: "Mentorship", icon: Users, href: "/dashboard/mentorship" },
    { name: "Saved", icon: Bookmark, href: "/dashboard/saved" },
  ];

  return (
    <aside className="w-[260px] h-screen bg-black/5 backdrop-blur-3xl flex flex-col fixed left-0 top-0 z-50 py-10 px-8 border-r border-white/5">
      {/* Editorial Style Logo */}
      <div className="mb-16 px-2">
        <Link href="/" className="group">
          <span className="text-white font-black text-2xl tracking-[0.1em] uppercase group-hover:tracking-[0.2em] transition-all duration-300">
            Intellect
          </span>
          <div className="h-[2px] w-8 bg-[#C7966B] mt-1 group-hover:w-full transition-all duration-500"></div>
        </Link>
      </div>

      <nav className="space-y-4 flex-1 overflow-y-auto pr-2 no-scrollbar -mr-2">
        <p className="text-[#C7966B] text-[10px] font-black tracking-widest uppercase mb-6 px-4 opacity-100">Portal Index</p>
        {menuItems.map((item, i) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={i}
              href={item.href}
              className={`flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-500 group relative ${
                isActive 
                  ? "bg-white/5 border border-white/10 text-white shadow-2xl" 
                  : "text-white/40 hover:text-white"
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 ${isActive ? "text-[#C7966B]" : "text-white/30"}`} />
              <span className={`text-[12px] font-black uppercase tracking-widest transition-all ${isActive ? "tracking-widest" : "group-hover:tracking-widest"}`}>
                {item.name}
              </span>
              {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-[#C7966B] rounded-full shadow-[0_0_15px_rgba(199,150,107,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Settings Action */}
      <div className="mt-auto pt-8 border-t border-white/5">
        <Link 
          href="/dashboard/settings" 
          className="flex items-center gap-4 px-5 py-4 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 transition-all duration-500 group"
        >
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
