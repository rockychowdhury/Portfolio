"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface RepoSparklineProps {
  data: number[];
  color: string;
}

export default function RepoSparkline({ data, color }: RepoSparklineProps) {
  const points = useMemo(() => {
    if (!data || data.length === 0) return "";
    
    const max = Math.max(...data, 1);
    const width = 400; // Reference width
    const height = 40;
    const step = width / (data.length - 1);
    
    return data && data.map((val, i) => {
      const x = i * step;
      const y = height - (val / max) * height;
      return `${x},${y}`;
    }).join(" ");
  }, [data]);

  const fillPoints = useMemo(() => {
    if (!points) return "";
    return `0,40 ${points} 400,40`;
  }, [points]);

  return (
    <div className="w-full h-10 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
      <svg
        viewBox="0 0 400 40"
        className="w-full h-full preserve-3d"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Fill Area */}
        <motion.polyline
          points={fillPoints}
          fill={`url(#grad-${color})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* The Line */}
        <motion.polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
