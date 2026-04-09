"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { MatchCard } from "@/components/MatchCard";
import { PointsTable } from "@/components/PointsTable";
import { AdBlock } from "@/components/AdBlock";
import predictionsData from "@/data/predictions.json";
import { TEAM_COLORS, TEAM_ABBREVIATIONS } from "@/lib/constants";
import { TrendingUp, Award, Zap, Target, Activity, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { getLiveScores } from "@/app/actions/live-score";

export default function Home() {
  const { model_accuracy, points_table, matches, top_batters, top_bowlers } = predictionsData;
  const [lastSync, setLastSync] = useState<string>("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [prediction, setPrediction] = useState<any>(null);
  const [liveScores, setLiveScores] = useState<any[]>([]);

  const fetchLiveInfo = async () => {
    const scores = await getLiveScores();
    setLiveScores(scores);
    setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const findLiveData = (match: any) => {
    return liveScores.find(ls => 
      ls.match_title.toLowerCase().includes(TEAM_ABBREVIATIONS[match.home_team].toLowerCase()) &&
      ls.match_title.toLowerCase().includes(TEAM_ABBREVIATIONS[match.away_team].toLowerCase())
    );
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setPrediction(data.prediction);
        setTimeout(() => setStatus("idle"), 8000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchLiveInfo();
    const interval = setInterval(fetchLiveInfo, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  // Determine today's date for dynamic filtering
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Process matches with dynamic status
  const processedMatches = matches.map((m: any) => {
    const mDate = new Date(m.date);
    const mDay = new Date(mDate.getFullYear(), mDate.getMonth(), mDate.getDate());
    
    // A match is completed if marked so or if the date has passed
    const isCompleted = m.is_completed || mDay < today;
    // A match is today if it matches current date
    const isToday = !m.is_completed && mDay.getTime() === today.getTime();
    
    return { 
      ...m, 
      is_completed: isCompleted, 
      is_today: isToday 
    };
  });

  // Filter for upcoming and completed matches
  // Upcoming includes today and future matches that are not completed
  const upcomingMatches = processedMatches
    .filter((m: any) => !m.is_completed || m.is_today)
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);

  // Completed includes past matches
  const completedMatches = processedMatches
    .filter((m: any) => m.is_completed && !m.is_today)
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

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
                    <div className="bg-slate-800/40 border border-white/5 rounded-xl px-5 py-3 flex flex-col relative overflow-hidden group/sync">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Last Sync</span>
                        <Activity size={10} className="text-emerald-500 animate-pulse" />
                      </div>
                      <span className="text-2xl font-black text-white">{lastSync || "..."}</span>
                      <div className="absolute bottom-0 left-0 h-0.5 bg-blue-500 w-0 group-hover/sync:w-full transition-all duration-1000"></div>
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
                <a href="/schedule" className="text-[10px] font-black uppercase text-blue-400 hover:text-blue-300 transition-colors tracking-widest">View Full Schedule →</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingMatches.map((match: any, idx: number) => (
                  <MatchCard key={match.match_no} match={match} index={idx} liveData={findLiveData(match)} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Newsletter Ad Simulation */}
            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-6 relative overflow-hidden shadow-2xl border border-white/10 group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                < Award size={80} />
              </div>
              
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    key="success"
                    className="relative z-10"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                        <CheckCircle size={20} />
                      </div>
                      <h4 className="text-xl font-black text-white leading-none italic uppercase tracking-tighter">Prediction Delivered!</h4>
                    </div>
                    {prediction ? (
                      <div className="bg-white/10 rounded-xl p-4 border border-white/5 mb-4">
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-2">Today's AI Intel:</p>
                        <p className="text-xs text-white font-black uppercase">
                          {prediction.home_team} vs {prediction.away_team}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">Winner: <span className="text-emerald-400">{prediction.prediction}</span> ({prediction.confidence}%)</p>
                      </div>
                    ) : (
                      <p className="text-xs text-blue-100/70 mb-4 font-medium italic">No matches scheduled for today. We'll send tomorrow's prediction early!</p>
                    )}
                    <p className="text-[10px] text-slate-400 font-medium">Check your inbox for the full breakdown.</p>
                  </motion.div>
                ) : (
                  <motion.form 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key="form"
                    onSubmit={handleSubscribe} 
                    className="relative z-10"
                  >
                    <h4 className="text-lg font-black text-white mb-2 leading-tight uppercase italic tracking-tighter">Master the IPL League.</h4>
                    <p className="text-xs text-blue-100/70 mb-4 font-medium leading-relaxed">Join 50k+ players receiving our AI predictions directly in their inbox every morning.</p>
                    <div className="space-y-2">
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email..." 
                        className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
                      />
                      <button 
                        disabled={status === "loading"}
                        className="w-full bg-white text-blue-900 font-black uppercase text-[10px] tracking-[0.2em] py-4 rounded-lg hover:bg-slate-100 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {status === "loading" ? "Processing..." : "Join Predictors Club"}
                      </button>
                    </div>
                    <p className="text-[9px] text-white/40 mt-4 text-center uppercase tracking-widest font-bold">Free for eternity. No spam.</p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Stat Cards */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Award size={16} className="text-blue-500" /> Season Leaders
                </h4>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Live Feed</span>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest">Orange Cap Race</p>
                    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">Runs tracked</span>
                  </div>
                  <div className="space-y-4">
                    {top_batters.slice(0, 5).map((batter: any, idx: number) => (
                      <div key={batter.name} className="flex items-center justify-between group cursor-help">
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "text-xs font-black w-5 h-5 flex items-center justify-center rounded",
                            idx === 0 ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-slate-600 bg-slate-800/50"
                          )}>{idx + 1}</span>
                          <div>
                            <p className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{batter.name}</p>
                            <p className="text-[9px] text-slate-500 uppercase font-bold">{TEAM_ABBREVIATIONS[batter.team]}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-white leading-none block">{batter.runs}</span>
                          <span className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter">SR {batter.sr}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-8 border-t border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] text-purple-400 uppercase font-black tracking-widest">Purple Cap Race</p>
                    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">Wickets tracked</span>
                  </div>
                  <div className="space-y-4">
                    {top_bowlers.slice(0, 5).map((bowler: any, idx: number) => (
                      <div key={bowler.name} className="flex items-center justify-between group cursor-help">
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "text-xs font-black w-5 h-5 flex items-center justify-center rounded",
                            idx === 0 ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-slate-600 bg-slate-800/50"
                          )}>{idx + 1}</span>
                          <div>
                            <p className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{bowler.name}</p>
                            <p className="text-[9px] text-slate-500 uppercase font-bold">{TEAM_ABBREVIATIONS[bowler.team]}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-white leading-none block">{bowler.wickets}</span>
                          <span className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter">ECO {bowler.eco}</span>
                        </div>
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
