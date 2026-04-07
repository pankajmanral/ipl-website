"use client";

import { TEAM_COLORS, TEAM_ABBREVIATIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center font-black text-xl italic text-white shadow-lg shadow-blue-500/20">
            IPL
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter leading-tight uppercase ipl-gradient-text">2026 Prediction AI</h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase -mt-1">Real-time Insights</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Matches", href: "/#matches" },
            { label: "Archives", href: "/#results" },
            { label: "Standings", href: "/#standings" },
            { label: "News", href: "/news" },
          ].map((item) => (
            <a 
              key={item.label} 
              href={item.href} 
              className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
