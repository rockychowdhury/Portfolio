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
  strength: number;
  handle?: string;
  img_url?: string;
}

interface AchievementCardProps {
  achievement: Achievement;
  index: number;
  isLeft: boolean;
}

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4 }}
      className="flex items-center group py-1.5"
    >
      {/* status indicator - pill */}
      <div className="w-10 flex justify-center shrink-0">
        <div className={cn(
          "w-1.5 h-6 rounded-full transition-all duration-300",
          "bg-black/[0.1] dark:bg-white/[0.1]",
          achievement.strength >= 4 && "bg-amber-500/40"
        )} />
      </div>

      <div className="flex items-center gap-3 overflow-hidden">
        {/* icon */}
        <div className="shrink-0 transition-transform group-hover:scale-110 duration-300">
           <StrengthIcon strength={achievement.strength} className="w-4 h-4" />
        </div>

        {/* Title & Date */}
        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 overflow-hidden">
          <h4 className="text-[14px] font-medium text-foreground/90 truncate max-w-[300px] md:max-w-[450px]">
            {achievement.title}
          </h4>
          
          <div className="flex items-center gap-3 shrink-0">
             <span className="text-[12px] text-muted-foreground/60 font-medium">
               {achievement.date}
             </span>

             {achievement.handle && (
               <a
                 href={achievement.handle}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/[0.05] dark:hover:bg-white/[0.05] rounded"
               >
                 <ExternalLink className="w-3 h-3 text-muted-foreground" />
               </a>
             )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};


export default AchievementCard;
