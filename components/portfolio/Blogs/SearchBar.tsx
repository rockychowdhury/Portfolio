"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

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
        <div className="absolute left-4 z-10 text-muted-foreground/30 group-focus-within:text-foreground transition-colors pointer-events-none">
          <Search size={16} strokeWidth={2.5} />
        </div>
        
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your database..."
          className="h-12 w-full bg-background/50 dark:bg-zinc-900/50 border border-primary/20 pl-12 pr-12 text-sm font-medium transition-all placeholder:text-muted-foreground/40 focus-visible:ring-2 focus-visible:ring-primary/10 focus-visible:border-primary/40 focus-visible:bg-background rounded-full shadow-sm"
        />

        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setQuery("")}
              className="absolute right-4 text-muted-foreground/40 hover:text-foreground transition-colors p-1"
            >
              <X size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
