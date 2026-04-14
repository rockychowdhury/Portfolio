"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

interface FilterRowProps {
  platforms: string[];
  tags: string[];
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
  onClearAll: () => void;
}

export default function FilterRow({
  platforms,
  tags,
  activeFilters,
  onFilterToggle,
  onClearAll,
}: FilterRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isAllSelected = activeFilters.length === 0;

  return (
    <div className="relative w-full mb-16">
      <div 
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto pb-6 scrollbar-hide px-2"
      >
        {/* All / Reset Pill */}
        <button
          onClick={onClearAll}
          className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
            isAllSelected 
            ? "bg-foreground text-background" 
            : "text-muted-foreground/60 hover:text-foreground"
          }`}
        >
          All
        </button>

        <div className="h-4 w-px bg-border/20 mx-4" />

        {/* Platform Filters */}
        {platforms.map((platform) => {
          const isActive = activeFilters.includes(platform);
          return (
            <button
              key={platform}
              onClick={() => onFilterToggle(platform)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex-shrink-0 whitespace-nowrap ${
                isActive 
                ? "bg-foreground text-background" 
                : "bg-secondary/10 text-muted-foreground/60 hover:bg-secondary/20 hover:text-foreground"
              }`}
            >
              {platform}
            </button>
          );
        })}

        <div className="h-4 w-px bg-border/20 mx-4 flex-shrink-0" />

        {/* Tag Filters */}
        {tags.map((tag) => {
          const isActive = activeFilters.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onFilterToggle(tag)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex-shrink-0 whitespace-nowrap ${
                isActive 
                ? "bg-primary text-white" 
                : "border border-border/40 text-muted-foreground/60 hover:border-foreground/20 hover:text-foreground"
              }`}
            >
              #{tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
