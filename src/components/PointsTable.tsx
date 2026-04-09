"use client";

import { TEAM_COLORS, TEAM_ABBREVIATIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PointsTableProps {
  data: any[];
}

export function PointsTable({ data }: PointsTableProps) {
  return (
    <div className="glass-card overflow-hidden border border-white/5 shadow-2xl">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-white/5">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Pos</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Team</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">PL</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">W</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">L</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">PTS</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">NRR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {data.map((row, idx) => (
              <motion.tr 
                key={row.team}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "group hover:bg-blue-600/[0.03] transition-colors relative",
                  idx < 4 ? "bg-blue-600/[0.01]" : ""
                )}
              >
                <td className="px-6 py-5">
                  <span className={cn(
                    "w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-black italic",
                    idx < 4 ? "bg-blue-600/20 text-blue-400" : "bg-slate-800 text-slate-500"
                  )}>
                    {idx + 1}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 flex items-center justify-center rounded text-[10px] font-black uppercase tracking-tighter shrink-0 shadow-lg"
                          style={{ backgroundColor: TEAM_COLORS[row.team]?.primary || "#888", color: TEAM_COLORS[row.team]?.text || "#fff" }}>
                      {TEAM_ABBREVIATIONS[row.team]}
                    </span>
                    <span className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors">{row.team}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center font-bold text-sm text-slate-400">{row.played}</td>
                <td className="px-6 py-5 text-center font-bold text-sm text-slate-200">{row.won}</td>
                <td className="px-6 py-5 text-center font-bold text-sm text-slate-200">{row.lost}</td>
                <td className="px-6 py-5 text-center">
                  <span className="text-base font-black text-blue-400">{row.points}</span>
                </td>
                <td className="px-6 py-5 text-right font-mono text-sm font-bold">
                  <span className={cn(row.nrr >= 0 ? "text-emerald-400" : "text-rose-400")}>
                    {row.nrr > 0 ? "+" : ""}{row.nrr.toFixed(3)}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-slate-900/30 flex items-center justify-between border-t border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Qualifier Spot</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-800"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Eliminated</span>
          </div>
        </div>
        <p className="text-[10px] text-slate-600 font-medium italic">Data synced from IPL Global Feed • Last updated 2 mins ago</p>
      </div>
    </div>
  );
}
