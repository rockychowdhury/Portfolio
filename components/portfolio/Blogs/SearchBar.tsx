"use client";

import { motion } from "framer-motion";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  hasResults?: boolean;
}

export default function SearchBar({ query, setQuery, hasResults = true }: SearchBarProps) {
  const isIdle = !query.trim();

  return (
    <motion.div 
      className="relative w-full lg:w-80 group flex justify-start"
    >
      <div 
        className="relative flex items-center group max-w-[280px] w-full bg-secondary/40 hover:bg-secondary/50 border border-border/60 rounded-full px-5 py-2 transition-all duration-300 shadow-sm"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="flex-1 bg-transparent border-none py-0.5 text-[11px] font-medium focus:outline-none placeholder:text-muted-foreground/30 text-foreground"
        />

        <div className="flex items-center gap-3 ml-2">
          {/* Status Indicator */}
          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 shadow-sm ${
            isIdle ? "bg-muted/10" :
            hasResults ? "bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]" :
            "bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
          }`} />
        </div>
      </div>
    </motion.div>
  );
}
