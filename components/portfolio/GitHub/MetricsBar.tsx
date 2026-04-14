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
    allTimeContributions: number;
    currentYearContributions: number;
    previousYearContributions: number;
  };
}

const premiumEase: [number, number, number, number] = [0.25, 0.4, 0.25, 1];

export default function MetricsBar({ metrics }: MetricsBarProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const yearDiff = metrics.currentYearContributions - metrics.previousYearContributions;
  const isUp = yearDiff >= 0;

  const stats = [
    { label: "All-Time", value: metrics.allTimeContributions, icon: BookMarked },
    { 
      label: `In ${new Date().getFullYear()}`, 
      value: metrics.currentYearContributions, 
      icon: GitCommit,
      comparison: {
        value: Math.abs(yearDiff),
        isUp,
        label: "vs last year"
      }
    },
    { label: "Stars", value: metrics.stars, icon: Star },
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
            className="flex flex-col group cursor-default"
          >
            <div className="flex items-baseline gap-2">
              <div className="text-5xl font-light tracking-tight text-foreground md:text-6xl tabular-nums mb-1">
                {isInView ? <CountUp to={stat.value} duration={2} /> : "0"}
              </div>

              {/* Comparison Badge */}
              {stat.comparison && isInView && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 1.5 }}
                  className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    stat.comparison.isUp 
                      ? "text-emerald-500 bg-emerald-500/10" 
                      : "text-rose-500 bg-rose-500/10"
                  }`}
                >
                  {stat.comparison.isUp ? "+" : "-"}
                  {stat.comparison.value}
                </motion.div>
              )}
            </div>
            
            <div className="flex flex-col gap-0.5">
              <p className="text-[11px] font-black tracking-[0.3em] uppercase text-muted-foreground/50">
                {stat.label}
              </p>
              {stat.comparison && (
                <span className="text-[8px] font-medium uppercase tracking-widest text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  {stat.comparison.label}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
