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
    <section className="w-full py-16 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <p className="text-center text-xs font-semibold tracking-[0.18em] uppercase
                      text-zinc-400 dark:text-zinc-500">
          Achievements & Recognition
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Row 1 — scrolls left */}
        <MarqueeRow achievements={rowOne} direction="left" speed={50} />

        {/* Row 2 — scrolls right (opposite) */}
        <div className="hidden sm:block">
          <MarqueeRow achievements={rowTwo} direction="right" speed={45} />
        </div>
      </div>
    </section>
  );
}
