"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { GitFork, Star, ArrowUpRight } from "lucide-react";

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

const premiumEase = [0.25, 0.4, 0.25, 1];

export default function PinnedRepos({ repos }: PinnedReposProps) {
  if (!repos || repos.length === 0) return null;

  return (
    <div className="mt-12 md:mt-24">
      <div className="flex items-end justify-between mb-12">
        <h3 className="text-3xl font-light tracking-tighter text-white uppercase sm:text-4xl">Featured Repositories</h3>
        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground/30 hidden sm:block">Open Source Showcase</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {repos.map((repo, i) => (
          <motion.a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: premiumEase }}
            className="group relative flex flex-col justify-between rounded-[2rem] bg-secondary/10 p-8 md:p-10 border border-border/10 hover:border-foreground/20 hover:bg-secondary/20 transition-all duration-500 overflow-hidden"
          >
            {/* Header / Language */}
            <div className="flex items-center justify-between mb-8">
              {repo.language ? (
                <div className="flex items-center gap-2">
                   <span 
                    className="block w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                    style={{ backgroundColor: repo.language.color }}
                  />
                  <span className="text-[10px] font-black tracking-widest uppercase text-muted-foreground/60">{repo.language.name}</span>
                </div>
              ) : <div />}
              <ArrowUpRight size={18} className="text-white/20 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
            </div>

            <div className="mb-10">
              <h4 className="text-2xl font-light tracking-tight text-white mb-4 group-hover:text-foreground transition-colors">
                {repo.name}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed font-light mb-6 line-clamp-2">
                {repo.description || "No description provided."}
              </p>
              
              {/* Tech Topics */}
              <div className="flex flex-wrap gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                {repo.topics.slice(0, 3).map((topic) => (
                  <span key={topic} className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white/80 transition-colors">
                    #{topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-white/30 group-hover:text-yellow-500/80 transition-colors" />
                  <span className="text-xs font-medium text-white/40 group-hover:text-white/80">{repo.stars}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitFork size={14} className="text-white/30 group-hover:text-blue-500/80 transition-colors" />
                  <span className="text-xs font-medium text-white/40 group-hover:text-white/80">{repo.forks}</span>
                </div>
              </div>
              <span className="text-[10px] font-black tracking-widest uppercase text-muted-foreground/30">
                {formatDistanceToNow(new Date(repo.pushedAt), { addSuffix: true })}
              </span>
            </div>

            {/* Particle Glow Background Effect */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-white/5 blur-[80px] rounded-full group-hover:bg-white/10 transition-colors duration-700" />
          </motion.a>
        ))}
      </div>
    </div>
  );
}
