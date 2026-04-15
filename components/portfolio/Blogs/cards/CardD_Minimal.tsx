"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Calendar } from "lucide-react";
import PlatformBadge from "../PlatformBadge";
import { IBlog } from "@/lib/db/models/Blog";
import { format } from "date-fns";

interface CardProps {
  blog: IBlog;
  onTagClick: (tag: string) => void;
}

export default function CardD_Minimal({ blog, onTagClick }: CardProps) {
  return (
    <motion.a
      href={blog.handle}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -4 }}
      className="group relative flex flex-col rounded-3xl bg-white border border-border/80 p-8 shadow-sm transition-all hover:shadow-xl dark:bg-zinc-800/80"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
            {blog.tags.map(tag => (
              <button
                key={tag}
                onClick={(e) => {
                  e.preventDefault();
                  onTagClick(tag);
                }}
                className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 hover:text-primary transition-colors"
              >
                {tag}
              </button>
            ))}
        </div>
        <PlatformBadge platform={blog.platform} className="!bg-transparent !text-muted-foreground/40 !p-0 !text-[8px]" />
      </div>

      <h3 className="text-xl font-bold text-foreground leading-tight mb-6 group-hover:text-primary transition-colors">
        {blog.title}
      </h3>

      <div className="mt-8 pt-6 border-t border-border/10 flex items-center justify-between">
         <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/20">
            {blog.etr} MIN READ
         </div>
         <ArrowUpRight size={16} className="text-muted-foreground/20 group-hover:text-primary transition-colors duration-300" />
      </div>
    </motion.a>
  );
}
