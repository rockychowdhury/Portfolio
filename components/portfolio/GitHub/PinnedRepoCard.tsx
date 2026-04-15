"use client";

import { motion } from "framer-motion";
import { Star, GitFork } from "lucide-react";
import RepoSparkline from "./RepoSparkline";

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
  const lastUpdate = new Date(repo.pushedAt);
  const isRecent = (new Date().getTime() - lastUpdate.getTime()) < 7 * 24 * 60 * 60 * 1000;
  const langColor = repo.language?.color || "#7B7B7B";

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
        delay: index * 0.05,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.3 }
      }}
      className="group relative flex items-center justify-between gap-6 p-4 px-6 bg-foreground/[0.02] backdrop-blur-md border border-foreground/[0.08] rounded-2xl overflow-hidden transition-all duration-500 hover:bg-foreground/[0.05]"
      style={{
        // Dynamic border color on hover using CSS variables hack or just inline style bridge
        borderColor: "rgba(var(--foreground-rgb), 0.08)",
      }}
    >
      {/* Language Background Glow (Hidden, visible on hover) */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none"
        style={{ backgroundColor: langColor }}
      />
      
      {/* 1. Repository Name & Lang Indicator */}
      <div className="flex items-center gap-4 min-w-0 flex-shrink-0 z-10">
        <div 
          className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover:scale-150 group-hover:shadow-[0_0_12px_var(--lang-glow)]" 
          style={{ 
            backgroundColor: langColor,
            // @ts-ignore
            "--lang-glow": langColor 
          }}
        />
        <div className="flex flex-col min-w-0">
          <h4 className="text-base font-semibold tracking-tighter text-foreground transition-colors truncate max-w-[140px] md:max-w-[200px]">
            {repo.name}
          </h4>
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30 italic group-hover:text-foreground/50 transition-colors">
            {repo.language?.name || "Repository"}
          </span>
        </div>
      </div>

      {/* 2. Sparkline (Dynamic Reveal) */}
      <div className="hidden lg:block flex-grow h-8 opacity-[0.15] group-hover:opacity-100 transition-all duration-700 scale-y-75 group-hover:scale-y-100">
        <RepoSparkline data={repo.sparkline} color={langColor} />
      </div>

      {/* 3. Metrics (High Density) */}
      <div className="flex items-center gap-6 flex-shrink-0 z-10">
        <div className="flex items-center gap-5 text-[11px] font-black italic tracking-widest text-foreground/20 group-hover:text-foreground/60 transition-all duration-500 uppercase">
          <div className="flex items-center gap-1.5 transition-transform group-hover:-translate-y-0.5">
            <Star className="w-3.5 h-3.5 text-foreground/10 group-hover:text-yellow-500/80 transition-colors" />
            <span>{repo.stars}</span>
          </div>
          <div className="flex items-center gap-1.5 transition-transform group-hover:translate-y-0.5">
            <GitFork className="w-3.5 h-3.5 text-foreground/10 group-hover:text-blue-500/80 transition-colors" />
            <span>{repo.forks}</span>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center justify-center w-6 overflow-visible">
          {isRecent ? (
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500/60 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"></span>
             </span>
           ) : (
             <div className="w-1.5 h-1.5 rounded-full bg-foreground/10 group-hover:bg-foreground/20 transition-colors" />
           )}
        </div>
      </div>

      {/* Hover Border Glow Effect */}
      <motion.div 
        className="absolute inset-0 border border-transparent group-hover:border-inherit rounded-2xl pointer-events-none transition-colors duration-500"
        style={{ 
          // @ts-ignore
          borderColor: "inherit" 
        }}
        whileHover={{ 
          borderColor: langColor + "44",
        }}
      />
    </motion.a>
  );
}
