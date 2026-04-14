"use client";

import { motion } from "framer-motion";
import { Plus, Minus, MoveDown } from "lucide-react";

interface ShowAllButtonProps {
  isExpanded: boolean;
  onClick: () => void;
  count: number;
}

export default function ShowAllButton({ isExpanded, onClick, count }: ShowAllButtonProps) {
  return (
    <div className="relative flex justify-center w-full py-12">
      {/* Horizontal lines extending from the button to complete the visual spine */}
      <div className="absolute top-1/2 left-0 right-1/2 h-px bg-border/20 -translate-y-1/2 -z-10" />
      <div className="absolute top-1/2 left-1/2 right-0 h-px bg-border/20 -translate-y-1/2 -z-10" />

      <button
        onClick={onClick}
        className="group relative flex items-center gap-3 px-8 py-4 bg-background border border-border/80 rounded-full shadow-lg hover:shadow-xl hover:border-primary/50 transition-all z-10"
      >
        <span className="text-xs font-bold tracking-widest uppercase text-foreground">
          {isExpanded ? "Show Less" : `Show All Certifications (${count} more)`}
        </span>
        
        <div className={`p-1.5 rounded-full bg-secondary/50 transition-transform duration-500 ${isExpanded ? "rotate-180" : ""}`}>
           {isExpanded ? <Minus className="w-3.5 h-3.5 text-primary" /> : <Plus className="w-3.5 h-3.5 text-primary" />}
        </div>

        {/* Floating Arrow Micro-animation */}
        {!isExpanded && (
           <motion.div
             animate={{ y: [0, 4, 0] }}
             transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
             className="absolute -bottom-6 left-1/2 -translate-x-1/2 hidden lg:block"
           >
             <MoveDown className="w-4 h-4 text-primary opacity-50" />
           </motion.div>
        )}
      </button>
    </div>
  );
}
