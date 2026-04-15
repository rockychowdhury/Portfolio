"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import PlatformBadge from "../PlatformBadge";
import { IBlog } from "@/lib/db/models/Blog";
import OptimizedImage from "../OptimizedImage";

interface CardProps {
  blog: IBlog;
  onTagClick: (tag: string) => void;
}

export default function CardG_Overlay({ blog, onTagClick }: CardProps) {
  return (
    <motion.a
      href={blog.handle}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -4 }}
      className="group relative flex flex-col rounded-[2.5rem] bg-zinc-900 border border-border/80 overflow-hidden shadow-sm min-h-[400px] md:min-h-[450px]"
    >
      {/* Full-Bleed Background Image */}
      {blog.thumbnail_url && (
        <div className="absolute inset-0 z-0">
          <OptimizedImage 
            src={blog.thumbnail_url} 
            alt={blog.title}
            fill
            className="object-cover grayscale-[0.5] opacity-60 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-80"
          />
          {/* Scrim Gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative z-20 mt-auto p-8 flex flex-col h-full justify-end">
        <div className="flex items-center justify-between mb-6">
           <PlatformBadge platform={blog.platform} className="!bg-white/10 !backdrop-blur-md" />
           <ArrowUpRight size={18} className="text-white/20 group-hover:text-white transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight mb-6">
          {blog.title}
        </h3>
        
        <p className="text-white/40 text-sm leading-relaxed mb-8 line-clamp-2 font-medium">
          {blog.subtitle}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {blog.tags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.preventDefault();
                  onTagClick(tag);
                }}
                className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30 hover:text-primary transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-white/20 whitespace-nowrap ml-4">
             {blog.etr} MIN
          </div>
        </div>
      </div>
    </motion.a>
  );
}
