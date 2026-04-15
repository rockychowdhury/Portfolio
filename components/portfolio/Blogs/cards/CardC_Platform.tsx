"use client";

import { motion } from "framer-motion";
import { Play, ArrowUpRight } from "lucide-react";
import PlatformBadge from "../PlatformBadge";
import { IBlog } from "@/lib/db/models/Blog";
import OptimizedImage from "../OptimizedImage";

interface CardProps {
  blog: IBlog;
  onTagClick: (tag: string) => void;
}

export default function CardC_Platform({ blog, onTagClick }: CardProps) {
  return (
    <motion.a
      href={blog.handle}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -4 }}
      className="group relative flex flex-col rounded-[2.5rem] bg-white border border-border/80 overflow-hidden shadow-sm transition-all hover:shadow-xl dark:bg-zinc-800/80"
    >
      <div className="relative aspect-video overflow-hidden">
        {blog.thumbnail_url ? (
          <OptimizedImage 
            src={blog.thumbnail_url} 
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
             <Play className="text-muted-foreground/20" size={40} />
          </div>
        )}
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[4px]">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-zinc-900 shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-500">
             <Play fill="currentColor" size={24} className="ml-1" />
          </div>
        </div>

        <div className="absolute top-4 right-4">
           <PlatformBadge platform={blog.platform} />
        </div>
      </div>

      <div className="p-6 md:p-8">
        <h3 className="text-xl md:text-2xl font-bold text-foreground leading-tight mb-6 line-clamp-2">
          {blog.title}
        </h3>
        
        <div className="flex items-center justify-between">
           <div className="flex flex-wrap gap-x-3 gap-y-1">
             {blog.tags.map(tag => (
               <button
                 key={tag}
                 onClick={(e) => {
                   e.preventDefault();
                   onTagClick(tag);
                 }}
                 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-primary transition-colors"
               >
                 {tag}
               </button>
             ))}
           </div>
           <ArrowUpRight size={16} className="text-muted-foreground/20 group-hover:text-primary transition-colors duration-300" />
        </div>
      </div>
    </motion.a>
  );
}
