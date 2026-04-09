"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { NewsCard } from "@/components/NewsCard";
import { AdBlock } from "@/components/AdBlock";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, LayoutGrid, List as ListIcon, TrendingUp, Sparkles, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

const NEWS_RSS_URL = "https://news.google.com/rss/search?q=IPL+2026&hl=en-IN&gl=IN&ceid=IN:en";
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(NEWS_RSS_URL)}`;

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.status === "ok") {
        // Filter out non-IPL news to ensure 100% data relevance
        const iplNews = data.items.filter((item: any) => 
          item.title.toLowerCase().includes("ipl") || 
          item.title.toLowerCase().includes("indian premier league") ||
          item.description.toLowerCase().includes("ipl")
        );
        setNews(iplNews);
        setError(false);
      } else {
        setError(true);
      }
    } catch (e) {
      console.error("News fetch error:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Newspaper className="text-blue-500" size={24} />
              <h1 className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] font-mono leading-none">IPL Intel Hub</h1>
            </div>
            <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase mb-6 leading-none ipl-gradient-text max-w-2xl">
              Latest Headlines & <br />IPL Insider Reports
            </h2>
            <p className="text-slate-400 max-w-xl text-lg font-medium leading-relaxed">
              Cutting-edge analysis, breaking news, and strategic insights from the heart of the IPL 2026 season. Powered by real-time intelligence.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/40 p-1.5 rounded-2xl border border-white/5">
            <button 
              onClick={() => setView("grid")}
              className={cn(
                "p-3 rounded-xl transition-all duration-300",
                view === "grid" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-white"
              )}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setView("list")}
              className={cn(
                "p-3 rounded-xl transition-all duration-300",
                view === "list" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-white"
              )}
            >
              <ListIcon size={18} />
            </button>
            <div className="w-px h-8 bg-white/5 mx-2"></div>
            <button 
              onClick={fetchNews}
              disabled={loading}
              className="p-3 text-slate-500 hover:text-white transition-all disabled:opacity-50 group active:scale-95"
            >
              <RefreshCw size={18} className={cn(loading && "animate-spin")} />
            </button>
          </div>
        </div>

        <AdBlock slot="top-news" />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card h-96 rounded-2xl animate-pulse bg-slate-900/40 flex flex-col p-6">
                <div className="w-full h-40 bg-slate-800 rounded-xl mb-6"></div>
                <div className="w-24 h-3 bg-slate-800 rounded mb-4"></div>
                <div className="w-full h-8 bg-slate-800 rounded mb-4"></div>
                <div className="w-3/4 h-8 bg-slate-800 rounded mb-10"></div>
                <div className="w-full h-px bg-slate-800 mt-auto"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="glass-card p-12 text-center max-w-md mx-auto my-20">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-500">
              <Sparkles size={40} className="rotate-45" />
            </div>
            <h3 className="text-xl font-bold mb-2">Signal Interrupted.</h3>
            <p className="text-slate-400 text-sm mb-8">We encountered a temporary disruption while syncing current headlines. Please try refreshing the feed.</p>
            <button 
              onClick={fetchNews}
              className="px-8 py-3 bg-blue-600 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-blue-500 transition-colors"
            >
              Retry Sync
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              key={view}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "grid gap-8",
                view === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}
            >
              {news.map((item, idx) => (
                <NewsCard key={item.guid || item.link} article={item} index={idx} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        <div className="mt-12">
          <AdBlock slot="bottom-news" />
        </div>

        {/* Older News Disclaimer */}
        {!loading && (
          <div className="mt-20 glass-card p-8 border-dashed border-slate-700/50 bg-transparent flex flex-col md:flex-row items-center justify-between gap-8 opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/10 rounded-xl text-blue-500">
                <TrendingUp size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold">Accessing Archive Data?</h4>
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Older reports are being indexed from historical databases.</p>
              </div>
            </div>
            <button className="whitespace-nowrap px-6 py-2 border border-slate-700 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95">
              Load Archive v2.0
            </button>
          </div>
        )}
      </div>

      <footer className="border-t border-white/5 py-12 bg-slate-950 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
              <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center font-black italic text-white">IPL</div>
              <span className="text-sm font-black italic uppercase tracking-tighter">Prediction AI</span>
            </div>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              © 2026 IPL Prediction Hub. Syndicate of Global Analysts.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
