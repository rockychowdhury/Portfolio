"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

interface FilterRowProps {
  platforms: string[];
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
  onClearAll: () => void;
}

export default function FilterRow({
  platforms,
  activeFilters,
  onFilterToggle,
  onClearAll,
}: FilterRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isAllSelected = activeFilters.length === 0;

  return (
    <div className="relative w-full">
      <div 
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-hide px-2"
      >
        {/* All / Reset Pill */}
        <button
          onClick={onClearAll}
          className={`px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
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
              className={`px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex-shrink-0 whitespace-nowrap ${
                isActive 
                ? "bg-foreground text-background" 
                : "bg-secondary/10 text-muted-foreground/60 hover:bg-secondary/20 hover:text-foreground"
              }`}
            >
              {platform}
            </button>
          );
        })}
      </div>
    </div>
  );
}
