"use client";

import { Header } from "@/components/Header";
import { MatchCard } from "@/components/MatchCard";
import { AdBlock } from "@/components/AdBlock";
import predictionsData from "@/data/predictions.json";
import { useState } from "react";
import { Calendar, Filter, Search, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SchedulePage() {
  const { matches } = predictionsData;
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");
  const [search, setSearch] = useState("");

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const processedMatches = matches.map((m: any) => {
    const mDate = new Date(m.date);
    const mDay = new Date(mDate.getFullYear(), mDate.getMonth(), mDate.getDate());
    const isCompleted = m.is_completed || mDay < today;
    const isToday = !m.is_completed && mDay.getTime() === today.getTime();
    return { ...m, is_completed: isCompleted, is_today: isToday };
  });

  const filteredMatches = processedMatches.filter(m => {
    const matchesFilter = 
      filter === "all" ? true :
      filter === "upcoming" ? (!m.is_completed || m.is_today) :
      m.is_completed;
    
    const matchesSearch = 
      m.home_team.toLowerCase().includes(search.toLowerCase()) ||
      m.away_team.toLowerCase().includes(search.toLowerCase()) ||
      m.venue.toLowerCase().includes(search.toLowerCase());
      
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="text-blue-500" size={24} />
            <h1 className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] font-mono leading-none">Full Season Intel</h1>
          </div>
          <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase mb-6 leading-none ipl-gradient-text max-w-3xl">
            IPL 2026 <br />Match Schedule & AI Odds
          </h2>
          
          <div className="flex flex-col md:flex-row gap-6 mt-10">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text"
                placeholder="Search teams, venues..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
            
            {/* Tabs */}
            <div className="flex bg-slate-900/50 border border-white/5 p-1 rounded-xl shrink-0">
              {[
                { id: "all", label: "All Battles" },
                { id: "upcoming", label: "Upcoming" },
                { id: "completed", label: "Results" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={cn(
                    "px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                    filter === tab.id ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-white"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <AdBlock slot="schedule-top" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((match, idx) => (
              <MatchCard key={match.match_no} match={match} index={idx} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center glass-card border-dashed">
              <Zap className="mx-auto text-slate-700 mb-4" size={48} />
              <p className="text-slate-500 font-bold uppercase tracking-widest">No matches found matching your search</p>
            </div>
          )}
        </div>

        <div className="mt-12">
          <AdBlock slot="schedule-bottom" />
        </div>
      </div>

      <footer className="border-t border-white/5 py-12 bg-slate-950 mt-12 text-center">
         <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            © 2026 IPL Schedule Intelligence Database. All timings in IST.
          </p>
      </footer>
    </main>
  );
}
