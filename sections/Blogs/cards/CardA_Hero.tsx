"use client";

import { ArrowUpRight, Clock } from "lucide-react";
import PlatformBadge from "../PlatformBadge";
import type { IBlog } from "@/types/blog";
import OptimizedImage from "../OptimizedImage";

interface CardProps {
  blog: IBlog;
  onTagClick: (tag: string) => void;
}

export default function CardA_Hero({ blog, onTagClick, isPriority = false }: CardProps & { isPriority?: boolean }) {
  return (
    <a
      href={blog.handle}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col  rounded-3xl bg-background border border-border/50 overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] "
    >
      <div className={`relative ${isPriority ? 'aspect-[21/9]' : 'aspect-[16/7]'} overflow-hidden`}>
        {blog.thumbnail_url && (
          <OptimizedImage 
            src={blog.thumbnail_url} 
            alt={blog.title}
            fill
            isPriority={isPriority}
            className="object-cover transition-all duration-700"
          />
        )}
        
        <div className="absolute bottom-4 left-4">
          <PlatformBadge platform={blog.platform} />
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
            {blog.tags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.preventDefault();
                  onTagClick(tag);
                }}
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
              >
                {tag}
              </button>
            ))}
        </div>

        <h3 className={`font-bold tracking-tight text-foreground leading-tight ${isPriority ? 'text-xl font-bold mb-3' : 'text-lg font-bold mb-2'}`}>
          {blog.title}
        </h3>
        
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2 text-xs font-medium">
          {blog.subtitle}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border/10">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock size={12} strokeWidth={3} /> {blog.etr} MIN
            </span>
          </div>
          <ArrowUpRight size={16} className="text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      </div>
    </a>
  );
}
