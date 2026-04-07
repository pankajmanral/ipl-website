"use client";

import { TEAM_COLORS, TEAM_ABBREVIATIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PointsTableProps {
  data: any[];
}

export function PointsTable({ data }: PointsTableProps) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {data.map((row, idx) => (
            <motion.div 
              key={row.team}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                "glass-card p-4 relative border border-white/5 hover:border-blue-500/30 transition-all group overflow-hidden",
                idx < 4 ? "bg-blue-600/[0.03]" : ""
              )}
            >
              <div className="absolute top-1 right-2 text-[8px] font-black italic text-slate-700">#{idx + 1}</div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-black uppercase tracking-tight px-1.5 py-0.5 rounded shadow-sm shrink-0"
                      style={{ backgroundColor: TEAM_COLORS[row.team]?.primary || "#888", color: TEAM_COLORS[row.team]?.text || "#fff" }}>
                  {TEAM_ABBREVIATIONS[row.team]}
                </span>
                <span className="font-extrabold text-[11px] text-slate-300 truncate group-hover:text-white transition-colors">{row.team}</span>
              </div>
              
              <div className="flex justify-between items-center gap-1">
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">W/L</span>
                  <span className="text-xs font-bold text-slate-200">{row.won}/{row.lost}</span>
                </div>
                <div className="w-px h-6 bg-white/5"></div>
                <div className="flex flex-col text-center">
                  <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">NRR</span>
                  <span className={cn("text-xs font-mono font-bold", row.nrr >= 0 ? "text-emerald-400" : "text-rose-400")}>
                    {row.nrr > 0 ? "+" : ""}{row.nrr.toFixed(2)}
                  </span>
                </div>
                <div className="w-px h-6 bg-white/5"></div>
                <div className="flex flex-col text-right">
                  <span className="text-[8px] text-blue-500 uppercase font-black tracking-widest">PTS</span>
                  <span className="text-sm font-black text-blue-400 leading-none">{row.points}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
