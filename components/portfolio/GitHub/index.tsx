"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import MeaningfulStatsRow from "./MeaningfulStatsRow";
import ContributionHeatmap from "./ContributionHeatmap";
import LanguageIntelligence from "./LanguageIntelligence";
import PinnedRepoGrid from "./PinnedRepoGrid";
import { GridPattern } from "@/components/ui/BackgroundPatterns";
import {
  HeatmapSkeleton,
  LanguagesSkeleton,
  MetricsSkeleton,
  PinnedReposSkeleton,
} from "./Skeletons";

// Premium easing for sections
const premiumEase: [number, number, number, number] = [0.25, 0.4, 0.25, 1] as const;

const letterAnimation = {
  hidden: { opacity: 0, y: 80, rotateX: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      delay: 0.1 + i * 0.05,
      ease: premiumEase,
    },
  }),
};

interface GitHubStats {
  metrics: {
    repos: number;
    stars: number;
    commits: number;
    followers: number;
    prs: number;
    allTimeContributions: number;
    currentYearContributions: number;
    previousYearContributions: number;
    productivity: {
      mostActiveDay: string;
      activePercentage: number;
    };
  };
  heatmap: {
    date: string;
    count: number;
  }[];
  streak: {
    current: number;
    longest: number;
  };
  languages: {
    name: string;
    color: string;
    size: number;
    percentage: number;
    repoCount: number;
  }[];
  pinned: {
    name: string;
    description: string;
    url: string;
    stars: number;
    forks: number;
    language: { name: string; color: string } | null;
    topics: string[];
    pushedAt: string;
    sparkline: number[];
  }[];
  contributionYears?: number[];
}

export default function GitHubSection() {
  const [data, setData] = useState<GitHubStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-10%" });

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/github");
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setData(json);
      } catch (err) {
        console.error("Github fetch error", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const titleWords = "Open Source".split(" ");
  const activityWords = "Activity".split("");

  // Derived subtext data
  const years = data?.contributionYears || [];
  const activeSince = years.length > 0 ? Math.min(...years) : 2022;
  const primaryStack = data?.languages?.slice(0, 4).map(l => l.name).join(" · ") || "Python · FastAPI · JavaScript · TypeScript";

  return (
    <SectionWrapper id="github" className="relative min-h-screen w-full overflow-hidden bg-background py-24 text-foreground">
      <GridPattern />

      <div className="relative container-main">
        {/* Section Headline */}
        <div className="mb-12 md:mb-32 text-left" ref={titleRef}>
          <div className="flex flex-col gap-2">
            <h2 className="flex flex-wrap items-end text-[clamp(3.5rem,10vw,8.5rem)] font-medium leading-[1.1] tracking-tighter text-foreground">
              {titleWords.map((word, wordIdx) => (
                <div key={wordIdx} className="flex overflow-hidden mr-4 pb-4 -mb-4">
                  {word.split("").map((letter, i) => (
                    <motion.span
                      key={i}
                      custom={i + (wordIdx * 5)}
                      variants={letterAnimation}
                      initial="hidden"
                      animate={isTitleInView ? "visible" : "hidden"}
                      className="inline-block origin-bottom"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>
              ))}
              <div className="flex items-center">
                <motion.span 
                  initial="hidden"
                  animate={isTitleInView ? "visible" : "hidden"}
                  variants={letterAnimation}
                  custom={12}
                  className="text-[0.6em] text-muted-foreground/20 italic font-light mr-4"
                >
                  &
                </motion.span>
                <div className="flex overflow-hidden pb-4 -mb-4">
                  {activityWords.map((letter, i) => (
                    <motion.span
                      key={i}
                      custom={i + 15}
                      variants={letterAnimation}
                      initial="hidden"
                      animate={isTitleInView ? "visible" : "hidden"}
                      className="inline-block origin-bottom text-muted-foreground/20"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>
              </div>
            </h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={isTitleInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.8, ease: premiumEase }}
            className="mt-12 flex items-center gap-4"
          >
            <div className="h-px w-8 bg-foreground/40" />
            <p className="text-xs md:text-sm font-medium italic tracking-[0.1em] text-muted-foreground/40">
              {isLoading
                ? "Synchronizing Live Telemetry..."
                : error || !data 
                ? "Live stats temporarily unavailable."
                : `${data.metrics.repos} repositories · Active since ${activeSince} · Primary stack: ${primaryStack}`}
            </p>
          </motion.div>
        </div>

        {/* Main Content Sections */}
        {!error && (
          <div className="flex flex-col gap-12 md:gap-32">
            {/* 1. Meaningful Stats Row */}
            {isLoading ? (
              <MetricsSkeleton />
            ) : (
              data && <MeaningfulStatsRow metrics={data.metrics} streak={data.streak} heatmap={data.heatmap} />
            )}

            {/* 2. Two-column Layout: Heatmap & Language Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
              {/* Left Column: Heatmap */}
              <div className="lg:col-span-8 flex flex-col gap-12">
                {isLoading ? (
                  <HeatmapSkeleton />
                ) : (
                  data && (
                    <ContributionHeatmap 
                      heatmap={data.heatmap} 
                      stats={data.metrics}
                      streak={data.streak}
                    />
                  )
                )}

                {/* Pinned Repositories: High Fidelity Header */}
                <div className="flex flex-col gap-5 pt-6 border-t border-border/10">
                   <div className="flex items-center gap-3">
                     <div className="h-px w-6 bg-primary/30" />
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 flex items-center gap-2">
                       Featured Repositories
                     </h3>
                   </div>
                   {isLoading ? (
                     <PinnedReposSkeleton />
                   ) : (
                     data && <PinnedRepoGrid repos={data.pinned} />
                   )}
                </div>
              </div>

              {/* Right Column: Language Intelligence */}
              <div className="lg:col-span-4">
                {isLoading ? (
                  <LanguagesSkeleton />
                ) : (
                  data && <LanguageIntelligence languages={data.languages} />
                )}
              </div>
            </div>

          </div>
        )}

        {/* Fallback Gracefully on Error */}
        {error && !isLoading && (
          <div className="flex justify-center items-center h-64 border border-dashed border-border/20 rounded-3xl bg-secondary/5 text-muted-foreground text-[10px] font-black uppercase tracking-[0.5em]">
            SYSTEM_CONNECTION_FAILED // API_LIMIT_REACHED
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
