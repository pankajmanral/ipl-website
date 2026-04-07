"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, ExternalLink } from "lucide-react";

interface NewsCardProps {
  article: any;
  index: number;
}

export function NewsCard({ article, index }: NewsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card group overflow-hidden flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={article.enclosure?.link || article.thumbnail || `https://placehold.co/600x400/020617/3b82f6?text=IPL+2026+News`} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60"></div>
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider shadow-lg">Latest</span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} />
            <span>{new Date(article.pubDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>5 min read</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors leading-tight mb-3 line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
          {article.description?.replace(/<[^>]*>?/gm, '') || "Stay updated with the latest IPL 2026 developments, match highlights, and team announcements as the excitement reaches new heights."}
        </p>

        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <a 
            href={article.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors group/link"
          >
            Read Article 
            <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
          </a>
          <button className="text-slate-600 hover:text-white transition-colors">
            <ExternalLink size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
