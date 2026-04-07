"use client";

import { TEAM_COLORS, TEAM_ABBREVIATIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Clock, MapPin } from "lucide-react";

interface MatchCardProps {
  match: any;
  index: number;
}

export function MatchCard({ match, index }: MatchCardProps) {
  const isCorrect = match.prediction_correct;
  const isCompleted = match.is_completed;
  
  const homeColor = TEAM_COLORS[match.home_team]?.primary || "#888";
  const awayColor = TEAM_COLORS[match.away_team]?.primary || "#888";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card p-6 overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-2">
        {isCompleted ? (
          <span className={cn(
            "text-[10px] px-2 py-1 rounded-full uppercase font-bold",
            isCorrect ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          )}>
            {isCorrect ? "Correct Prediction" : "Missed"}
          </span>
        ) : (
          <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-1 rounded-full uppercase font-bold">
            Upcoming
          </span>
        )}
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col items-center flex-1">
          <span className="text-3xl font-black italic tracking-tighter" style={{ color: homeColor }}>
            {TEAM_ABBREVIATIONS[match.home_team]}
          </span>
          <span className="text-[10px] font-bold text-center text-slate-500 uppercase tracking-widest mt-1">
            {match.home_team}
          </span>
        </div>

        <div className="flex flex-col items-center px-4">
          <span className="text-2xl font-black text-white/10 italic">VS</span>
        </div>

        <div className="flex flex-col items-center flex-1">
          <span className="text-3xl font-black italic tracking-tighter" style={{ color: awayColor }}>
            {TEAM_ABBREVIATIONS[match.away_team]}
          </span>
          <span className="text-[10px] font-bold text-center text-slate-500 uppercase tracking-widest mt-1">
            {match.away_team}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <MapPin size={12} />
          <span>{match.venue}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <Clock size={12} />
          <span>{match.date}, {match.time_ist}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-medium">AI Predicted Winner</p>
            <p className="text-sm font-bold text-blue-400">{match.predicted_winner}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase font-medium">Confidence</p>
            <p className="text-lg font-black text-white">{match.confidence}%</p>
          </div>
        </div>
        
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${match.confidence}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
          />
        </div>
      </div>
    </motion.div>
  );
}
