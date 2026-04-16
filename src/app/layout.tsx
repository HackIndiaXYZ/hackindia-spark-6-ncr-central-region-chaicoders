import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Intellect | We build intelligent futures",
  description: "AI-powered career guidance, global roadmaps, and personalized growth paths",
};

import GlobalTransitionOverlay from "@/components/GlobalTransitionOverlay";
import CursorGlow from "@/components/CursorGlow";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth antialiased dark`}>
      <body className="min-h-full font-sans bg-[#050505] text-[#EDEDED] relative selection:bg-purple-500/30 overflow-x-hidden">
        <GlobalTransitionOverlay />
        <CursorGlow />
        {/* Subtle noise pattern overlay */}
        <div 
          className="fixed inset-0 z-[100] pointer-events-none opacity-[0.02] mix-blend-overlay" 
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' 
          }}
        ></div>
        
        {/* Cursor Glow Effect (simplified, implemented in page components via Framer Motion) */}
        {children}
      </body>
    </html>
  );
}
