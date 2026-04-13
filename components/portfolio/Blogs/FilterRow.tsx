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
    <div className="relative w-full mb-12">
      <div 
        ref={scrollContainerRef}
        className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide mask-fade-right px-2"
      >
        {/* All / Reset Pill */}
        <button
          onClick={onClearAll}
          className={`relative px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
            isAllSelected 
            ? "border-primary text-primary-foreground bg-primary" 
            : "border-border/50 text-muted-foreground hover:border-border"
          }`}
        >
          All
        </button>

        <div className="h-4 w-px bg-border/20 mx-2" />

        {/* Platform Filters */}
        {platforms.map((platform) => {
          const isActive = activeFilters.includes(platform);
          return (
            <button
              key={platform}
              onClick={() => onFilterToggle(platform)}
              className={`relative px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-500 border overflow-hidden group flex-shrink-0 whitespace-nowrap ${
                isActive 
                ? "border-primary text-primary-foreground" 
                : "border-border/50 text-muted-foreground hover:border-border"
              }`}
            >
              {/* Fill animation effect */}
              <motion.div 
                className="absolute inset-0 bg-primary -z-10"
                initial={false}
                animate={{ x: isActive ? "0%" : "-101%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <span className="relative z-10">{platform}</span>
            </button>
          );
        })}

        <div className="h-4 w-px bg-border/20 mx-2 flex-shrink-0" />

        {/* Tag Filters */}
        {tags.map((tag) => {
          const isActive = activeFilters.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onFilterToggle(tag)}
              className={`relative px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-500 border overflow-hidden group flex-shrink-0 whitespace-nowrap ${
                isActive 
                ? "border-foreground text-background" 
                : "border-border/50 text-muted-foreground hover:border-border"
              }`}
            >
              <motion.div 
                className="absolute inset-0 bg-foreground -z-10"
                initial={false}
                animate={{ x: isActive ? "0%" : "-101%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <span className="relative z-10">#{tag}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
