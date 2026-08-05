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
            className={`px-2 py-[3px] text-[10px] rounded-lg transition-all duration-300 ${isDark ? "text-purple-200 bg-white/[0.06] border border-white/[0.10] hover:text-white hover:bg-white/[0.10]" : "text-[#76767c] bg-black/[0.04] border border-black/[0.08] hover:text-[#1d1d1f] hover:bg-black/[0.07]"}`}
          >
            {tag}
          </motion.span>
        ))}
      </AnimatePresence>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={`px-2 py-[3px] text-[10px] rounded-lg transition-all ml-1 ${isDark ? "text-purple-200 bg-white/[0.06] border border-white/[0.10] hover:text-white hover:bg-white/[0.10]" : "text-[#76767c] bg-black/[0.04] border border-black/[0.08] hover:text-[#1d1d1f] hover:bg-black/[0.07]"}`}
        >
          {expanded ? "Less" : `+${tagList.length - limit}`}
        </button>
      )}
    </div>
  );
}
