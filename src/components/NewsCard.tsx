import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ArrowRight, ExternalLink, X, BookOpen, Share2 } from "lucide-react";

interface NewsCardProps {
  article: any;
  index: number;
}

export function NewsCard({ article, index }: NewsCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getRelativeTime = (dateStr: string) => {
    const now = new Date();
    const past = new Date(dateStr);
    const diffInMs = now.getTime() - past.getTime();
    const diffInHrs = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHrs < 1) return "Just Now";
    if (diffInHrs === 1) return "1 hr ago";
    if (diffInHrs < 24) return `${diffInHrs} hrs ago`;
    return past.toLocaleDateString();
  };

  const getReadingTime = (content: string) => {
    const text = content.replace(/<[^>]*>?/gm, ''); // Remove HTML
    const words = text.split(/\s+/).length;
    const time = Math.ceil(words / 200);
    return time < 1 ? 1 : time;
  };

  const readingTime = getReadingTime(article.content || article.description || "");
  const isLive = new Date().getTime() - new Date(article.pubDate).getTime() < 1000 * 60 * 60 * 12; // 12 hours

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        className="glass-card group overflow-hidden flex flex-col h-full cursor-pointer hover:ring-2 hover:ring-blue-500/20"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative h-48 overflow-hidden">
          <img 
            src={article.enclosure?.link || article.thumbnail || `https://placehold.co/601x401/020617/3b82f6?text=IPL+2026+Live`} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60"></div>
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={cn(
              "text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider shadow-lg",
              isLive ? "bg-red-600 animate-pulse" : "bg-blue-600"
            )}>
              {isLive ? "Live Now" : "Latest"}
            </span>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} />
              <span>{getRelativeTime(article.pubDate)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={12} />
              <span>{readingTime} min read</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors leading-tight mb-3 line-clamp-2">
            {article.title}
          </h3>
          
          <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
            {article.description?.replace(/<[^>]*>?/gm, '') || "Stay updated with the latest IPL 2026 developments, match highlights, and team announcements as the excitement reaches new heights."}
          </p>

          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
            <button 
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors group/link"
            >
              Read Article 
              <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
            </button>
            <div className="text-slate-600 hover:text-white transition-colors">
              <ExternalLink size={16} />
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] glass-card overflow-hidden flex flex-col shadow-2xl border-white/10"
            >
              <div className="relative h-64 md:h-80 shrink-0">
                <img 
                  src={article.enclosure?.link || article.thumbnail || `https://placehold.co/600x400/020617/3b82f6?text=IPL+2026+News`} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-6 right-6 p-2 bg-slate-950/50 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors shadow-xl"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-4 text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mb-4">
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded">Featured</span>
                    <span>{new Date(article.pubDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight text-white leading-none">
                    {article.title}
                  </h2>
                </div>
              </div>

              <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar flex-1">
                <div className="flex items-center gap-6 mb-8 py-4 border-y border-white/5">
                  <div className="flex items-center gap-2 text-slate-400">
                    <BookOpen size={16} className="text-blue-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      {(article.content || article.description || "").replace(/<[^>]*>?/gm, '').split(/\s+/).length} Words
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={16} className="text-blue-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{readingTime} Min Reading</span>
                  </div>
                  <button className="ml-auto flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <Share2 size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Share Report</span>
                  </button>
                </div>

                <div 
                  className="prose prose-invert prose-blue max-w-none text-slate-300 font-medium leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: article.content || article.description }}
                />
                
                <div className="mt-12 p-6 bg-blue-600/5 rounded-2xl border border-blue-500/10">
                  <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-2">Editor's Note</h4>
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    "This report is generated using our proprietary AI analysis engine and synthesized from verified news sources. For live scores and real-time ball-by-ball updates, please check our matches section."
                  </p>
                </div>
                
                <div className="mt-10 flex gap-4">
                  <a 
                    href={article.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-[10px] tracking-widest py-4 rounded-xl text-center transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                  >
                    Source Article <ExternalLink size={14} />
                  </a>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="flex-1 border border-white/10 hover:bg-white/5 text-slate-300 font-black uppercase text-[10px] tracking-widest py-4 rounded-xl text-center transition-all active:scale-95"
                  >
                    Close Intel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
