"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface ActivityHeatmapProps {
  data: { [timestampOrDate: string]: number };
  accentColor: string; // e.g., 'bg-amber-500' or tailwind class or hex
  weeks?: number;
  isTimestamp?: boolean; // LeetCode uses unix timestamp keys
}

export default function ActivityHeatmap({
  data,
  accentColor,
  weeks = 16,
  isTimestamp = true,
}: ActivityHeatmapProps) {
  const cells = useMemo(() => {
    const totalDays = weeks * 7;
    const today = new Date();
    // Normalize to start of day
    today.setHours(0, 0, 0, 0);

    const generatedCells = [];
    
    // Check max count to scale opacity
    let maxCount = 0;
    Object.values(data).forEach((c) => {
      if (c > maxCount) maxCount = c;
    });
    // Set a reasonable min baseline if too low
    if (maxCount < 4) maxCount = 4;

    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      
      let count = 0;
      if (isTimestamp) {
        // LeetCode might use seconds instead of ms
        const tsInSeconds = Math.floor(d.getTime() / 1000).toString();
        // LeetCode's active calendar can be exact day start in user timezone, just do a fuzzy match over the day
        // Or if we know the exact keys, we sum for the day. For simplicity, just exact key match or zero:
        count = data[tsInSeconds] || 0;
        
        // Sometimes LeetCode timestamps are shifted by timezones. An alternative is scanning the entire object.
        // If the object isn't huge, we can just use the provided data directly.
      } else {
        const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
        count = data[dateStr] || 0;
      }

      // Calculate intensity (0 to 1)
      const intensity = count === 0 ? 0 : Math.max(0.2, count / maxCount);

      generatedCells.push({
        date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        count,
        intensity,
      });
    }

    return generatedCells;
  }, [data, weeks, isTimestamp]);

  // CSS variables for styling based on accentColor (hex)
  const isHex = accentColor.startsWith('#');

  return (
    <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
      {/* 7 rows based on github style. Wait, mapping to 7 rows might be tricky if we don't start on Sunday. 
          For a simple timeline, a single wrapping flex container that uses writing-mode or grid is standard.
          Let's use CSS grid with 7 rows, auto flow column */}
      <div 
        className="grid grid-rows-7 gap-[3px]"
        style={{ gridAutoFlow: 'column' }}
      >
        {cells.map((cell, idx) => {
          // Stagger effect
          const colIndex = Math.floor(idx / 7);
          
          return (
            <motion.div
              key={idx}
              className={`group relative w-3 h-3 rounded-[2px] ${
                cell.count === 0 ? "bg-secondary/20" : ""
              }`}
              style={{
                backgroundColor: cell.count !== 0 
                  ? (isHex ? accentColor : undefined) 
                  : undefined,
                opacity: cell.count === 0 ? 1 : cell.intensity,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ 
                opacity: cell.count === 0 ? 1 : cell.intensity, 
                scale: 1 
              }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ 
                delay: colIndex * 0.02, 
                duration: 0.3 
              }}
              whileHover={{ scale: 1.25, zIndex: 10 }}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block px-2 py-1 bg-foreground text-background border border-border/10 rounded text-[10px] whitespace-nowrap z-50 pointer-events-none shadow-xl">
                <span className="font-bold">{cell.count}</span> submissions on {cell.date}
                <svg className="absolute top-full left-1/2 -translate-x-1/2 text-foreground w-2 h-2" fill="currentColor" viewBox="0 0 8 8"><path d="M0 0l4 4 4-4z" /></svg>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
