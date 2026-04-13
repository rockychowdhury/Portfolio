"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface ContributionHeatmapProps {
  heatmap: { date: string; count: number }[];
  totalContributions: number;
  streak: {
    current: number;
    longest: number;
  };
}

const premiumEase = [0.25, 0.4, 0.25, 1];

// Monochromatic progression
// Theme-aware monochromatic progression
function getHeatmapColor(count: number, maxCount: number): string {
  if (count === 0) return "bg-secondary/10 border-transparent transition-colors";
  
  const intensity = Math.ceil((count / (maxCount || 1)) * 4);
  
  if (intensity === 1) return "bg-foreground/10 border-foreground/5";
  if (intensity === 2) return "bg-foreground/30 border-foreground/10";
  if (intensity === 3) return "bg-foreground/60 border-foreground/20";
  return "bg-foreground border-foreground/30";
}

export default function ContributionHeatmap({ heatmap, totalContributions, streak }: ContributionHeatmapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number } | null>(null);

  const weeks: { date: string; count: number }[][] = [];
  let currentWeek: { date: string; count: number }[] = [];
  
  heatmap.forEach((day, i) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || i === heatmap.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const maxCount = Math.max(...heatmap.map((d) => d.count));

  return (
    <div className="flex flex-col gap-10" ref={ref}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 px-2">
        <div>
          <h3 className="text-2xl font-light tracking-tight text-foreground mb-6 uppercase tracking-[0.1em]">Activity Data</h3>
          <div className="flex gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground/40 mb-1">Current Streak</span>
              <span className="text-2xl font-light text-foreground">{streak.current} days</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground/40 mb-1">Peak Streak</span>
              <span className="text-2xl font-light text-foreground">{streak.longest} days</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
             <span className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground/40 mb-1">Total in 2025</span>
             <span className="text-5xl font-light tracking-tight text-foreground tabular-nums">{totalContributions}</span>
        </div>
      </div>

      <div className="relative rounded-[2rem] bg-secondary/10 p-8 md:p-10 border border-border/10 overflow-x-auto custom-scrollbar group">
        {/* Tooltip */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 h-6 pointer-events-none">
            {hoveredCell && (
              <motion.div
                 initial={{ opacity: 0, y: 5 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="bg-foreground text-background text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-sm shadow-2xl"
              >
                 {hoveredCell.count} Contributions // {hoveredCell.date}
              </motion.div>
            )}
        </div>

        <div className="min-w-[700px] mt-6 flex justify-between gap-[5px]">
          {weeks.map((week, wIndex) => (
            <div key={`week-${wIndex}`} className="flex flex-col gap-[5px]">
              {week.map((day) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ 
                    duration: 0.4, 
                    delay: wIndex * 0.01 + Math.random() * 0.05, 
                    ease: premiumEase 
                  }}
                  onMouseEnter={() => setHoveredCell(day)}
                  onMouseLeave={() => setHoveredCell(null)}
                  className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-[1px] border transition-all duration-300 cursor-none ${getHeatmapColor(day.count, maxCount)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
