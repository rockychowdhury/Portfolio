"use client";

import { motion } from "framer-motion";
import { Play, ArrowUpRight } from "lucide-react";
import PlatformBadge from "../PlatformBadge";
import { IBlog } from "@/lib/db/models/Blog";

interface CardProps {
  blog: IBlog;
  onTagClick: (tag: string) => void;
}

export default function CardC_Platform({ blog, onTagClick }: CardProps) {
  const isYouTube = blog.platform === "YouTube";

  return (
    <motion.a
      href={blog.handle}
      target="_blank"
      rel="noopener noreferrer"
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6 }}
      className={`group relative flex flex-col rounded-3xl bg-secondary/10 border border-border/10 overflow-hidden transition-all duration-300 ${isYouTube ? 'hover:border-[#ff0000]/30' : ''}`}
    >
      <div className="relative aspect-video overflow-hidden">
        {blog.thumbnail_url ? (
          <motion.img 
            src={blog.thumbnail_url} 
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
             <Play className="text-muted-foreground/20" size={40} />
          </div>
        )}
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 transform scale-75 group-hover:scale-100 transition-transform duration-300">
             <Play fill="white" size={24} />
          </div>
        </div>

        <div className="absolute top-4 left-4">
           <PlatformBadge platform={blog.platform} />
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-foreground leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
          {blog.title}
        </h3>
        
        <div className="flex items-center justify-between">
           <div className="flex gap-2">
             {blog.tags.slice(0, 1).map(tag => (
               <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">#{tag}</span>
             ))}
           </div>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
              {blog.etr} Min <ArrowUpRight size={12} />
           </div>
        </div>
      </div>
    </motion.a>
  );
}
