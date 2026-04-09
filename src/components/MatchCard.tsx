import { useEffect, useState } from "react";
import { TEAM_COLORS, TEAM_ABBREVIATIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Clock, MapPin, Activity, X, Info, ChevronRight, Zap, Users } from "lucide-react";
import { getMatchScoreboard, getTeamPlayers } from "@/app/actions/live-score";
import predictionsData from "@/data/predictions.json";

interface MatchCardProps {
  match: any;
  index: number;
  liveData?: {
    match_id: string;
    match_title: string;
    status: string;
  };
}

export function MatchCard({ match, index, liveData }: MatchCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [scoreboard, setScoreboard] = useState<any>(null);
  const [homePlayers, setHomePlayers] = useState<any[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"briefing" | "scoreboard" | "players">("briefing");

  const isCorrect = match.prediction_correct;
  const isCompleted = match.is_completed;
  const isLive = liveData; // Only show as 'Live' if we have actual live data from the API

  const homeColor = TEAM_COLORS[match.home_team]?.primary || "#888";
  const awayColor = TEAM_COLORS[match.away_team]?.primary || "#888";

  const fetchExtras = async () => {
    if (!showModal) return;
    
    // Fetch detailed scoreboard if live
    if (liveData?.match_id) {
       const board = await getMatchScoreboard(liveData.match_id);
       setScoreboard(board);
    }

    // Fetch players using RapidIDs from predictions.json
    const squads: any = predictionsData.squads;
    const homeRapidId = squads[match.home_team]?.rapid_id;
    const awayRapidId = squads[match.away_team]?.rapid_id;

    if (homeRapidId) {
      const p = await getTeamPlayers(homeRapidId);
      setHomePlayers(p);
    }
    if (awayRapidId) {
      const p = await getTeamPlayers(awayRapidId);
      setAwayPlayers(p);
    }
  };

  useEffect(() => {
    if (showModal) fetchExtras();
  }, [showModal]);

  // Formatted date logic
  const displayDate = match.is_today ? "Today" : match.date;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        onClick={() => setShowModal(true)}
        className="glass-card p-6 overflow-hidden relative group hover:ring-2 hover:ring-blue-500/20 cursor-pointer transition-all duration-300 active:scale-[0.98]"
      >
        <div className="absolute top-0 left-0 p-3">
          <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
            MATCH: #{match.match_no}
          </span>
        </div>

        <div className="absolute top-0 right-0 p-3 flex gap-2">
          {isCompleted ? (
            <span className={cn(
              "text-[9px] px-3 py-1 rounded-full uppercase font-black tracking-widest outline outline-1 outline-offset-1",
              isCorrect ? "bg-emerald-500/10 text-emerald-400 outline-emerald-500/30" : "bg-rose-500/10 text-rose-400 outline-rose-500/30"
            )}>
              {isCorrect ? "Settled" : "Settled"}
            </span>
          ) : isLive && liveData ? (
            <span className="bg-red-500 text-white text-[9px] px-3 py-1 rounded-full uppercase font-black tracking-widest animate-pulse flex items-center gap-1.5 shadow-lg shadow-red-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              Live Now
            </span>
          ) : (
            <span className="bg-slate-800/80 text-slate-400 text-[9px] px-3 py-1 rounded-full uppercase font-black tracking-widest border border-white/5">
              {displayDate}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center mb-8 mt-5">
          <div className="flex flex-col items-center flex-1">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black italic tracking-tighter mb-3 shadow-2xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110"
              style={{ backgroundColor: `${homeColor}20`, color: homeColor, border: `1px solid ${homeColor}40` }}
            >
              {TEAM_ABBREVIATIONS[match.home_team]}
            </div>
            <span className="text-[10px] font-black text-center text-slate-500 uppercase tracking-widest">
              {match.home_team}
            </span>
            {isCompleted && match.home_score && (
              <span className="text-xl font-black text-white mt-2 font-mono">{match.home_score}</span>
            )}
          </div>

          <div className="flex flex-col items-center px-4">
            <span className="text-sm font-black text-slate-800 italic group-hover:text-slate-600 transition-colors">VS</span>
          </div>

          <div className="flex flex-col items-center flex-1">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black italic tracking-tighter mb-3 shadow-2xl transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110"
              style={{ backgroundColor: `${awayColor}20`, color: awayColor, border: `1px solid ${awayColor}40` }}
            >
              {TEAM_ABBREVIATIONS[match.away_team]}
            </div>
            <span className="text-[10px] font-black text-center text-slate-500 uppercase tracking-widest">
              {match.away_team}
            </span>
            {isCompleted && match.away_score && (
              <span className="text-xl font-black text-white mt-2 font-mono">{match.away_score}</span>
            )}
          </div>
        </div>

        {isLive && liveData ? (
          <div className="mb-6 p-4 bg-red-500/5 rounded-xl border border-red-500/10 shadow-inner group-hover:bg-red-500/10 transition-colors">
            <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-1.5 flex items-center gap-2">
              <Activity size={10} className="animate-pulse" /> Real-time Intel
            </p>
            <p className="text-sm font-black text-white leading-tight mb-1">{liveData.match_title}</p>
            <p className="text-[10px] text-slate-500 font-bold italic">{liveData.status}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              <MapPin size={12} className="text-blue-500" />
              <span className="truncate">{match.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest justify-end">
              <Clock size={12} className="text-blue-500" />
              <span>{match.time_ist}</span>
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Confidence Score</p>
              <span className="text-[10px] font-black text-blue-400">{match.confidence}%</span>
            </div>
            <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${match.confidence}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
              />
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-700 ml-4 group-hover:text-blue-500 transition-colors" />
        </div>
      </motion.div>

      {/* Detailed Match Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                    <Zap size={18} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Match Intelligence Hub</h3>
                    <div className="flex gap-4 mt-2">
                       <button 
                         onClick={() => setActiveTab("briefing")}
                         className={cn("text-[9px] font-black uppercase tracking-widest transition-colors", activeTab === "briefing" ? "text-white" : "text-slate-500 hover:text-white")}
                       >
                         Briefing
                       </button>
                       <button 
                         onClick={() => setActiveTab("scoreboard")}
                         className={cn("text-[9px] font-black uppercase tracking-widest transition-colors", activeTab === "scoreboard" ? "text-white" : "text-slate-500 hover:text-white")}
                       >
                         Scoreboard
                       </button>
                       <button 
                         onClick={() => setActiveTab("players")}
                         className={cn("text-[9px] font-black uppercase tracking-widest transition-colors", activeTab === "players" ? "text-white" : "text-slate-500 hover:text-white")}
                       >
                         Rosters
                       </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {activeTab === "briefing" && (
                  <>
                    {/* Score Summary */}
                    <div className="flex items-center justify-around gap-4 bg-slate-800/30 p-8 rounded-2xl border border-white/5">
                      <div className="text-center group">
                        <p className="text-3xl md:text-5xl font-black italic tracking-tighter mb-2" style={{ color: homeColor }}>
                          {TEAM_ABBREVIATIONS[match.home_team]}
                        </p>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{match.home_team}</p>
                        {isCompleted && <p className="text-2xl font-black text-white mt-4">{match.home_score || "N/A"}</p>}
                      </div>

                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-600 text-sm font-black italic mb-4">VS</div>
                        {isCompleted && (
                          <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                            <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Match Settled</span>
                          </div>
                        )}
                      </div>

                      <div className="text-center group">
                        <p className="text-3xl md:text-5xl font-black italic tracking-tighter mb-2" style={{ color: awayColor }}>
                          {TEAM_ABBREVIATIONS[match.away_team]}
                        </p>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{match.away_team}</p>
                        {isCompleted && <p className="text-2xl font-black text-white mt-4">{match.away_score || "N/A"}</p>}
                      </div>
                    </div>

                    {/* Match Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass-card p-6 bg-white/[0.02]">
                        <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <MapPin size={12} className="text-blue-500" /> Venue Intel
                        </h4>
                        <p className="text-sm text-white font-bold mb-1">{match.venue}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black">{match.city || "IPL Arena"}</p>
                      </div>
                      <div className="glass-card p-6 bg-white/[0.02]">
                        <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Clock size={12} className="text-blue-500" /> Schedule
                        </h4>
                        <p className="text-sm text-white font-bold mb-1">{match.date}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black">{match.time_ist} (IST)</p>
                      </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="glass-card p-8 bg-blue-600/[0.03] border-blue-500/20">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                          <TrendingUp size={16} /> Win Probability Model
                        </h4>
                        <span className="text-xs font-black text-white">{match.confidence}%</span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed mb-6 font-medium">
                        Our AI model predicts a high probability of <span className="text-white font-black italic pr-1">{match.predicted_winner}</span>
                        dominating this battle based on recent form, venue history, and squad composition.
                      </p>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000"
                          style={{ width: `${match.confidence}%` }}
                        />
                      </div>
                    </div>

                    {isCompleted && match.actual_winner && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Official Outcome</p>
                          <p className="text-xl font-black text-white italic">{match.actual_winner} Won</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-emerald-500/50 font-black uppercase tracking-widest leading-none mb-1">Validation</p>
                          <p className="text-xs font-bold text-white uppercase italic">{isCorrect ? "Prediction Correct" : "Prediction Missed"}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeTab === "scoreboard" && (
                  <div className="space-y-6">
                    {scoreboard ? (
                      <div className="p-6 bg-slate-800/20 rounded-2xl border border-white/5">
                        <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-6">Real-time Scoreboard Data</h4>
                        <pre className="text-[10px] text-slate-400 font-mono overflow-x-auto p-4 bg-slate-950/50 rounded-xl">
                           {JSON.stringify(scoreboard, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-slate-800/10 rounded-3xl border border-dashed border-white/5">
                        <Activity className="mx-auto text-slate-700 mb-4 animate-pulse" size={40} />
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Detailed Scoreboard only available for LIVE matches</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "players" && (
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-6">
                        <Users size={12} style={{ color: homeColor }} /> {match.home_team} Roster
                      </h4>
                      <div className="space-y-2">
                        {homePlayers.length > 0 ? homePlayers.map((p, i) => (
                          <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors">
                            <p className="text-xs font-bold text-white uppercase tracking-tight">{p.name || p.player_name}</p>
                            <p className="text-[9px] text-slate-500 uppercase font-black">{p.role || p.type || "Player"}</p>
                          </div>
                        )) : (
                          <p className="text-[10px] text-slate-600 italic">Syncing live roster...</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-6">
                        <Users size={12} style={{ color: awayColor }} /> {match.away_team} Roster
                      </h4>
                      <div className="space-y-2">
                        {awayPlayers.length > 0 ? awayPlayers.map((p, i) => (
                          <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors">
                            <p className="text-xs font-bold text-white uppercase tracking-tight">{p.name || p.player_name}</p>
                            <p className="text-[9px] text-slate-500 uppercase font-black">{p.role || p.type || "Player"}</p>
                          </div>
                        )) : (
                          <p className="text-[10px] text-slate-600 italic">Syncing live roster...</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-slate-800/20 border-t border-white/5 text-center">
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">IPL Prediction Engine v2.4 • Live Data Sync Active</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
