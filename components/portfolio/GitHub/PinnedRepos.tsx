"use client";

import { motion } from "framer-motion";
import { Star, GitFork, ArrowUpRight } from "lucide-react";

interface PinnedRepo {
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: { name: string; color: string } | null;
  topics: string[];
  pushedAt: string;
}

interface PinnedReposProps {
  repos: PinnedRepo[];
}

export default function PinnedRepos({ repos }: PinnedReposProps) {
  if (!repos || repos.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-border/10 pb-4">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/50">Pinned Repositories</h3>
      </div>

      <div className="flex flex-col gap-1">
        {repos.map((repo, i) => (
          <motion.a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group flex flex-col gap-1 p-3 rounded-xl hover:bg-secondary/10 border border-transparent hover:border-border/10 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {repo.name}
                </h4>
                <ArrowUpRight size={14} className="text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground/40 font-medium">
                <div className="flex items-center gap-1">
                  <Star size={10} className="group-hover:text-yellow-500/50 transition-colors" />
                  <span>{repo.stars}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork size={10} className="group-hover:text-blue-500/50 transition-colors" />
                  <span>{repo.forks}</span>
                </div>
              </div>
            </div>

            {repo.language && (
              <div className="flex items-center gap-1.5">
                <span 
                  className="w-1.5 h-1.5 rounded-full" 
                  style={{ backgroundColor: repo.language.color }} 
                />
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">{repo.language.name}</span>
              </div>
            )}
          </motion.a>
        ))}
      </div>
    </div>
  );
}
