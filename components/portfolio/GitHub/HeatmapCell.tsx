"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface HeatmapCellProps {
  day: { date: string; count: number };
  weekIdx: number;
  onHover: (e: React.MouseEvent) => void;
  onLeave: () => void;
}

const getLevel = (count: number) => {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
};

const colors = {
  // Marble to Green (Dark Theme / Obsidian Context)
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  // Marble to Green (Light Theme / Standard Context)
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"]
};

// React.memo prevents re-render when parent state changes (e.g. tooltip hover on a different cell)
// CSS transitions replace Framer Motion whileInView (eliminates ~364 IntersectionObservers)
const HeatmapCell = React.memo(function HeatmapCell({ day, weekIdx, onHover, onLeave }: HeatmapCellProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const level = getLevel(day.count);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-[10px] h-[10px] md:w-[12px] md:h-[12px] rounded-[2px] bg-secondary" />;

  const themeColors = resolvedTheme === "dark" ? colors.dark : colors.light;

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        backgroundColor: themeColors[level],
        // CSS-based staggered entry animation (replaces per-cell Framer Motion whileInView)
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'scale(1)' : 'scale(0.6)',
        transitionProperty: 'opacity, transform',
        transitionDuration: '0.4s',
        transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // spring-like bounce
        transitionDelay: `${weekIdx * 8}ms`,
      }}
      className="w-[10px] h-[10px] md:w-[12px] md:h-[12px] rounded-[2px] cursor-pointer transition-colors duration-200 hover:scale-125 hover:z-20"
    />
  );
});

export default HeatmapCell;
