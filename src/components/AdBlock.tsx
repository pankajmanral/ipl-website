"use client";

import { useEffect } from "react";
import { Info } from "lucide-react";
import { AD_CONFIG } from "@/config/ads";

interface AdBlockProps {
  slot: string;
  format?: string;
  responsive?: boolean;
}

export function AdBlock({ slot, format = "auto", responsive = true }: AdBlockProps) {
  useEffect(() => {
    const pushAd = () => {
      try {
        const adElement = document.getElementById(`ad-${slot}`);
        if (adElement && adElement.offsetWidth > 0) {
          // @ts-ignore
          const adsbygoogle = window.adsbygoogle || [];
          adsbygoogle.push({});
        } else {
          // Try again once more if width is still 0
          setTimeout(pushAd, 500);
        }
      } catch (e) {
        console.error("AdSense load error:", e);
      }
    };

    const timer = setTimeout(pushAd, 200);
    return () => clearTimeout(timer);
  }, [slot]);

  return (
    <div className="w-full my-12 bg-slate-100/5 dark:bg-slate-900/40 rounded-xl overflow-hidden border border-dashed border-slate-700/50 flex flex-col items-center justify-center min-h-[280px] relative group transition-all hover:bg-slate-800/60 h-auto">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <Info size={14} className="text-slate-500" />
      </div>
      
      {/* Placeholder content for development */}
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 z-10 w-full h-full pointer-events-none">
        <div className="text-slate-500 uppercase tracking-[0.2em] text-[10px] font-bold">Recommended for you</div>
        <div className="w-48 h-12 bg-slate-800 animate-pulse rounded-md opacity-30"></div>
        <div className="text-slate-600 text-xs py-2 italic font-medium px-4 border border-slate-700/20 rounded-full">Advertisement Space #{slot}</div>
      </div>

      {/* Actual AdSense Slot */}
      <div className="w-full h-full flex justify-center items-center overflow-hidden absolute inset-0">
        <ins
          id={`ad-${slot}`}
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "100%", minHeight: "250px" }}
          data-ad-client={AD_CONFIG.publisherId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </div>
  );
}
