"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { IBlog } from "@/lib/db/models/Blog";

interface CardProps {
  blog: IBlog;
  onTagClick: (tag: string) => void;
}

export default function CardF_Micro({ blog, onTagClick }: CardProps) {
  return (
    <motion.a
      href={blog.handle}
      target="_blank"
      whileHover={{ y: -4 }}
      className="group relative flex flex-col rounded-3xl bg-white border border-border/80 p-6 shadow-sm transition-all hover:shadow-xl dark:bg-zinc-800/80"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">
          {blog.platform}
        </span>
        <ArrowUpRight size={14} className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>

      <h3 className="text-lg font-bold leading-tight text-foreground line-clamp-3 mb-6">
        {blog.title}
      </h3>

      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-auto">
        {blog.tags.map((tag) => (
          <button
            key={tag}
            onClick={(e) => {
              e.preventDefault();
              onTagClick(tag);
            }}
            className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-primary transition-colors"
          >
            #{tag}
          </button>
        ))}
      </div>
    </motion.a>
  );
}
