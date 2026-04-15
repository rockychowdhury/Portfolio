"use client";

import { motion } from "framer-motion";
import { Star, GitFork, ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface PinnedRepoCardProps {
  repo: {
    name: string;
    description: string;
    url: string;
    stars: number;
    forks: number;
    language: { name: string; color: string } | null;
    topics: string[];
    pushedAt: string;
    sparkline: number[];
  };
  index: number;
}

export default function PinnedRepoCard({ repo, index }: PinnedRepoCardProps) {
  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      className="group block py-6 transition-all duration-300"
    >
      <div className="flex flex-col gap-2">
        {/* 1. Header: Icon - Name - Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
             <FaGithub className="w-4 h-4 text-foreground/40 group-hover:text-foreground transition-colors" />
             <h4 className="text-[15px] font-bold tracking-tight text-foreground/90 group-hover:text-primary transition-colors truncate">
               {repo.name}
             </h4>
             
             {/* Dynamic dot indicator for language */}
             <div 
               className="w-1.5 h-1.5 rounded-full flex-shrink-0" 
               style={{ backgroundColor: repo.language?.color || "var(--border)" }}
             />
          </div>

          <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest text-foreground/20 group-hover:text-foreground/40 transition-colors uppercase italic">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              <span>{repo.stars}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-3 h-3" />
              <span>{repo.forks}</span>
            </div>
            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
          </div>
        </div>

        {/* 2. Body: Small Description */}
        <div className="max-w-[95%]">
          <p className="text-[12px] leading-relaxed text-foreground/50 font-medium line-clamp-2 group-hover:text-foreground/70 transition-colors">
            {repo.description || "Experimental technical project exploring high-performance architecture and modern frontend orchestration."}
          </p>
        </div>
      </div>
      
      {/* Subtle bottom border highlight on hover */}
      <motion.div 
        className="w-0 h-[1px] bg-primary/20 mt-4 group-hover:w-full transition-all duration-700"
      />
    </motion.a>
  );
}
