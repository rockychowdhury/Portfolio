"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

export default function HeatmapCell({ day, weekIdx, onHover, onLeave }: HeatmapCellProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const level = getLevel(day.count);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-[10px] h-[10px] md:w-[12px] md:h-[12px] rounded-[2px] bg-secondary" />;

  const themeColors = resolvedTheme === "dark" ? colors.dark : colors.light;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
        delay: weekIdx * 0.008,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ 
        scale: 1.25, 
        zIndex: 20,
        transition: { duration: 0.2 }
      }}
      style={{
        backgroundColor: themeColors[level],
      }}
      className="w-[10px] h-[10px] md:w-[12px] md:h-[12px] rounded-[2px] cursor-pointer transition-colors duration-200"
    />
  );
}
