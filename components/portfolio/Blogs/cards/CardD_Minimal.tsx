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
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ x: 4 }}
      className="group relative flex flex-col rounded-2xl bg-secondary/5 border border-border/10 p-8 transition-all hover:bg-secondary/10 hover:border-primary/20"
    >
      {/* Decorative vertical line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors rounded-l-2xl" />

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
           {blog.tags.slice(0, 1).map(tag => (
             <span key={tag} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
               {tag}
             </span>
           ))}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">
           <Calendar size={12} />
           {format(new Date(blog.date_added), "MMM yyyy")}
        </div>
      </div>

      <h3 className="text-xl font-bold text-foreground leading-tight mb-4 group-hover:text-primary transition-colors">
        {blog.title}
      </h3>

      <p className="text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-3">
        {blog.subtitle}
      </p>

      <div className="mt-auto flex items-center justify-between">
         <PlatformBadge platform={blog.platform} className="!bg-transparent !text-muted-foreground/40 !p-0" />
         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/20 group-hover:text-primary transition-colors">
            {blog.etr} Min <ArrowUpRight size={14} />
         </div>
      </div>
    </motion.a>
  );
}
