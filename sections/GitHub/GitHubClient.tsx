"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/layout/SectionWrapper";
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

export default function GitHubClient({ initialData }: { initialData: any }) {
  const [data] = useState<any>(initialData);
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-10%" });

  const titleWords = "Open Source".split(" ");
  const activityWords = "Activity".split("");

  // Derived subtext data
  const years = data?.contributionYears || [];
  const activeSince = years.length > 0 ? Math.min(...years) : 2022;
  const primaryStack = data?.languages?.slice(0, 4).map((l: any) => l.name).join(" · ") || "Python · FastAPI · JavaScript · TypeScript";

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
              {data ? `${data.metrics.repos} repositories · Active since ${activeSince} · Primary stack: ${primaryStack}` : "Live stats temporarily unavailable."}
            </p>
          </motion.div>
        </div>

        {/* Main Content Sections */}
        <div className="relative z-10 flex flex-col gap-16 md:gap-24">
          {/* 1. Metrics / Meaningful Stats */}
          <div className="flex flex-col gap-10">
            {data ? (
              <MeaningfulStatsRow
                metrics={data.metrics}
                streak={data.streak}
                heatmap={data.heatmap}
              />
            ) : (
              <MetricsSkeleton />
            )}
          </div>

          {/* 2. Contribution Heatmap */}
          <div className="flex flex-col gap-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40">
              Contribution Activity
            </h3>
            {data ? (
              <ContributionHeatmap
                heatmap={data.heatmap}
                stats={data.metrics}
                streak={data.streak}
              />
            ) : (
              <HeatmapSkeleton />
            )}
          </div>

          {/* 3. Languages + Pinned Repos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="flex flex-col gap-8">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                Language Breakdown
              </h3>
              {data ? (
                <LanguageIntelligence languages={data.languages} />
              ) : (
                <LanguagesSkeleton />
              )}
            </div>

            <div className="flex flex-col gap-8">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                Highlighted Repositories
              </h3>
              {data ? (
                <PinnedRepoGrid repos={data.pinned} />
              ) : (
                <PinnedReposSkeleton />
              )}
            </div>
          </div>
        </div>

      </div>
    </SectionWrapper>
  );
}
