"use client";

import React from "react";

const IntellectFooter = () => {
  return (
    <footer className="relative py-20 px-6 border-t border-white/5 bg-background">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16">
        <div className="max-w-xs">
          <div 
            className="text-2xl font-bold tracking-tight text-foreground mb-6"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            INTELLECT
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Revolutionizing career intelligence through AI-powered insight and global roadmap planning.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 flex-1 max-w-2xl">
          <div>
            <h4 className="text-foreground text-xs font-semibold uppercase tracking-widest mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Intelligence</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Roadmaps</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Opportunites</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground text-xs font-semibold uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Journal</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground text-xs font-semibold uppercase tracking-widest mb-6">Social</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Twitter (X)</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between text-xs text-muted-foreground gap-4">
        <div>© 2026 INTELLECT. All rights reserved.</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-foreground transition-colors text-xs">Terms of Service</a>
          <a href="#" className="hover:text-foreground transition-colors text-xs">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default IntellectFooter;
