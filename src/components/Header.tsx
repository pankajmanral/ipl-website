"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Schedule", href: "/schedule" },
    { label: "Standings", href: "/standings" },
    { label: "News", href: "/news" },
  ];

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-white/5 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-4 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center font-black text-xl italic text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            IPL
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter leading-tight uppercase ipl-gradient-text">Prediction AI</h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase -mt-1">Season 2026</p>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <a 
              key={item.label} 
              href={item.href} 
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all hover:translate-y-[-1px]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/5 bg-slate-950 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-6">
              {navLinks.map((item) => (
                <a 
                  key={item.label} 
                  href={item.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
