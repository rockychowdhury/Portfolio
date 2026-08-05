"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useTheme } from "next-themes";

interface HeatmapTooltipProps {
  cell: {
    date: string;
    count: number;
    x: number;
    y: number;
  };
}

const getContextLabel = (count: number) => {
  if (count === 0) return "No activity";
  if (count <= 3) return "Light day";
  if (count <= 6) return "Productive day";
  if (count <= 9) return "Heavy day";
  return "Exceptional day";
};

const colors = {
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"]
};

export default function HeatmapTooltip({ cell }: HeatmapTooltipProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const dateStr = format(new Date(cell.date), "EEEE, MMM d, yyyy");
  const label = getContextLabel(cell.count);

  // Offset logic to avoid edge clipping
  const isRightEdge = typeof window !== "undefined" && cell.x > window.innerWidth - 250;
  const xOffset = isRightEdge ? -220 : 12;

  if (!mounted) return null;

  const themeColors = resolvedTheme === "dark" ? colors.dark : colors.light;
  const level = cell.count === 0 ? 0 : cell.count <= 3 ? 1 : cell.count <= 6 ? 2 : cell.count <= 9 ? 3 : 4;
  const color = themeColors[level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 5, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        position: "fixed",
        top: cell.y - 100,
        left: cell.x + xOffset,
        pointerEvents: "none",
        zIndex: 9999,
      }}
      className="bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-xl p-4 flex flex-col gap-3 min-w-[200px]"
    >
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
          📅 {dateStr}
        </span>
        <div className="flex items-center gap-2">
           <div 
             className="w-10 h-2 rounded-full" 
             style={{ backgroundColor: color }}
           />
           <span className="text-xl font-medium tracking-tight text-foreground">
             {cell.count} <span className="text-xs text-muted-foreground font-light">contributions</span>
           </span>
        </div>
      </div>

      <div className="pt-2 border-t border-border uppercase italic font-black text-[9px] tracking-[0.2em] text-muted-foreground/40">
        {label}
      </div>

      {/* Triangle Arrow */}
      <div 
        className={`absolute bottom-[-6px] ${isRightEdge ? 'right-4' : 'left-4'} w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-card/95`} 
      />
    </motion.div>
  );
}
