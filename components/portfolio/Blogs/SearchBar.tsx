"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

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
        className="relative flex items-center group max-w-[280px] w-full bg-secondary/20 hover:bg-secondary/30 border border-border/40 rounded-full px-4 py-2 transition-all duration-300 shadow-sm focus-within:border-primary/30 focus-within:bg-secondary/40"
      >
        <Search className="w-3.5 h-3.5 text-muted-foreground/40 mr-3 transition-colors group-focus-within:text-foreground/60" />
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
