"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  GraduationCap, 
  Search, 
  Filter,
  Zap,
  ChevronDown,
  LayoutDashboard,
  X,
  MapPin,
  DollarSign,
  Clock,
  ExternalLink,
  Award,
  Bookmark,
  CheckCircle,
  AlertCircle,
  Globe,
  Flag,
  ShieldCheck,
  ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ScholarshipCard } from "@/components/dashboard/ScholarshipCard";
import SmoothScroll from "@/components/SmoothScroll";
import { AIChatBot } from "@/components/dashboard/AIChatBot";
import { cn } from "@/lib/utils";

interface Scholarship {
  id: number;
  type: "foreign" | "indian" | "government";
  status: "open" | "closed" | "closing_soon";
  title: string;
  provider: string;
  location: string;
  amount: string;
  deadline: string;
  matchScore: number;
  tags: string[];
  isPremium: boolean;
  description: string;
  url: string;
}

// Placeholder data for frontend showcase
const mockScholarships: Scholarship[] = [
  // FOREIGN SCHOLARSHIPS
  {
    id: 1,
    type: "foreign",
    status: "open",
    title: "Google PhD Fellowship Program",
    provider: "Google Research",
    location: "Global",
    amount: "Full Tuition + Stipend",
    deadline: "Oct 15, 2026",
    matchScore: 95,
    tags: ["Computer Science", "AI/ML", "PhD"],
    isPremium: true,
    description: "The Google PhD Fellowship Program recognizes outstanding graduate students doing exceptional research in computer science and related fields. Supports promising PhD candidates of all backgrounds.",
    url: "https://research.google/outreach/phd-fellowship/"
  },
  {
    id: 2,
    type: "foreign",
    status: "open",
    title: "Women Techmakers Scholars",
    provider: "Google",
    location: "North America",
    amount: "$10,000",
    deadline: "Dec 01, 2026",
    matchScore: 88,
    tags: ["Diversity", "Technology", "Undergrad/Grad"],
    isPremium: true,
    description: "Dedicated to providing more opportunities for women in technology based on academic performance, leadership, and impact.",
    url: "https://www.womentechmakers.com/scholars"
  },
  {
    id: 9,
    type: "foreign",
    status: "open",
    title: "Chevening Scholarship",
    provider: "UK Government",
    location: "United Kingdom",
    amount: "Full Funding",
    deadline: "Nov 07, 2026",
    matchScore: 91,
    tags: ["Leadership", "Master's", "Global"],
    isPremium: true,
    description: "Chevening is the UK government’s international awards programme aimed at developing global leaders since 1983.",
    url: "https://www.chevening.org/"
  },
  
  // INDIAN SCHOLARSHIPS
  {
    id: 10,
    type: "indian",
    status: "open",
    title: "Reliance Foundation Undergraduate Scholarship",
    provider: "Reliance Foundation",
    location: "India",
    amount: "₹2,00,000",
    deadline: "Oct 15, 2026",
    matchScore: 94,
    tags: ["Undergraduate", "All Streams", "Merit-cum-Means"],
    isPremium: true,
    description: "Empowering India's future leaders by supporting undergraduate students from all streams through a merit-cum-means selection process.",
    url: "https://www.reliancefoundation.org/scholarships"
  },
  {
    id: 12,
    type: "indian",
    status: "closed",
    title: "HDFC Badhte Kadam Scholarship",
    provider: "HDFC Bank",
    location: "India",
    amount: "Up to ₹1,00,000",
    deadline: "Dec 30, 2025",
    matchScore: 85,
    tags: ["Diversity", "Undergrad/Grad", "Indian"],
    isPremium: true,
    description: "Aims to provide financial assistance to meritorious students from underprivileged backgrounds to help them find a better future.",
    url: "https://www.buddy4study.com/page/hdfc-bank-scholarship"
  },
  {
    id: 13,
    type: "indian",
    status: "open",
    title: "Tata Scholarship at Cornell",
    provider: "Tata Education and Development Trust",
    location: "Ithaca, NY / India",
    amount: "Full Tuition",
    deadline: "Jan 02, 2027",
    matchScore: 88,
    tags: ["International", "Cornell", "Indian Students"],
    isPremium: true,
    description: "A $25 million endowment that allows Cornell to provide financial aid to undergraduate students from India.",
    url: "https://admissions.cornell.edu/apply/international-students/tata-scholarship"
  },

  // GOVERNMENT SCHOLARSHIPS
  {
    id: 20,
    type: "government",
    status: "open",
    title: "NSP Pre-Matric & Post-Matric Schemes",
    provider: "Govt. of India (NSP)",
    location: "India (National)",
    amount: "Multiple Tiers",
    deadline: "Nov 30, 2026",
    matchScore: 92,
    tags: ["Government", "National", "All Levels"],
    isPremium: false,
    description: "The National Scholarship Portal (NSP) is a one-stop solution through which various services starting from student application to application disposal and sanction of scholarship to the students are provided.",
    url: "https://scholarships.gov.in/"
  },
  {
    id: 21,
    type: "government",
    status: "closed",
    title: "PMSSS J&K and Ladakh",
    provider: "AICTE / Govt. of India",
    location: "India",
    amount: "Up to ₹3,00,000 / year",
    deadline: "Sep 15, 2025",
    matchScore: 87,
    tags: ["Government", "J&K", "Undergraduate"],
    isPremium: false,
    description: "Prime Minister’s Special Scholarship Scheme (PMSSS) to support students of Jammu & Kashmir and Ladakh to pursue undergraduate studies outside the Union Territories.",
    url: "https://www.aicte-india.org/pmsss"
  },
  {
    id: 22,
    type: "government",
    status: "open",
    title: "INSPIRE Scholarship for Higher Education",
    provider: "DST, Govt. of India",
    location: "India",
    amount: "₹80,000 / year",
    deadline: "Dec 31, 2026",
    matchScore: 90,
    tags: ["Government", "STEM", "Research"],
    isPremium: false,
    description: "Innovation in Science Pursuit for Inspired Research (INSPIRE) is an innovative programme sponsored and managed by the Department of Science & Technology for attraction of talent to Science.",
    url: "https://online-inspire.gov.in/"
  },
  {
    id: 23,
    type: "government",
    status: "closing_soon",
    title: "Fulbright-Nehru Master's Fellowships",
    provider: "USIEF (Govt. Funded)",
    location: "USA",
    amount: "Full Ride + Health Cover",
    deadline: "May 15, 2026",
    matchScore: 84,
    tags: ["Government", "Post-Grad", "International"],
    isPremium: true,
    description: "The Fulbright-Nehru Master’s Fellowships are designed for outstanding Indians to pursue a master’s degree program at select U.S. colleges and universities.",
    url: "https://www.usief.org.in/Fulbright-Nehru-Masters-Fellowships.aspx"
  },
  {
    id: 24,
    type: "government",
    status: "open",
    title: "KVPY (Kishore Vaigyanik Protsahan Yojana)",
    provider: "DST, Govt. of India",
    location: "India",
    amount: "₹5,000 - ₹7,000/month",
    deadline: "Aug 30, 2026",
    matchScore: 89,
    tags: ["Government", "STEM", "Pure Sciences"],
    isPremium: false,
    description: "National Fellowship Programme in Basic Sciences to encourage students to take up research careers in these areas. (Government of India)",
    url: "http://kvpy.iisc.ernet.in/"
  }
];

export default function ScholarshipsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Top Matches");
  const [selectedScholarship, setSelectedScholarship] = useState<any>(null);
  const [regionType, setRegionType] = useState<"foreign" | "indian" | "government">("foreign");
  const [hideClosed, setHideClosed] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);

  // Simulate re-calculating matches when filters change
  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => setIsCalculating(false), 800);
    return () => clearTimeout(timer);
  }, [hideClosed, activeFilter, regionType]);

  const filters = ["Top Matches", "Closing Soon", "STEM", "Diversity & Inclusion", "Full Ride", "Undergraduate", "Post-Grad"];

  // Logic: "Suitability Algorithm" 
  const filteredScholarships = mockScholarships.filter(s => {
    // 1. Availability Filter (Algorithm Step 1)
    if (hideClosed && s.status === "closed") return false;

    // 2. Region/Type filter
    if (s.type !== regionType) return false;

    // 3. Search query filter (Keyword Match)
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;

    // 4. Category/Profile Suitability Filter (Algorithm Step 2)
    if (activeFilter === "Top Matches") return s.matchScore >= 85; // Focus on high-intent matches
    if (activeFilter === "Closing Soon") return s.deadline.includes("2026") || s.status === "closing_soon";
    if (activeFilter === "STEM") return s.tags.includes("STEM") || s.tags.includes("Computer Science") || s.tags.includes("AI/ML") || s.tags.includes("Cybersecurity") || s.tags.includes("Software Engineering") || s.tags.includes("Technology") || s.tags.includes("Pure Sciences");
    if (activeFilter === "Diversity & Inclusion") return s.tags.includes("Diversity") || s.tags.includes("Women");
    if (activeFilter === "Full Ride") return s.amount.toLowerCase().includes("full");
    if (activeFilter === "Undergraduate") return s.tags.includes("Undergrad") || s.tags.includes("Undergraduate") || s.tags.includes("Undergrad/Grad");
    if (activeFilter === "Post-Grad") return s.tags.includes("Post-Grad") || s.tags.includes("PhD") || s.tags.includes("Graduate") || s.tags.includes("Master's");
    
    return true;
  }).sort((a, b) => b.matchScore - a.matchScore);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedScholarship) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedScholarship]);

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#13121C] text-white selection:bg-[#A05CFF]/30 font-sans relative">
        <div className="relative z-10 flex min-h-screen">
          <DashboardSidebar />

          <main className="flex-1 min-h-screen flex flex-col pl-[260px] pb-10">
            {/* Header */}
            <header className="h-[100px] px-10 flex items-center justify-between sticky top-0 z-40 bg-[#13121C]/80 backdrop-blur-xl border-b border-[#ffffff05]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ffffff05] border border-[#ffffff10] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-[#A05CFF]" />
                </div>
                <h1 className="text-[22px] font-medium text-white/90">Scholarship Hub</h1>
              </div>
              
              <div className="flex items-center gap-5">
                <button 
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-[#ffffff05] border border-[#ffffff10] text-[13px] font-medium text-white/90 hover:bg-[#ffffff10] transition-colors shadow-sm"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                </button>
              </div>
            </header>

            <div className="flex flex-1">
              {/* Type Selection Sidebar (Inner) */}
              <div className="w-[100px] border-r border-[#ffffff05] flex flex-col items-center py-10 gap-8">
                <button 
                  onClick={() => setRegionType("foreign")}
                  className={cn(
                    "w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group",
                    regionType === "foreign" ? "bg-[#A05CFF] text-white shadow-[0_0_20px_rgba(160,92,255,0.4)]" : "bg-[#ffffff05] text-[#8E8B9F] hover:bg-[#ffffff10]"
                  )}
                >
                  <Globe className={cn("w-5 h-5", regionType === "foreign" ? "text-white" : "group-hover:text-white")} />
                  <span className="text-[9px] font-bold uppercase tracking-tighter">Global</span>
                </button>

                <button 
                  onClick={() => setRegionType("indian")}
                  className={cn(
                    "w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group",
                    regionType === "indian" ? "bg-[#10b981] text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "bg-[#ffffff05] text-[#8E8B9F] hover:bg-[#ffffff10]"
                  )}
                >
                  <Flag className={cn("w-5 h-5", regionType === "indian" ? "text-white" : "group-hover:text-white")} />
                  <span className="text-[9px] font-bold uppercase tracking-tighter">Indian</span>
                </button>

                <button 
                  onClick={() => setRegionType("government")}
                  className={cn(
                    "w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group",
                    regionType === "government" ? "bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]" : "bg-[#ffffff05] text-[#8E8B9F] hover:bg-[#ffffff10]"
                  )}
                >
                  <ShieldCheck className={cn("w-5 h-5", regionType === "government" ? "text-white" : "group-hover:text-white")} />
                  <span className="text-[9px] font-bold uppercase tracking-tighter">Govt.</span>
                </button>

                <div className="mt-auto flex flex-col items-center gap-4 text-[#8E8B9F]">
                  <div className="w-px h-20 bg-gradient-to-b from-transparent via-[#ffffff10] to-transparent" />
                  <p className="text-[10px] font-bold uppercase vertical-text tracking-[0.2em] opacity-30 mt-4 cursor-default">HUB TYPES</p>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 px-10 pt-8 overflow-y-auto">
                {/* Top Banner / Search */}
                <div className="mb-10 bg-[#1A1926] rounded-[24px] border border-[#ffffff05] p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-[#A05CFF]/10 to-transparent blur-[80px] pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A05CFF]/10 border border-[#A05CFF]/20 text-[#A05CFF] text-[11px] font-bold uppercase tracking-wider mb-4">
                        <Zap className="w-3.5 h-3.5" />
                        <span>AI Match Engine</span>
                      </div>
                      <h2 className="text-[28px] font-semibold tracking-tight text-white/95 mb-2 lowercase">
                        {regionType === "foreign" ? "Global funding hub" : regionType === "indian" ? "Indian educational grants" : "Government schemes & portals"}
                      </h2>
                      <p className="text-[#8E8B9F] text-sm leading-relaxed">
                        {regionType === "foreign" 
                          ? "Access top international opportunities curated for your academic profile."
                          : regionType === "indian" ? "Explore premium grants and scholarships within the Indian ecosystem."
                          : "Navigate through official central and state government scholarship schemes."}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <div className="relative group min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8B9F] group-focus-within:text-[#A05CFF] transition-colors" />
                        <input 
                          type="text" 
                          placeholder="Search programs..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-[#ffffff03] border border-[#ffffff10] text-[#8E8B9F] rounded-2xl pl-11 pr-4 py-3.5 text-[14px] focus:outline-none focus:border-[#A05CFF]/50 focus:bg-[#ffffff08] transition-all placeholder:text-[#8E8B9F]/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filtering Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-[#ffffff05] pb-6">
                  <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2 md:pb-0">
                    {filters.map((filter) => (
                      <button 
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all",
                          activeFilter === filter 
                            ? "bg-[#A05CFF]/10 text-[#A05CFF] border border-[#A05CFF]/20" 
                            : "bg-[#ffffff05] text-[#8E8B9F] border border-[#ffffff10] hover:bg-[#ffffff0a] hover:text-white/90"
                        )}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    {isCalculating && (
                      <div className="flex items-center gap-2 text-emerald-400 animate-pulse">
                        <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                        <span className="text-[11px] font-bold uppercase tracking-widest">Optimizing...</span>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => setHideClosed(!hideClosed)}
                      className="group flex items-center gap-3 px-4 py-2 rounded-xl bg-[#ffffff05] border border-[#ffffff10] hover:bg-[#ffffff0a] transition-all"
                    >
                      <div className="text-[12px] font-medium text-[#8E8B9F] group-hover:text-white transition-colors">Hide Closed</div>
                      <div className={cn(
                        "w-9 h-5 rounded-full p-1 transition-all relative overflow-hidden",
                        hideClosed ? "bg-[#10b981]" : "bg-[#ffffff10]"
                      )}>
                        <motion.div 
                          animate={{ x: hideClosed ? 16 : 0 }}
                          className="w-3 h-3 bg-white rounded-full shadow-sm relative z-10"
                        />
                        {hideClosed && <div className="absolute inset-0 bg-emerald-500/20 blur-[4px]" />}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                  <AnimatePresence mode="popLayout">
                    {filteredScholarships.map(scholarship => (
                      <ScholarshipCard 
                        key={scholarship.id} 
                        {...scholarship} 
                        onClick={() => setSelectedScholarship(scholarship)}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {filteredScholarships.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-16 rounded-[24px] bg-[#1A1926] border border-[#ffffff05] text-center mb-10">
                    <div className="w-16 h-16 rounded-full bg-[#ffffff05] flex items-center justify-center mb-6">
                      <Search className="w-8 h-8 text-[#8E8B9F]" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">No programs found</h3>
                    <p className="text-[#8E8B9F] max-w-md">
                      Try switching Hub categories or adjust filters.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>

        {/* Modal Overlay Component */}
        <AnimatePresence>
          {selectedScholarship && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScholarship(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10 bg-[#13121C]/80 backdrop-blur-md overflow-y-auto"
            >
              <ScholarshipModal 
                scholarship={selectedScholarship} 
                onClose={() => setSelectedScholarship(null)} 
                allScholarships={mockScholarships}
                onSelect={(s: any) => setSelectedScholarship(s)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AIChatBot />
      </div>
    </SmoothScroll>
  );
}

// ─── Scholarship Modal Component ────────────────────────────────────────────────

function ScholarshipModal({ scholarship, onClose, allScholarships, onSelect }: { scholarship: any; onClose: () => void; allScholarships: any[]; onSelect: (s: any) => void }) {
  const chance = scholarship.matchScore || 0;
  const isClosed = scholarship.status === "closed";
  
  const color = 
    isClosed ? "#4b5563" :
    chance >= 80 ? "#10b981" : 
    chance >= 60 ? "#00f0ff" : 
    chance >= 40 ? "#f59e0b" : 
    "#ef4444";                 

  const label = 
    isClosed ? "Applications Closed" :
    chance >= 90 ? "Premium Match" :
    chance >= 80 ? "Optimal Fit" :
    chance >= 60 ? "Strong Match" :
    "Emerging Fit";

  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (chance / 100) * circ;

  // Find alternatives if closed
  const alternatives = allScholarships
    .filter(s => s.id !== scholarship.id && s.status !== "closed")
    .filter(s => s.tags.some((t: string) => scholarship.tags.includes(t)))
    .slice(0, 3);

  return (
    <motion.div
      layoutId={`scholarship-${scholarship.id}`}
      onClick={(e) => e.stopPropagation()}
      className="bg-[#1A1926] w-full max-w-4xl border border-[#ffffff15] rounded-[32px] shadow-2xl relative flex flex-col md:flex-row overflow-hidden my-auto max-h-[90vh]"
    >
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center border border-white/10 transition-colors z-10"
      >
        <X className="w-5 h-5 text-gray-400" />
      </button>

      {/* Left Column: Details */}
      <div className="flex-1 p-8 md:p-10 overflow-y-auto custom-scrollbar border-r border-[#ffffff0a]">
        <div className="pr-12 md:pr-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A05CFF]/10 border border-[#A05CFF]/20 text-[#A05CFF] text-[11px] font-bold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{scholarship.provider}</span>
            </div>
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
              scholarship.type === "foreign" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : 
              scholarship.type === "indian" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
              "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            )}>
              {scholarship.type === "foreign" ? <Globe size={13} /> : scholarship.type === "indian" ? <Flag size={13} /> : <ShieldCheck size={13} />}
              <span>{scholarship.type === "foreign" ? "Global" : scholarship.type === "indian" ? "Indian" : "Government"}</span>
            </div>
            {isClosed && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-[11px] font-bold uppercase tracking-wider">
                <AlertCircle size={13} />
                <span>Expired</span>
              </div>
            )}
          </div>
          
          <h2 className="text-3xl font-semibold leading-tight text-white/95 mb-4">{scholarship.title}</h2>
          
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-[#ffffff05] border border-[#ffffff0a] text-[12px] text-gray-400 font-medium">
              <MapPin size={14} className="text-gray-500" />
              {scholarship.location}
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-emerald-500/5 border border-emerald-500/10 text-[12px] text-emerald-400 font-medium">
              <DollarSign size={14} className="text-emerald-500/70" />
              {scholarship.amount}
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-[12px] font-medium border ${isClosed ? "bg-red-500/5 border-red-500/10 text-red-400" : scholarship.status === 'closing_soon' ? "bg-amber-500/5 border-amber-500/10 text-amber-500" : "bg-[#ffffff05] border-[#ffffff0a] text-gray-400"}`}>
              <Clock size={14} className={isClosed ? "text-red-500/70" : "text-gray-500"} />
              {isClosed ? `Ended: ${scholarship.deadline}` : `Deadline: ${scholarship.deadline}`}
            </div>
          </div>

          {isClosed ? (
            <div className="mb-10">
              <div className="p-6 rounded-[24px] bg-amber-500/5 border border-amber-500/10 mb-8">
                <h3 className="text-amber-500 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <AlertCircle size={16} /> Notification
                </h3>
                <p className="text-gray-400 text-[13px] leading-relaxed">
                  This program has already closed for the current academic session. However, Intellect has identified highly relevant alternatives that are currently <strong>OPEN</strong> and match your profile.
                </p>
              </div>

              <h3 className="text-white/90 text-sm font-bold uppercase tracking-wider mb-6">Active Alternatives For You</h3>
              <div className="space-y-4">
                {alternatives.map(alt => (
                  <button
                    key={alt.id}
                    onClick={() => onSelect(alt)}
                    className="w-full flex items-center justify-between p-5 rounded-[20px] bg-[#ffffff03] border border-[#ffffff05] hover:border-[#A05CFF]/30 hover:bg-[#ffffff05] transition-all group group"
                  >
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-[#A05CFF]/10 flex items-center justify-center text-[#A05CFF]">
                          <Zap size={18} />
                       </div>
                       <div className="text-left">
                          <p className="text-white text-[14px] font-medium group-hover:text-[#A05CFF] transition-colors">{alt.title}</p>
                          <p className="text-gray-500 text-[12px]">{alt.amount} • Ends {alt.deadline}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                          {alt.matchScore}% Match
                       </div>
                       <ArrowUpRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-medium text-white/90 mb-3">Program Details</h3>
              <div className="text-[14px] text-gray-400 leading-relaxed space-y-4 mb-8">
                <p>{scholarship.description || "No detailed description available for this program."}</p>
              </div>

              <h4 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-4">Tags & Categories</h4>
              <div className="flex flex-wrap gap-2 mb-8">
                {scholarship.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 rounded-[8px] bg-[#ffffff05] text-[#8E8B9F] border border-[#ffffff10] text-[12px] font-medium">
                    {tag}
                  </span>
                ))}
                {scholarship.isPremium && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-[8px] bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-500 border border-amber-500/20 text-[12px] font-bold">
                    <Award className="w-3.5 h-3.5" /> Anchor Premium
                  </span>
                )}
              </div>

              <div className="p-6 rounded-2xl bg-[#ffffff03] border border-[#ffffff0a]">
                <p className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#A05CFF]" />
                  Intelligence Insight
                </p>
                <p className="text-[13px] text-gray-400 leading-relaxed">
                  Based on your Skill Vector, you have a {chance}% alignment with this program's requirements. 
                  {scholarship.type === "government" ? " Government schemes often prioritize socio-economic factors alongside merit." : " Your research background and technical skills make you a top candidate for this award."}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Column: Analytics & Apply */}
      <div className="w-full md:w-[320px] bg-[#ffffff03] p-8 md:p-10 flex flex-col items-center">
        <h3 className="text-sm font-medium text-white/80 w-full mb-6">Profile Match Analysis</h3>
        
        {/* Main Ring */}
        <div className="relative flex items-center justify-center mb-8 w-[140px] h-[140px]">
          <svg width="140" height="140" className="absolute top-0 left-0" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <motion.circle
              cx="70" cy="70" r={r} fill="none"
              stroke={color} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circ}
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
              style={{ filter: `drop-shadow(0 0 8px ${color})` }}
            />
          </svg>
          <div className="flex flex-col items-center justify-center z-10 p-2">
            <span className="text-3xl font-black leading-none" style={{ color }}>{isClosed ? "—" : `${chance}%`}</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mt-1 whitespace-nowrap">Match Index</span>
          </div>
        </div>
        
        <div className={cn(
          "w-full px-4 py-2 border rounded-[12px] mb-8 text-center",
          isClosed ? "bg-red-500/5 border-red-500/10 text-red-400" : "bg-[#ffffff03] border-[#ffffff0a] text-white/90"
        )}>
           <span className="text-[13px] font-semibold">{label}</span>
        </div>

        {/* Stats */}
        <div className="w-full space-y-4 mb-auto">
          <div className="flex justify-between items-center pb-3 border-b border-[#ffffff0a]">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-gray-500" />
              <span className="text-[13px] text-gray-400">Portal Type</span>
            </div>
            <span className="text-[14px] font-medium text-white">{scholarship.type === "government" ? "Official" : "Private"}</span>
          </div>
          
          <div className="flex justify-between items-center pb-3 border-b border-[#ffffff0a]">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500/70" />
              <span className="text-[13px] text-gray-400">Award Type</span>
            </div>
            <span className="text-[14px] font-medium text-emerald-400">Financial Aid</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-[#ffffff0a]">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500/70" />
              <span className="text-[13px] text-gray-400">Complexity</span>
            </div>
            <span className="text-[14px] font-medium text-amber-400">{scholarship.type === "government" ? "High" : "Medium"}</span>
          </div>
        </div>

        <button 
          disabled={isClosed}
          onClick={() => scholarship.url && window.open(scholarship.url, "_blank")}
          className={cn(
            "w-full mt-8 py-4 rounded-[16px] text-[14px] font-bold shadow-lg transition-all flex items-center justify-center gap-2",
            isClosed 
              ? "bg-[#ffffff05] text-white/20 border border-[#ffffff10] cursor-not-allowed" 
              : "bg-gradient-to-r from-[#A05CFF] to-[#6035EE] text-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(160,92,255,0.4)]"
          )}
        >
          {isClosed ? "Submissions Closed" : "Check Eligibility"}
          {!isClosed && <ExternalLink className="w-4 h-4" />}
        </button>
      </div>
    </motion.div>
  );
}

