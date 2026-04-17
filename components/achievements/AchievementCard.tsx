"use client";

import { motion } from "motion/react";
import * as Icons from "lucide-react";
import { Achievement, CATEGORY_META } from "./achievementsData";

type Props = { achievement: Achievement };

export function AchievementCard({ achievement }: Props) {
  const meta = CATEGORY_META[achievement.category];
  const Icon = Icons[meta.iconName as keyof typeof Icons] as React.ElementType;

  // Handle both ISO strings and pre-formatted strings (like "Jul 2026")
  const displayDate = achievement.date;
  const year = isNaN(new Date(displayDate).getFullYear()) 
    ? displayDate.split(' ').pop() // Extract year from "MMM YYYY"
    : new Date(displayDate).getFullYear();

  // Derive a short stat badge if details exist
  const statBadge = achievement.details
    ? Object.values(achievement.details)[0]
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ 
        scale: 1.05, 
        y: -2,
        boxShadow: `0 10px 30px -10px ${meta.color}33`,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 30 
      }}
      className="relative flex items-center gap-4 shrink-0
                 h-[64px] px-5
                 bg-white/70 dark:bg-zinc-900/70
                 backdrop-blur-md
                 border border-white/20 dark:border-zinc-800/50
                 rounded-2xl cursor-default select-none
                 shadow-[0_2px_10px_rgba(0,0,0,0.05)]
                 transition-all duration-300"
      style={{ 
        borderLeft: `4px solid ${meta.color}`,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "translateZ(0)",
      }}

    >
      {/* Glow Background (Visible on hover) */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ 
          background: `radial-gradient(circle at center, ${meta.color}11 0%, transparent 70%)` 
        }}
      />

      {/* Icon bubble */}
      <span
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                   relative overflow-hidden border border-white/10 dark:border-zinc-700/30"
        style={{ background: `${meta.bg}88` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        <Icon size={18} style={{ color: meta.color }} strokeWidth={2.5} />
      </span>

      {/* Text */}
      <div className="flex flex-col justify-center min-w-0">
        <p className="text-[14px] font-bold text-zinc-900 dark:text-zinc-50
                      leading-tight whitespace-nowrap tracking-tight">
          {achievement.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap uppercase tracking-wider">
            {achievement.organization}
          </p>
          <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
            {year}
          </span>
        </div>
      </div>

      {/* Right meta - Stat Badge */}
      {statBadge && (
        <div className="ml-4 shrink-0">
          <span
            className="text-[10px] font-bold px-2 py-1 rounded-lg border border-white/20"
            style={{ background: meta.bg, color: meta.color }}
          >
            {statBadge}
          </span>
        </div>
      )}
    </motion.div>
  );
}

