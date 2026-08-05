"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import PlatformBadge from "../PlatformBadge";
import type { IBlog } from "@/types/blog";

interface CardProps {
  blog: IBlog;
  onTagClick: (tag: string) => void;
}

export default function CardB_DarkQuote({ blog, onTagClick }: CardProps) {
  return (
    <motion.a
      href={blog.handle}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.01 }}
      className="group relative flex flex-col  rounded-3xl bg-secondary text-foreground p-5 min-h-[180px] justify-between overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-5 opacity-10">
        <Quote size={60} fill="currentColor" />
      </div>

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-3">
            <PlatformBadge platform={blog.platform} variant="mono" />
        </div>
        
        <h3 className="text-base font-bold tracking-tight leading-tight mt-4">
          "{blog.title}"
        </h3>
      </div>

      <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {blog.tags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.preventDefault();
                  onTagClick(tag);
                }}
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="h-[2px] w-8 bg-primary/50 group-hover:w-12 transition-all" />
      </div>
    </motion.a>
  );
}
