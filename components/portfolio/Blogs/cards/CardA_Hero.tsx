"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import PlatformBadge from "../PlatformBadge";
import { IBlog } from "@/lib/db/models/Blog";
import OptimizedImage from "../OptimizedImage";

interface CardProps {
  blog: IBlog;
  onTagClick: (tag: string) => void;
}

export default function CardA_Hero({ blog, onTagClick, isPriority = false }: CardProps & { isPriority?: boolean }) {
  return (
    <motion.a
      href={blog.handle}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -4 }}
      className="group relative flex flex-col rounded-[2.5rem] bg-white border border-border/60 overflow-hidden shadow-sm transition-all hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] dark:bg-zinc-800/80"
    >
      <div className={`relative ${isPriority ? 'aspect-[16/8]' : 'aspect-[16/10]'} overflow-hidden`}>
        {blog.thumbnail_url && (
          <OptimizedImage 
            src={blog.thumbnail_url} 
            alt={blog.title}
            fill
            isPriority={isPriority}
            className="object-cover grayscale-[0.2] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
          />
        )}
        
        <div className="absolute bottom-4 left-4">
          <PlatformBadge platform={blog.platform} />
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
            {blog.tags.map((tag) => (
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

        <h3 className={`font-bold tracking-tight text-foreground leading-tight group-hover:text-primary transition-colors ${isPriority ? 'text-3xl md:text-4xl mb-6' : 'text-xl md:text-2xl mb-4'}`}>
          {blog.title}
        </h3>
        
        <p className="text-muted-foreground/60 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">
          {blog.subtitle}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border/10">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
            <span className="flex items-center gap-1.5">
              <Clock size={12} strokeWidth={3} /> {blog.etr} MIN
            </span>
          </div>
          <ArrowUpRight size={16} className="text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      </div>
    </motion.a>
  );
}
