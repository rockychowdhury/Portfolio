"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BookMarked, Star, GitCommit, Users, GitMerge } from "lucide-react";
import CountUp from "../ProblemSolving/CountUp";

interface MetricsBarProps {
  metrics: {
    repos: number;
    stars: number;
    commits: number;
    followers: number;
    prs: number;
  };
}

const premiumEase = [0.25, 0.4, 0.25, 1];

export default function MetricsBar({ metrics }: MetricsBarProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const stats = [
    { label: "Repos", value: metrics.repos, icon: BookMarked },
    { label: "Stars", value: metrics.stars, icon: Star },
    { label: "Commits", value: metrics.commits, icon: GitCommit },
    { label: "Followers", value: metrics.followers, icon: Users },
    { label: "Merged PRs", value: metrics.prs, icon: GitMerge },
  ];

  return (
    <div
      ref={ref}
      className="flex flex-wrap items-start gap-12 md:gap-20"
    >
      {stats.map((stat, i) => {
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: i * 0.1, ease: premiumEase }}
            className="flex flex-col"
          >
            <div className="text-5xl font-light tracking-tight text-foreground md:text-6xl tabular-nums mb-1">
              {isInView ? (
                <CountUp to={stat.value} duration={2} />
              ) : (
                "0"
              )}
            </div>
            
            <p className="text-[11px] font-black tracking-[0.3em] uppercase text-muted-foreground/50">
              {stat.label}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
