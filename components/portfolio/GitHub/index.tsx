"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import MetricsBar from "./MetricsBar";
import ContributionHeatmap from "./ContributionHeatmap";
import LanguageBreakdown from "./LanguageBreakdown";
import PinnedRepos from "./PinnedRepos";
import {
  HeatmapSkeleton,
  LanguagesSkeleton,
  MetricsSkeleton,
  PinnedReposSkeleton,
} from "./Skeletons";

// Hero-style easing
const premiumEase = [0.25, 0.4, 0.25, 1];

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
  }[];
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

  return (
    <SectionWrapper id="github" className="relative min-h-screen w-full overflow-hidden bg-background py-24 px-6 md:px-12 lg:px-20 text-foreground">
      {/* ── Background & Guidelines ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="mx-auto h-full max-w-[1400px] border-x border-dashed border-border/10">
          <div className="absolute top-0 left-12 h-full w-px border-l border-dashed border-border/10 hidden lg:block" />
        </div>
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        {/* Vertical Side Label */}
        <div className="absolute top-0 -left-12 hidden flex-col items-center gap-8 lg:flex">
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-muted-foreground/30 [writing-mode:vertical-lr] rotate-180">
            Telemetry // 2025
          </span>
          <div className="h-24 w-px border-l border-dashed border-border/20" />
        </div>

        {/* Section Headline */}
        <div className="mb-12 md:mb-32 lg:pl-16 text-left" ref={titleRef}>
          <div className="flex flex-col gap-2">
            <h2 className="flex flex-wrap items-end text-[4.5rem] font-medium leading-[0.8] tracking-tighter text-foreground sm:text-[6rem] md:text-[8rem] lg:text-[10rem]">
              {titleWords.map((word, wordIdx) => (
                <div key={wordIdx} className="flex overflow-hidden mr-4">
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
              <span className="text-[0.6em] text-muted-foreground/20 italic font-light ml-2 mr-4">&</span> 
              <div className="flex overflow-hidden">
                {activityWords.map((letter, i) => (
                  <motion.span
                    key={i}
                    custom={i + 15}
                    variants={letterAnimation}
                    initial="hidden"
                    animate={isTitleInView ? "visible" : "hidden"}
                    className="inline-block origin-bottom"
                  >
                    {letter}
                  </motion.span>
                ))}
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
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {isLoading
                ? "Synchronizing Live Telemetry..."
                : error || !data 
                ? "Live stats temporarily unavailable."
                : `${data.metrics.repos} repositories. Consistent commits. Real projects.`}
            </p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        {!error && (
          <div className="flex flex-col gap-12 md:gap-20 lg:pl-16">
            {/* Top Row: Metrics Bar */}
            {isLoading ? <MetricsSkeleton /> : data && <MetricsBar metrics={data.metrics} />}

            {/* Middle Row: Heatmap + Languages & Pinned Repos */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
              {/* Left Column (8 cols): Heatmap + Streak */}
              <div className="lg:col-span-8">
                {isLoading ? (
                  <HeatmapSkeleton />
                ) : data && (
                  <ContributionHeatmap 
                    heatmap={data.heatmap} 
                    totalContributions={data.metrics.commits}
                    streak={data.streak}
                  />
                )}
              </div>

              {/* Right Column (4 cols): Languages + Pinned Repos List */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                {isLoading ? (
                  <div className="flex flex-col gap-8">
                    <LanguagesSkeleton />
                    <PinnedReposSkeleton />
                  </div>
                ) : data && (
                  <>
                    <LanguageBreakdown languages={data.languages} />
                    <PinnedRepos repos={data.pinned} />
                  </>
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
