"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface JourneyItem {
  _id: string;
  title: string;
  organization: string;
  duration: string;
  description: string[];
  icon?: string;
  type: string;
}

const TimelineItem = ({ item, index }: { item: JourneyItem; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1, 
        ease: [0.25, 0.4, 0.25, 1] 
      }}
      className="relative pl-12 pb-16 last:pb-0"
    >
      {/* Circle on the spine */}
      <div className="absolute left-[16.5px] top-2 w-[9px] h-[9px] rounded-full border-2 border-muted-foreground/40 bg-background z-20 group-hover:border-foreground transition-colors" />

      {/* Date/Duration Label above the content */}
      <div className="mb-4">
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
          {item.duration}
        </span>
      </div>

      {/* Content Card */}
      <div className="group relative flex flex-col gap-3">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-foreground/[0.03] dark:bg-white/[0.03] border border-border/50 text-xl group-hover:scale-110 transition-transform duration-500">
            {item.icon || "✨"}
          </div>

          <div className="flex flex-col">
            <h3 className="text-lg md:text-xl font-semibold text-foreground/90 group-hover:text-foreground transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground font-medium italic">
              {item.organization}
            </p>
          </div>
        </div>

        {/* Description Bullets */}
        <ul className="flex flex-col gap-2 mt-2 ml-14">
          {item.description.map((bullet, i) => (
            <motion.li 
              key={i}
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="text-sm md:text-base text-muted-foreground/80 leading-relaxed flex gap-3"
            >
              <span className="mt-2 w-1 h-1 rounded-full bg-foreground/20 shrink-0" />
              {bullet}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default TimelineItem;
