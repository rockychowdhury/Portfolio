"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface LanguageBreakdownProps {
  languages: {
    name: string;
    color: string;
    size: number;
    percentage: number;
  }[];
}

const premiumEase = [0.25, 0.4, 0.25, 1];

export default function LanguageBreakdown({ languages }: LanguageBreakdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  if (!languages || languages.length === 0) return null;

  // Scale points for the bottom axis
  const scalePoints = [0, 7, 14, 21, 28];
  const maxScale = 28;

  return (
    <div 
      ref={ref} 
      className="rounded-[2rem] bg-secondary/10 p-6 md:p-8 border border-border/10 flex flex-col shadow-sm"
    >
      <h3 className="text-foreground text-lg font-bold mb-6">Top Languages</h3>
      
      <div className="flex flex-col gap-4 mb-6">
        {languages.map((lang, i) => (
          <div key={lang.name} className="flex items-center gap-3">
            {/* Label on the left */}
            <span className="w-20 text-right text-xs font-bold uppercase tracking-widest text-muted-foreground/60 shrink-0">
              {lang.name}
            </span>

            {/* Thick Bar Container */}
            <div className="relative flex-grow h-4 bg-background/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={isInView ? { width: `${Math.min(100, (lang.percentage / maxScale) * 100)}%` } : { width: "0%" }}
                transition={{ duration: 1.5, delay: i * 0.1, ease: premiumEase }}
                className="h-full rounded-full"
                style={{ backgroundColor: lang.color || "#3b82f6" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* X-Axis Scale */}
      <div className="flex items-center gap-3">
        <div className="w-20 shrink-0" /> {/* Offset for labels */}
        <div className="flex-grow flex justify-between px-1">
          {scalePoints.map((point) => (
            <div key={point} className="flex flex-col items-center gap-1.5">
              <div className="h-1.5 w-px bg-border" />
              <span className="text-[9px] font-bold text-muted-foreground/40">{point}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
