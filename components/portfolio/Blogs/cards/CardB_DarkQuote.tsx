"use client";

import { motion } from "framer-motion";
import { Quote, ArrowUpRight } from "lucide-react";
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
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col justify-between rounded-[2rem] bg-[#0a0a0a] border border-white/5 p-10 min-h-[300px] overflow-hidden transition-all duration-500 hover:border-primary/30"
    >
      {/* Decorative Rotating Quote Marks */}
      <motion.div 
        className="absolute -top-4 -right-4 text-primary opacity-[0.03] select-none pointer-events-none"
        animate={{ rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <Quote size={200} />
      </motion.div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-12">
           <PlatformBadge platform={blog.platform} className="!bg-white/10" />
           <ArrowUpRight size={20} className="text-white/20 group-hover:text-primary transition-colors duration-300" />
        </div>

        <blockquote className="text-2xl font-serif italic text-white/90 leading-tight mb-8 text-center px-4">
          "{blog.title}"
        </blockquote>

        <div className="mt-auto pt-8 border-t border-white/5 flex flex-col items-center">
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-primary/60 mb-1">
            Rocky Chowdhury
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20">
            <span>{blog.platform}</span>
            <span>•</span>
            <span>{blog.etr} Min Read</span>
          </div>
        </div>
      </div>

      {/* Hover background glow */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl pointer-events-none" />
    </motion.a>
  );
}
