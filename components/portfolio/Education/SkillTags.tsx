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
            className="px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-muted-foreground/60 bg-secondary/5 border border-border/10 rounded-md hover:text-foreground hover:bg-secondary/20 transition-all duration-300"
          >
            {tag}
          </motion.span>
        ))}
      </AnimatePresence>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-all ml-1"
        >
          {expanded ? "Less" : `+${tagList.length - limit}`}
        </button>
      )}
    </div>
  );
}
