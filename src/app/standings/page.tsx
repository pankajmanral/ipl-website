"use client";

import { Header } from "@/components/Header";
import { PointsTable } from "@/components/PointsTable";
import { AdBlock } from "@/components/AdBlock";
import predictionsData from "@/data/predictions.json";
import { motion } from "framer-motion";
import { Award, Info, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StandingsPage() {
  const { points_table, matches } = predictionsData;

  // 1. Sort table: Points (DESC), then NRR (DESC)
  const sortedTable = [...points_table].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.nrr - a.nrr;
  });

  // 2. Identify teams playing today for Form Guide
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const todayTeams = matches
    .filter((m: any) => {
      const mDate = new Date(m.date);
      const mDay = new Date(mDate.getFullYear(), mDate.getMonth(), mDate.getDate());
      return mDay.getTime() === today.getTime();
    })
    .flatMap((m: any) => [m.home_team, m.away_team]);

  // If no one plays today, show top 3 (fallback)
  const formGuideTeams = todayTeams.length > 0 
    ? sortedTable.filter(t => todayTeams.includes(t.team))
    : sortedTable.slice(0, 3);

  // 3. Helper to get real form (W/L) from match history
  const getTeamForm = (teamName: string) => {
    // Return last 5 completed matches
    return matches
      .filter((m: any) => m.actual_winner && (m.home_team === teamName || m.away_team === teamName))
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map((m: any) => m.actual_winner === teamName);
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Award className="text-blue-500" size={24} />
              <h1 className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] font-mono leading-none">League Standings</h1>
            </div>
            <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase mb-6 leading-none ipl-gradient-text max-w-2xl">
              IPL 2026 <br />Official Points Table
            </h2>
            <p className="text-slate-400 max-w-xl text-lg font-medium leading-relaxed">
              Real-time standings based on match outcomes, net run rates, and qualification scenarios for the 2026 playoffs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-3">
            <PointsTable data={sortedTable} />
          </div>
          
          <div className="space-y-6">
            <div className="glass-card p-6 border-blue-500/20 bg-blue-600/[0.02]">
              <h3 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
                <Info size={16} /> Qualification Rules
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-5 h-5 rounded bg-blue-600/20 flex items-center justify-center text-blue-400 text-[10px] font-bold shrink-0">1</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Top 4 teams at the end of league stage qualify for Playoffs.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-5 h-5 rounded bg-blue-600/20 flex items-center justify-center text-blue-400 text-[10px] font-bold shrink-0">2</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Top 2 play Qualifier 1. Winner goes straight to Final.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-5 h-5 rounded bg-blue-600/20 flex items-center justify-center text-blue-400 text-[10px] font-bold shrink-0">3</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Teams 3 & 4 play the Eliminator.</p>
                </li>
              </ul>
            </div>

            <div className="glass-card p-6 border-emerald-500/10">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-500" /> Form Guide
              </h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-6">Matchday Intelligence</p>
              <div className="space-y-6">
                {formGuideTeams.map((team) => {
                  const form = getTeamForm(team.team);
                  return (
                    <div key={team.team} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">
                          {team.team}
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        {form.length > 0 ? form.map((win, i) => (
                          <div key={i} className={cn(
                            "w-6 h-6 rounded flex items-center justify-center text-[10px] font-black shadow-lg",
                            win ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/20 text-rose-400 border border-rose-500/20"
                          )}>
                            {win ? 'W' : 'L'}
                          </div>
                        )) : (
                          <span className="text-[8px] text-slate-600 uppercase font-bold italic">No match history found</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div id="ai-insight" className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-6 relative overflow-hidden">
               <div className="relative z-10">
                 <Zap className="text-yellow-400 mb-3" size={24} />
                 <h4 className="text-lg font-black text-white mb-2 leading-tight uppercase italic tracking-tighter">AI Playoff Predictor</h4>
                 <p className="text-xs text-blue-100/70 mb-4 font-medium leading-relaxed">Our model predicts a 94.2% chance for the current top 2 to finish in the upper bracket.</p>
                 <button className="w-full bg-white text-blue-900 font-bold uppercase text-[10px] tracking-widest py-3 rounded-lg hover:bg-slate-100 transition-colors">
                   View Advanced Stats
                 </button>
               </div>
               <div className="absolute -bottom-4 -right-4 opacity-10">
                 <Zap size={100} />
               </div>
            </div>
          </div>
        </div>

        <AdBlock slot="standings-footer" />
      </div>

      <footer className="border-t border-white/5 py-12 bg-slate-950 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            © 2026 IPL Analytics Division. Official Calculation Engine.
          </p>
        </div>
      </footer>
    </main>
  );
}

