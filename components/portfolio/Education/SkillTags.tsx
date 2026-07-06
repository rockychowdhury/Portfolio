"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SkillTagsProps {
  skills: string;
  isDark?: boolean;
}

export default function SkillTags({ skills, isDark = false }: SkillTagsProps) {
  const [expanded, setExpanded] = useState(false);
  const tagList = skills.split(" · ");
  const limit = 6;
  const hasMore = tagList.length > limit;
  const visibleTags = expanded ? tagList : tagList.slice(0, limit);

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      <AnimatePresence mode="popLayout">
        {visibleTags.map((tag, idx) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: idx * 0.03 }}
            layout
            className={`px-2 py-0.5 text-[10px] rounded-md transition-all duration-300 ${isDark ? "text-purple-300 bg-white/5 border border-white/10 hover:text-white" : "text-muted-foreground bg-muted/40 border border-border/60 hover:text-foreground"}`}
          >
            {tag}
          </motion.span>
        ))}
      </AnimatePresence>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={`px-2 py-0.5 text-[10px] rounded-md transition-all ml-1 ${isDark ? "text-purple-300 bg-white/5 border border-white/10 hover:text-white" : "text-muted-foreground bg-muted/40 border border-border/60 hover:text-foreground"}`}
        >
          {expanded ? "Less" : `+${tagList.length - limit}`}
        </button>
      )}
    </div>
  );
}
