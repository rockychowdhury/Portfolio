"use client";

import { motion } from "framer-motion";
import CountUp from "./CountUp";

interface NarrativeBarProps {
  totalSolved: number;
  totalContests: number;
  peakRating: number;
  leetcodePercentage: string; // e.g. "Top 30%"
}

export default function NarrativeBar({
  totalSolved,
  totalContests,
  peakRating,
  leetcodePercentage,
}: NarrativeBarProps) {
  const stats = [
    { label: "Problems Solved", value: totalSolved, prefix: "", suffix: "+" },
    { label: "Contests", value: totalContests, prefix: "", suffix: "+" },
    { label: "Peak Rating", value: peakRating, prefix: "", suffix: "" },
    { label: "LeetCode", value: null, text: leetcodePercentage, prefix: "", suffix: "" },
    { label: "Platforms", value: 3, prefix: "", suffix: "" },
  ];

  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-0 mt-8 mb-12 border border-border/10 rounded-2xl bg-secondary/10 p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
    >
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className={`relative flex flex-col items-center justify-center text-center ${
            i !== stats.length - 1 ? 'md:border-r md:border-border/10' : ''
          } ${i === 4 ? 'col-span-2 md:col-span-1' : ''}`}
        >
          <div className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 tracking-tight">
            {stat.prefix}
            {stat.value !== null ? (
              <CountUp to={stat.value} duration={2} delay={0.2 + i * 0.1} />
            ) : (
              <span>{stat.text}</span>
            )}
            {stat.suffix}
          </div>
          <div className="text-xs text-muted-foreground/60 mt-1 font-bold uppercase tracking-widest">{stat.label}</div>
        </div>
      ))}
    </motion.div>
  );
}
