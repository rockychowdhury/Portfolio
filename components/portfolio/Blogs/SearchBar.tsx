"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Info, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  hasResults?: boolean;
}

export default function SearchBar({ query, setQuery, hasResults = true }: SearchBarProps) {
  const isIdle = !query.trim();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="relative w-full lg:w-96 group flex justify-center lg:justify-end"
    >
      <div 
        className={`relative flex items-center group max-w-[280px] w-full transition-all duration-300 rounded-full px-4 py-1.5 border border-border/40 bg-secondary/40 hover:bg-secondary/50 shadow-sm`}
      >
        <Search className="w-3.5 h-3.5 text-muted-foreground/40 mr-2.5" />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search competency..."
          className="flex-1 bg-transparent border-none py-0.5 text-[11px] font-medium focus:outline-none placeholder:text-muted-foreground/30 text-foreground"
        />

        <div className="flex items-center gap-2.5 ml-1.5">
          {/* Decorative shortcut hint */}
          <div className="hidden xs:flex items-center px-1.5 py-0.5 rounded border border-border/30 bg-background/50 shadow-sm">
            <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-tight">⌘K</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Information Tooltip */}
            <div className="relative group/info">
              <Info className="w-3.5 h-3.5 text-muted-foreground/30 hover:text-muted-foreground/50 cursor-help transition-colors" />
              <div className="absolute bottom-full mb-3 right-0 px-3 py-2 bg-popover/95 backdrop-blur-md border border-border/50 rounded-lg shadow-xl opacity-0 group-hover/info:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 translate-x-1/4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-popover-foreground">
                  Quick check skill availability you are looking for?
                </p>
              </div>
            </div>

            {/* Compact Availability Lamp */}
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 shadow-sm ${
              isIdle ? "bg-muted/10" :
              hasResults ? "bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.4)]" :
              "bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
            }`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
