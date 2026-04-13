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
      className="rounded-3xl bg-[#0a1120] p-8 md:p-10 border border-white/5 flex flex-col shadow-2xl"
    >
      <h3 className="text-white text-xl font-semibold mb-8">Top Languages</h3>
      
      <div className="flex flex-col gap-6 mb-8">
        {languages.map((lang, i) => (
          <div key={lang.name} className="flex items-center gap-4">
            {/* Label on the left */}
            <span className="w-24 text-right text-sm font-medium text-slate-400 shrink-0">
              {lang.name}
            </span>

            {/* Thick Bar Container */}
            <div className="relative flex-grow h-5 bg-white/5 rounded-full overflow-hidden">
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
      <div className="flex items-center gap-4">
        <div className="w-24 shrink-0" /> {/* Offset for labels */}
        <div className="flex-grow flex justify-between px-1">
          {scalePoints.map((point) => (
            <div key={point} className="flex flex-col items-center gap-2">
              <div className="h-2 w-px bg-slate-700" />
              <span className="text-[10px] font-medium text-slate-500">{point}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
