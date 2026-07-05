"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import PlatformBadge from "../PlatformBadge";
import { IBlog } from "@/lib/db/models/Blog";
import OptimizedImage from "../OptimizedImage";

interface CardProps {
  blog: IBlog;
  onTagClick: (tag: string) => void;
}

export default function CardE_WideBanner({ blog, onTagClick }: CardProps) {
  return (
    <motion.a
      href={blog.handle}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col rounded-3xl bg-secondary/30 border border-border/50 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 break-inside-avoid w-full"
    >
      {/* Top Image */}
      <div className="relative w-full aspect-[21/9] overflow-hidden">
        {blog.thumbnail_url && (
          <OptimizedImage 
            src={blog.thumbnail_url} 
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        )}
        <div className="absolute top-4 left-4 z-10">
           <PlatformBadge platform={blog.platform} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-4">
           <Sparkles size={14} className="text-primary animate-pulse" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Featured Case Study</span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mb-3 leading-[1.1] group-hover:text-primary transition-colors">
          {blog.title}
        </h3>
        
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
          {blog.subtitle}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/10">
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider">
            {blog.etr} MIN <ArrowUpRight size={16} className="text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/5 blur-[100px] rounded-full" />
    </motion.a>
  );
}
