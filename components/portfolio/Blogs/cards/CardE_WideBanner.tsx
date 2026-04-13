"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import PlatformBadge from "../PlatformBadge";
import { IBlog } from "@/lib/db/models/Blog";

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
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col md:flex-row rounded-[2.5rem] bg-secondary/10 border border-border/10 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 md:col-span-2"
    >
      {/* Left / Top Image */}
      <div className="relative w-full md:w-[45%] aspect-video md:aspect-auto overflow-hidden">
        {blog.thumbnail_url && (
          <motion.img 
            src={blog.thumbnail_url} 
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        )}
        <div className="absolute top-6 left-6 z-10">
           <PlatformBadge platform={blog.platform} />
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-6">
           <Sparkles size={16} className="text-primary animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Featured Case Study</span>
        </div>

        <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6 leading-[1.1] group-hover:text-primary transition-colors">
          {blog.title}
        </h3>
        
        <p className="text-muted-foreground text-lg leading-relaxed mb-8 line-clamp-2 md:line-clamp-3">
          {blog.subtitle}
        </p>

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/10">
          <div className="flex flex-wrap gap-4">
            {blog.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-primary cursor-pointer transition-colors">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs font-black text-foreground uppercase tracking-widest">
            {blog.etr} MIN <ArrowUpRight size={18} className="text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/5 blur-[100px] rounded-full" />
    </motion.a>
  );
}
