"use client";

import { motion } from "framer-motion";
import { ArrowRight, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative pt-32 pb-12 overflow-hidden bg-transparent border-t border-white/5">
      {/* Background Atmosphere */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

          {/* Brand & Mission */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-serif text-white tracking-tighter mb-6">Intellect</h2>
              <p className="text-gray-400 font-light max-w-md leading-relaxed text-lg">
                The first AI-powered intelligence system designed to manage your entire global career trajectory — from student to professional.
              </p>
            </motion.div>

            <div className="flex gap-4">
              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-6">Platform</h4>
            <ul className="space-y-4">
              {["Career Engine", "University Roadmap", "Scholarships", "Job Market"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-500 hover:text-purple-400 transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h4 className="text-white font-medium mb-6">Stay Intelligence</h4>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-500 font-light">
                Get the latest global career insights and visa updates.
              </p>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-5 text-sm outline-none focus:border-purple-500/50 transition-colors"
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs text-gray-600 font-light">
            © {currentYear} Intellect Career Intelligence. All rights reserved.
          </div>
          <div className="flex gap-8">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a key={item} href="#" className="text-xs text-gray-600 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
