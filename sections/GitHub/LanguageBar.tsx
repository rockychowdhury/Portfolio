"use client";

import { motion } from "framer-motion";

interface LanguageBarProps {
  language: {
    name: string;
    color: string;
    percentage: number;
    repoCount: number;
  };
  index: number;
}

export default function LanguageBar({ language, index }: LanguageBarProps) {
  return (
    <div className="flex flex-col gap-2 group">
      <div className="flex justify-between items-end">
        <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors">
          {language.name}
        </span>
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/40 italic">
          <span>{language.percentage}%</span>
          <span className="w-1 h-1 rounded-full bg-border/20" />
          <span>Used in {language.repoCount} {language.repoCount === 1 ? 'repo' : 'repos'}</span>
        </div>
      </div>

      <div className="relative h-2 w-full bg-secondary/80 rounded-full overflow-hidden">
        {/* Animated Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${language.percentage}%` }}
          transition={{
            duration: 1.2,
            delay: 0.2 + (index * 0.1),
            ease: [0.25, 0.4, 0.25, 1],
          }}
          style={{
            backgroundColor: language.color || "#3b82f6",
          }}
          className="absolute inset-y-0 left-0 h-full"
        />

        {/* Shimmer Sweep */}
        <motion.div
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
          className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
        />
      </div>
    </div>
  );
}
