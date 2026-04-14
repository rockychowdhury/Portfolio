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
      className="relative w-full lg:w-96 group"
    >
      <div className="relative flex items-center">
        <div className="absolute left-0 text-muted-foreground/30 group-focus-within:text-foreground transition-colors">
          <Search size={16} strokeWidth={3} />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH ARTICLES //"
          className="w-full bg-transparent border-b border-border/20 py-4 pl-8 pr-10 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-foreground/40 transition-all placeholder:text-muted-foreground/20"
        />

        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setQuery("")}
              className="absolute right-0 text-muted-foreground/40 hover:text-foreground transition-colors"
            >
              <X size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
