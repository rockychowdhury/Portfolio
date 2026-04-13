"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import PlatformBadge from "../PlatformBadge";
import { IBlog } from "@/lib/db/models/Blog";

interface CardProps {
  blog: IBlog;
  onTagClick: (tag: string) => void;
}

export default function CardA_Hero({ blog, onTagClick }: CardProps) {
  return (
    <motion.a
      href={blog.handle}
      target="_blank"
      rel="noopener noreferrer"
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col rounded-[2rem] bg-secondary/10 border border-border/10 overflow-hidden transition-shadow hover:shadow-2xl hover:shadow-primary/5"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {blog.thumbnail_url && (
          <motion.img 
            src={blog.thumbnail_url} 
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        
        <div className="absolute bottom-4 left-6">
          <PlatformBadge platform={blog.platform} />
        </div>
      </div>

      <div className="p-8 pb-10">
        <h3 className="text-2xl font-bold tracking-tight text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
          {blog.title}
        </h3>
        
        <p className="text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-2">
          {blog.subtitle}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-wrap gap-2">
            {blog.tags.slice(0, 2).map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.preventDefault();
                  onTagClick(tag);
                }}
                className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground/40">
            <span className="flex items-center gap-1.5 group-hover:text-foreground transition-all">
              {blog.etr} MIN <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}
