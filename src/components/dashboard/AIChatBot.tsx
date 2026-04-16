"use client";

import { useState, Suspense, lazy, useEffect } from "react";
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles,
  User,
  Bot,
  Minimize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";

// Safely import Spline with no SSR
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-white/5 animate-pulse rounded-full" />
});

export function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hi there! I'm your Career Intelligence Assistant. How can I help you with your roadmap or job search today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.id) setUserId(data.user.id);
    });
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = { role: "user", content: input };
    const conversation = [...messages, userMessage];
    
    setMessages(conversation);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          messages: conversation.map(m => ({
            role: m.role === "bot" ? "assistant" : m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to get response from AI");
      }
      
      setMessages(prev => [...prev, { 
        role: "bot", 
        content: data.content 
      }]);
    } catch (error: any) {
      console.error("Chat error details:", error);
      const message = error.message || "Unknown error";
      setMessages(prev => [...prev, { 
        role: "bot", 
        content: `Service Error: ${message}\n\nPlease check your LLM_GATEWAY_API_KEY_1 or GOOGLE_GEMINI_API_KEY in .env.local and restart your server.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-24 right-0 w-[420px] h-[650px] bg-[#0a0a0a]/80 border border-white/10 rounded-[32px] shadow-[0_32px_64px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden backdrop-blur-3xl overscroll-contain"
            data-lenis-prevent
          >
            {/* Header */}
            <div className="p-8 bg-gradient-to-r from-[#00f0ff]/20 to-[#8a2be2]/20 border-b border-white/5 flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00f0ff]/20 to-[#8a2be2]/20 flex items-center justify-center shadow-lg shadow-[#00f0ff]/20 relative overflow-hidden ring-1 ring-white/10">
                  <img src="/images/wall-e.png" className="w-[120%] h-[120%] object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" alt="WALL-E" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">WALL-E Career Guide</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Insight</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white relative z-10"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar relative overscroll-contain" data-lenis-prevent>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,240,255,0.03),transparent_50%)]" />
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={cn(
                    "flex gap-4 max-w-[90%] relative z-10",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-lg transition-transform hover:scale-110 overflow-hidden",
                    msg.role === "user" ? "bg-[#8a2be2]/20 text-[#8a2be2]" : "bg-[#00f0ff]/10"
                  )}>
                    {msg.role === "user" ? <User className="w-5 h-5" /> : <img src="/images/wall-e.png" className="w-full h-full object-cover scale-125 pt-1" alt="Bot" />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-3xl text-[13px] leading-relaxed shadow-xl",
                    msg.role === "user" 
                      ? "bg-white text-black font-bold rounded-tr-none shadow-white/5" 
                      : "bg-white/5 text-gray-300 border border-white/5 rounded-tl-none whitespace-pre-wrap backdrop-blur-xl"
                  )}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-4 max-w-[90%] relative z-10">
                  <div className="w-9 h-9 rounded-xl bg-[#00f0ff]/10 border border-white/10 flex items-center justify-center overflow-hidden">
                    <img src="/images/wall-e.png" className="w-full h-full object-cover scale-125 pt-1" alt="Bot" />
                  </div>
                  <div className="bg-white/5 text-gray-400 p-4 rounded-3xl text-[13px] border border-white/5 rounded-tl-none flex gap-1.5 items-center backdrop-blur-xl">
                    <span className="w-1 h-1 bg-[#00f0ff] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1 h-1 bg-[#00f0ff] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1 h-1 bg-[#00f0ff] rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-8 border-t border-white/5 bg-white/[0.02] space-y-6">
              <div className="flex flex-wrap gap-2">
                 {["Job matches?", "Salary insights", "Roadmap tips"].map(hint => (
                   <button 
                     key={hint}
                     onClick={() => setInput(hint)}
                     disabled={isLoading}
                     className="px-4 py-1.5 glass border-white/5 rounded-full text-[10px] text-gray-500 font-bold uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                   >
                     {hint}
                   </button>
                 ))}
              </div>
              <div className="relative group">
                <input 
                  type="text" 
                  value={input}
                  disabled={isLoading}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={isLoading ? "AI is thinking..." : "Ask your career guide..."}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-6 pr-14 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00f0ff]/30 group-hover:bg-white/10 transition-all disabled:opacity-50 placeholder:text-gray-600"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-white text-black rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all shadow-xl disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed group-active:scale-95"
                >
                  <Send className={cn("w-5 h-5", isLoading && "animate-spin")} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-20 h-20 flex items-center justify-center transition-all duration-500 relative group rounded-[24px] overflow-hidden shadow-2xl",
          isOpen 
            ? "bg-white text-black shadow-white/10" 
            : "bg-[#050505] border border-white/5 shadow-[#00f0ff]/10"
        )}
      >
        <div className={cn("absolute inset-0 flex items-center justify-center transition-all duration-500 z-30", isOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90 pointer-events-none")}>
          <X className="w-8 h-8" />
        </div>
        
        <div className={cn("w-full h-full relative flex items-center justify-center transition-all duration-500", isOpen ? "opacity-0 scale-75 blur-sm" : "opacity-100 scale-100 blur-0")}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/20 to-[#8a2be2]/20 group-hover:from-[#00f0ff]/30 group-hover:to-[#8a2be2]/30 transition-all duration-500" />
          <div className="relative z-10 flex flex-col items-center justify-center p-2">
             <img src="/images/wall-e.png" alt="WALL-E" className="w-[120%] h-[120%] object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
          </div>
        </div>
        
        {/* Notification Badge Removed */}
      </motion.button>
    </div>
  );
}
