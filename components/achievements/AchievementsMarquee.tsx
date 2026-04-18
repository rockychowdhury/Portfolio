"use client";

import { MarqueeRow } from "./MarqueeRow";
import { Achievement } from "./achievementsData";

type Props = { achievements: Achievement[] };

const ROW_ONE_CATEGORIES: Achievement["category"][] = [
  "education",
  "certification",
  "project",
];

const ROW_TWO_CATEGORIES: Achievement["category"][] = [
  "competitive_programming",
  "academic_honor",
  "leadership",
];

export function AchievementsMarquee({ achievements }: Props) {
  // Sort achievements into rows based on categories
  const rowOne = achievements.filter((a) =>
    ROW_ONE_CATEGORIES.includes(a.category)
  );
  const rowTwo = achievements.filter((a) =>
    ROW_TWO_CATEGORIES.includes(a.category)
  );

  return (
    <section className="relative w-full py-16 sm:py-24 overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/50">
      {/* Futuristic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[128px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 mb-8 sm:mb-12">
        <div className="flex flex-col items-center gap-2">
          <div className="h-px w-12 bg-zinc-300 dark:bg-zinc-800" />
          <p className="text-center text-[10px] font-black tracking-[0.4em] uppercase
                        text-zinc-400 dark:text-zinc-500">
            Professional Milestones
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Achievements
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:gap-6 relative z-10">
        {/* Row 1 — scrolls left */}
        <MarqueeRow achievements={rowOne} direction="left" speed={60} />

        {/* Row 2 — scrolls right (opposite) */}
        <MarqueeRow achievements={rowTwo} direction="right" speed={55} />
      </div>
    </section>
  );
}

