"use client";

import { motion } from "framer-motion";
import { ChevronsDown, ChevronsUp } from "lucide-react";

interface ShowAllButtonProps {
  isExpanded: boolean;
  onClick: () => void;
  count: number;
}

export default function ShowAllButton({ isExpanded, onClick, count }: ShowAllButtonProps) {
  return (
    <div className="relative flex flex-col items-center justify-center py-32 w-full">
      <div className="relative w-full flex items-center justify-center">
        {/* Subtle Horizontal Line */}
        <div className="absolute inset-x-0 h-px bg-border/10" />
        
        <div className="relative z-10 bg-background px-12">
          <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            className="group flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/60 hover:text-foreground transition-all duration-500 cursor-pointer"
          >
            {isExpanded ? (
              <>
                <ChevronsUp size={14} className="group-hover:-translate-y-1 transition-transform duration-500 opacity-60 group-hover:opacity-100 shrink-0" />
                <span className="group-hover:tracking-[0.8em] transition-all duration-700 whitespace-nowrap">Collapse List</span>
                <div className="w-6 h-px bg-muted-foreground/20 group-hover:w-10 group-hover:bg-primary transition-all duration-700 shrink-0" />
              </>
            ) : (
              <>
                <ChevronsDown size={14} className="group-hover:translate-y-1 transition-transform duration-500 opacity-60 group-hover:opacity-100 shrink-0" />
                <span className="group-hover:tracking-[0.8em] transition-all duration-700 whitespace-nowrap">
                   Show All Credentials ({count})
                </span>
                <div className="w-6 h-px bg-muted-foreground/20 group-hover:w-10 group-hover:bg-primary transition-all duration-700 shrink-0" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
