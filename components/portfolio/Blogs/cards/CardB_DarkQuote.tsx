"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import PlatformBadge from "../PlatformBadge";
import { IBlog } from "@/lib/db/models/Blog";

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
      className="group relative flex flex-col rounded-[2.5rem] bg-foreground text-background p-6 md:p-8 min-h-[250px] justify-between overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-6 md:p-8 opacity-10">
        <Quote size={60} fill="currentColor" />
      </div>

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-3">
            <PlatformBadge platform={blog.platform} className="bg-background text-foreground" />
        </div>
        
        <h3 className="text-lg md:text-xl font-bold tracking-tight leading-tight mt-4">
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
                className="text-[9px] font-black uppercase tracking-[0.25em] text-background/40 hover:text-background transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="h-[2px] w-8 bg-background/20 group-hover:w-12 transition-all" />
      </div>
    </motion.a>
  );
}
