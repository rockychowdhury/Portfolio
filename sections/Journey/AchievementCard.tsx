"use client";

import React from "react";
import { ExternalLink, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import StrengthIcon from "./StrengthIcon";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface Achievement {
  _id: string;
  title: string;
  date: string;
  date_sortable: string | Date;
  strength: number;
  handle?: string;
  img_url?: string;
}

const AchievementCard = ({ achievement, index = 0 }: { achievement: Achievement; index?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ 
        duration: 0.6,
        delay: (index % 5) * 0.08,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      className="group relative flex items-center gap-4 py-3 px-4 -mx-4 rounded-xl transition-all duration-300 hover:bg-foreground/[0.02] dark:hover:bg-white/[0.02] hover:backdrop-blur-sm border border-transparent hover:border-border/40"
    >
      {/* Node connection line on hover */}
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 border-t border-dashed border-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block" />

      {/* Icon Shield */}
      <div className="relative flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-background border border-border/50 group-hover:border-primary/30 group-hover:shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:group-hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-300 shrink-0 overflow-hidden">
         {achievement.strength >= 4 && (
           <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
         )}
         <StrengthIcon strength={achievement.strength} className="w-4.5 h-4.5 group-hover:scale-110 transition-transform duration-300 relative z-10" />
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-2 md:gap-5 overflow-hidden">
        <h4 className="text-[15px] font-medium text-foreground/90 group-hover:text-foreground transition-colors truncate max-w-[280px] md:max-w-[420px]">
          {achievement.title}
        </h4>
        
        <div className="flex items-center gap-4 shrink-0">
           <span className="text-[12px] tabular-nums text-muted-foreground/60 font-medium font-mono group-hover:text-muted-foreground transition-colors">
             {achievement.date}
           </span>

           {achievement.handle && (
             <a
               href={achievement.handle}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center justify-center size-8 rounded-full bg-foreground/[0.03] hover:bg-foreground/[0.1] dark:hover:bg-white/[0.1] text-muted-foreground hover:text-foreground transition-all duration-300 opacity-0 md:-translate-x-4 md:group-hover:translate-x-0 group-hover:opacity-100 md:absolute right-4"
             >
               <ExternalLink className="w-3.5 h-3.5" />
             </a>
           )}
        </div>
      </div>
    </motion.div>
  );
};



export default AchievementCard;
