"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, startOfMonth, isSameMonth } from "date-fns";
import { useTheme } from "next-themes";
import HeatmapCell from "./HeatmapCell";
import HeatmapTooltip from "./HeatmapTooltip";

interface HeatmapProps {
  heatmap: { date: string; count: number }[];
  stats: any;
  streak: { current: number; longest: number };
}

const colors = {
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"]
};

export default function ContributionHeatmap({ heatmap, stats, streak }: HeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number; x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Group heatmap into weeks (7 days each)
  const weeks = useMemo(() => {
    const result: { date: string; count: number }[][] = [];
    for (let i = 0; i < heatmap.length; i += 7) {
      result.push(heatmap.slice(i, i + 7));
    }
    return result;
  }, [heatmap]);

  // Calculate month labels and their positions
  const monthLabels = useMemo(() => {
    const labels: { label: string; offset: number }[] = [];
    weeks.forEach((week, i) => {
      const firstDay = new Date(week[0].date);
      const label = format(firstDay, "MMM");
      if (i === 0 || !isSameMonth(firstDay, new Date(weeks[i - 1][0].date))) {
         labels.push({ label, offset: i });
      }
    });
    return labels.filter((l, i) => i === 0 || l.offset - labels[i - 1].offset > 2);
  }, [weeks]);

  // Handle horizontal scroll to the end (today) on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, []);

  const totalContributionsInLastYear = stats.commits; 
  const mostActiveDay = stats.productivity?.mostActiveDay || "Tuesday";
  const themeColors = mounted && resolvedTheme === "light" ? colors.light : colors.dark;

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Summary Line (Top) */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] md:text-xs font-bold text-muted-foreground/80 uppercase tracking-widest italic"
      >
        <span>{totalContributionsInLastYear} contributions in the last year</span>
        <span className="w-1 h-1 rounded-full bg-border/40" />
        <span>Most active: {mostActiveDay}</span>
        <span className="w-1 h-1 rounded-full bg-border/40" />
        <span>Latest streak: {streak.current} days</span>
      </motion.div>

      {/* 2. Heatmap Grid Wrapper */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none md:hidden" />
        
        <div 
          ref={scrollContainerRef}
          className="scrollbar-hide overflow-x-auto overflow-y-hidden mask-fade-right"
        >
          <div className="flex flex-col gap-2">
            <div className="flex gap-[3px] min-w-max pr-12 lg:pr-0">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIdx) => (
                    <HeatmapCell
                      key={day.date}
                      day={day}
                      weekIdx={weekIdx}
                      onHover={(e) => setHoveredCell({ ...day, x: e.clientX, y: e.clientY })}
                      onLeave={() => setHoveredCell(null)}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* 3. Month Labels (Bottom) */}
            <div className="flex gap-[3px] min-w-max pr-12 lg:pr-0 relative h-4">
              {monthLabels.map((m, i) => (
                <div 
                  key={i} 
                  className="absolute text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter"
                  style={{ left: m.offset * 15 }} 
                >
                  {m.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredCell && (
             <HeatmapTooltip cell={hoveredCell} />
          )}
        </AnimatePresence>
      </div>

      {/* 4. Legend (Bottom Right) */}
      {mounted && (
        <div className="mt-2 flex items-center justify-end gap-2 text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest italic pr-1">
          <span>Less</span>
          <div className="flex gap-[3px]">
            {themeColors.map(color => (
              <div key={color} className="w-[11px] h-[11px] md:w-[13px] md:h-[13px] rounded-[2px] border border-border/5 shadow-sm" style={{ backgroundColor: color }} />
            ))}
          </div>
          <span>More</span>
        </div>
      )}
    </div>
  );
}
