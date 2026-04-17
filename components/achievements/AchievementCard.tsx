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
      whileHover={{ scale: 1.035, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="relative flex items-center gap-3 shrink-0
                 h-[56px] px-4 pr-5
                 bg-white dark:bg-zinc-900
                 border border-zinc-100 dark:border-zinc-800
                 rounded-2xl cursor-default select-none
                 shadow-[0_1px_3px_rgba(0,0,0,0.06)]
                 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)]
                 transition-shadow duration-200"
      style={{ borderLeft: `3px solid ${meta.color}` }}
    >
      {/* Icon bubble */}
      <span
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: meta.bg }}
      >
        <Icon size={15} style={{ color: meta.color }} strokeWidth={2} />
      </span>

      {/* Text */}
      <div className="flex flex-col justify-center min-w-0">
        <p className="text-[13px] font-medium text-zinc-800 dark:text-zinc-100
                      leading-tight whitespace-nowrap">
          {achievement.title}
        </p>
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 whitespace-nowrap mt-0.5">
          {achievement.organization}
        </p>
      </div>

      {/* Right meta */}
      <div className="ml-auto flex items-center gap-2 pl-3 shrink-0">
        {statBadge && (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: meta.bg, color: meta.color }}
          >
            {statBadge}
          </span>
        )}
        <span className="text-[11px] text-zinc-300 dark:text-zinc-600 font-mono">
          {year}
        </span>
      </div>
    </motion.div>
  );
}
