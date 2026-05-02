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
  const [colWidth, setColWidth] = useState(15);
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

  // Fix for "sticky" tooltips: Clear hover state on any scroll or resize
  // AND update colWidth for responsive month labels
  useEffect(() => {
    const clearHover = () => setHoveredCell(null);
    const handleUpdate = () => {
      clearHover();
      setColWidth(window.innerWidth < 768 ? 13 : 15);
    };
    
    // Initial call
    handleUpdate();

    // 1. Global scroll (page scroll)
    window.addEventListener("scroll", clearHover, { passive: true });
    // 2. Global resize (layout changes)
    window.addEventListener("resize", handleUpdate, { passive: true });
    
    // 3. Local container scroll (horizontal scroll)
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", clearHover, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", clearHover);
      window.removeEventListener("resize", handleUpdate);
      if (container) {
        container.removeEventListener("scroll", clearHover);
      }
    };
  }, []);

  const totalContributionsInLastYear = stats.commits; 
  const mostActiveDay = stats.productivity?.mostActiveDay || "Tuesday";
  const themeColors = mounted && resolvedTheme === "light" ? colors.light : colors.dark;

  return (
    <div 
      className="flex flex-col gap-4"
      onMouseLeave={() => setHoveredCell(null)}
    >
      {/* 1. Summary Line (Top) */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] md:text-[11px] font-medium"
      >
        <div className="flex items-center gap-3 bg-muted/20 px-3 py-1.5 rounded-full border border-border/40 shadow-sm transition-colors hover:bg-muted/30">
          <div className="flex items-center gap-1.5">
            <span className="text-foreground font-bold tabular-nums">{totalContributionsInLastYear}</span>
            <span className="text-muted-foreground/50 uppercase tracking-widest text-[9px] font-bold">Contributions</span>
          </div>
          
          <div className="w-px h-3 bg-border/60" />
          
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground/50 uppercase tracking-widest text-[9px] font-bold">Peak</span>
            <span className="text-foreground font-bold uppercase tracking-tight">{mostActiveDay}</span>
          </div>
          
          <div className="w-px h-3 bg-border/60" />
          
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground/50 uppercase tracking-widest text-[9px] font-bold">Max Streak</span>
            <span className="text-foreground font-bold tabular-nums">{streak.longest} Days</span>
          </div>
        </div>
      </motion.div>

      {/* 2. Heatmap Grid Wrapper */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none md:hidden" />
        
        <div 
          ref={scrollContainerRef}
          className="scrollbar-hide overflow-x-auto overflow-y-hidden"
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
                  style={{ left: m.offset * colWidth }} 
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
        <div className="mt-4 flex items-center justify-end gap-3 text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] pr-1">
          <span>Less</span>
          <div className="flex gap-[3px]">
            {themeColors.map(color => (
              <div key={color} className="w-[10px] h-[10px] md:w-[12px] md:h-[12px] rounded-[2px] border border-border/10 shadow-sm" style={{ backgroundColor: color }} />
            ))}
          </div>
          <span>More</span>
        </div>
      )}
    </div>
  );
}
