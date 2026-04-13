"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
}

export default function SearchBar({ query, setQuery }: SearchBarProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="relative w-full lg:w-80 group mt-8 lg:mt-0"
    >
      <div className="relative flex items-center">
        <div className="absolute left-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors">
          <Search size={18} />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full bg-secondary/10 border border-border/10 rounded-2xl py-3 pl-12 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-muted-foreground/30"
        />

        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setQuery("")}
              className="absolute right-4 text-muted-foreground/40 hover:text-foreground transition-colors"
            >
              <X size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative focus line */}
      <motion.div 
        layoutId="search-focus"
        className="absolute bottom-0 left-0 right-0 h-px bg-primary scale-x-0 group-focus-within:scale-x-75 transition-transform duration-500 origin-center opacity-30" 
      />
    </motion.div>
  );
}
