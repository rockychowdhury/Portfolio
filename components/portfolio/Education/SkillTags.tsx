"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SkillTagsProps {
  skills: string;
}

export default function SkillTags({ skills }: SkillTagsProps) {
  const [expanded, setExpanded] = useState(false);
  const tagList = skills.split(" · ");
  const limit = 6;
  const hasMore = tagList.length > limit;
  const visibleTags = expanded ? tagList : tagList.slice(0, limit);

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <AnimatePresence mode="popLayout">
        {visibleTags.map((tag) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            layout
            className="px-2.5 py-1 text-[11px] font-medium tracking-tight text-muted-foreground bg-secondary/40 border border-border/50 rounded-lg hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            {tag}
          </motion.span>
        ))}
      </AnimatePresence>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-2.5 py-1 text-[11px] font-bold tracking-tight text-primary hover:underline transition-all"
        >
          {expanded ? "Show Less" : `+${tagList.length - limit} more`}
        </button>
      )}
    </div>
  );
}
