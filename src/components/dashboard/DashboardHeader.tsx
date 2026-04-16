"use client";

import { 
  Bell, 
  Search, 
  User,
  LogOut,
  CreditCard,
  Shield,
  History,
  Trophy,
  Settings,
  ChevronDown,
  Globe,
  Briefcase,
  Users
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/user-store";

export function DashboardHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { skillVectorScore, setSkillVectorScore } = useUserStore();

  useEffect(() => {
    async function getData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data);
        if (data?.skill_vector_score) {
          setSkillVectorScore(data.skill_vector_score);
        }
      }
    }
    getData();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="h-20 px-8 border-0 border-b border-white/5 flex items-center justify-between sticky top-0 glass z-40">
      {/* Bryzos-style Search Bar */}
      <div className="flex-1 max-w-2xl px-4">
        <div className="relative group overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-white/[0.03] group-hover:bg-white/[0.06] transition-all" />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#00f0ff] transition-colors" />
          <input 
            type="text" 
            placeholder="Search for items, jobs, or roadmaps..." 
            className="w-full h-12 bg-transparent border border-white/5 rounded-2xl pl-13 pr-6 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#00f0ff]/30 transition-all"
          />
        </div>
      </div>

      {/* Top Navigation Links - Dribbble Style */}
      <nav className="hidden xl:flex items-center gap-8 mx-8">
        {[
          { name: "Explore", icon: Globe },
          { name: "Hire Talent", icon: Briefcase },
          { name: "Community", icon: Users }
        ].map((item) => (
          <button key={item.name} className="flex items-center gap-2 text-[13px] font-bold text-gray-400 hover:text-white transition-colors group">
            <item.icon className="w-4 h-4 text-gray-600 group-hover:text-[#00f0ff] transition-colors" />
            {item.name}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <button className="relative w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00f0ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Bell className="w-5 h-5" />
          <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-[#00f0ff] rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-4 pl-6 border-l border-white/5 hover:opacity-80 transition-opacity cursor-pointer group"
          >
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-white group-hover:text-[#8a2be2] transition-colors tracking-wide">
                {profile?.name || user?.email?.split('@')[0] || "User Name"}
              </span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {profile?.institution || "Pro Account"}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00f0ff]/10 to-[#8a2be2]/10 border border-white/5 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:border-[#00f0ff]/30 transition-all overflow-hidden relative">
               <div className="absolute inset-0 bg-white/5" />
               <User className="w-5 h-5 relative z-10" />
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 mt-4 w-80 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.8)] p-4 z-50 overflow-hidden"
              >
                <div className="relative p-4 rounded-2xl bg-white/5 border border-white/5 mb-4 group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00f0ff] to-[#8a2be2] flex items-center justify-center text-white font-bold text-xl border border-white/20 shadow-lg shadow-[#00f0ff]/20">
                      {profile?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white truncate">{profile?.name || user?.email || "user@example.com"}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-amber-400 tracking-tight">
                          {skillVectorScore || 0} / 100 Pts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 mb-4">
                  {[
                    { label: "My Profile", icon: User, href: "/profile" },
                    { label: "Settings", icon: Settings, href: "/dashboard" },
                    { label: "Billing", icon: CreditCard, href: "/dashboard" }
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => {
                        setIsProfileOpen(false);
                        router.push(item.href);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors group text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-[#00f0ff]/30 group-hover:text-[#00f0ff] transition-all text-gray-500">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">{item.label}</p>
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-rose-500/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3 text-gray-400 group-hover:text-rose-400">
                      <LogOut className="w-5 h-5" />
                      <span className="text-xs font-bold">Sign Out</span>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
