import { Header } from "@/components/Header";
import { MatchCard } from "@/components/MatchCard";
import { PointsTable } from "@/components/PointsTable";
import { AdBlock } from "@/components/AdBlock";
import predictionsData from "@/data/predictions.json";
import { TEAM_COLORS, TEAM_ABBREVIATIONS } from "@/lib/constants";
import { TrendingUp, Award, Zap, Target } from "lucide-react";

export default function Home() {
  const { generated_at, model_accuracy, points_table, matches, top_batters, top_bowlers } = predictionsData;

  // Filter for upcoming and completed matches
  const completedMatches = matches.filter((m: any) => m.is_completed).slice(0, 6);
  const upcomingMatches = matches.filter((m: any) => !m.is_completed).slice(0, 6);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Ad Block at Top */}
        <AdBlock slot="top-header" />

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            <div id="ai-model" className="glass-card p-10 relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-700"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-4 leading-none ipl-gradient-text">
                    Next-Gen IPL AI <br />Prediction System
                  </h2>
                  <p className="text-slate-400 max-w-md text-sm leading-relaxed mb-6 font-medium">
                    Our machine learning models analyze 200+ data points including player form, venue stats, and weather patterns to predict every match with pinpoint accuracy.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl px-5 py-3 flex flex-col">
                      <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest leading-none mb-1">Model Accuracy</span>
                      <span className="text-2xl font-black text-white">{model_accuracy}%</span>
                    </div>
                    <div className="bg-slate-800/40 border border-white/5 rounded-xl px-5 py-3 flex flex-col">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Last Updated</span>
                      <span className="text-2xl font-black text-white">{generated_at}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 border-[10px] border-slate-800 rounded-full"></div>
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="86"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeDasharray={2 * Math.PI * 86}
                        strokeDashoffset={2 * Math.PI * 86 * (1 - model_accuracy / 100)}
                        className="text-blue-500/40"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="86"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeDasharray={2 * Math.PI * 86}
                        strokeDashoffset={2 * Math.PI * 86 * (1 - model_accuracy / 100)}
                        strokeLinecap="round"
                        className="text-blue-500 neon-border"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <Target className="text-blue-500 mb-1" size={20} />
                      <span className="text-3xl font-black text-white">{model_accuracy}%</span>
                      <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Precision</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Matches Grid */}
            <div id="matches">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Zap className="text-blue-500" size={20} />
                  <h3 className="text-xl font-black italic tracking-tighter uppercase text-white/90">Upcoming Battles</h3>
                </div>
                <a href="#" className="text-[10px] font-black uppercase text-blue-400 hover:text-blue-300 transition-colors tracking-widest">View Full Schedule →</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingMatches.map((match: any, idx: number) => (
                  <MatchCard key={match.match_no} match={match} index={idx} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Newsletter Ad Simulation */}
            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                < Award size={80} />
              </div>
              <h4 className="text-lg font-black text-white mb-2 leading-tight">Master the IPL League.</h4>
              <p className="text-xs text-blue-100/70 mb-4 font-medium">Join 50k+ players receiving our AI predictions directly in their inbox every morning.</p>
              <div className="space-y-2">
                <input 
                  type="email" 
                  placeholder="Enter your email..." 
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20" 
                />
                <button className="w-full bg-white text-blue-900 font-black uppercase text-xs tracking-widest py-3 rounded-lg hover:bg-white/90 transition-colors">
                  Join Predictors Club
                </button>
              </div>
              <p className="text-[9px] text-white/40 mt-3 text-center uppercase tracking-widest font-bold">Free for eternity. No spam.</p>
            </div>

            {/* Stat Cards */}
            <div className="glass-card p-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <Award size={16} className="text-blue-500" /> Season Leaders
              </h4>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-3">Orange Cap Race</p>
                  <div className="space-y-3">
                    {top_batters.slice(0, 3).map((batter: any, idx: number) => (
                      <div key={batter.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-slate-600 w-4">{idx + 1}</span>
                          <div>
                            <p className="text-xs font-bold text-slate-200">{batter.name}</p>
                            <p className="text-[9px] text-slate-500 uppercase font-bold">{TEAM_ABBREVIATIONS[batter.team]}</p>
                          </div>
                        </div>
                        <span className="text-sm font-black text-white">{batter.runs}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-6 border-t border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-3">Purple Cap Race</p>
                  <div className="space-y-3">
                    {top_bowlers.slice(0, 3).map((bowler: any, idx: number) => (
                      <div key={bowler.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-slate-600 w-4">{idx + 1}</span>
                          <div>
                            <p className="text-xs font-bold text-slate-200">{bowler.name}</p>
                            <p className="text-[9px] text-slate-500 uppercase font-bold">{TEAM_ABBREVIATIONS[bowler.team]}</p>
                          </div>
                        </div>
                        <span className="text-sm font-black text-white">{bowler.wickets}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Full Width Points Table */}
        <div id="standings" className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Award className="text-blue-500" size={20} />
              <h3 className="text-xl font-black italic tracking-tighter uppercase text-white/90">Points Table 2026</h3>
            </div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Live Standings</span>
          </div>
          <PointsTable data={points_table} />
        </div>

        {/* Completed Matches */}
        <div id="results" className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-blue-500" size={20} />
            <h3 className="text-xl font-black italic tracking-tighter uppercase text-white/90">Prediction Accuracy Archive</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedMatches.map((match: any, idx: number) => (
              <MatchCard key={match.match_no} match={match} index={idx} />
            ))}
          </div>
        </div>

        {/* Bottom Ad Block */}
        <AdBlock slot="bottom-footer" />
      </div>

      <footer className="border-t border-white/5 py-12 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
              <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center font-black italic text-white">IPL</div>
              <span className="text-sm font-black italic uppercase tracking-tighter">Prediction AI</span>
            </div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Advertise</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              © 2026 IPL Prediction Engine. Powered by Advanced Neural Networks.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
