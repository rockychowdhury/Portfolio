"use client";

import { useRef } from "react";
import { Achievement } from "./achievementsData";
import { AchievementCard } from "./AchievementCard";

type Props = {
  achievements: Achievement[];
  direction: "left" | "right";
  speed?: number;  // seconds to complete one cycle
};

export function MarqueeRow({ achievements, direction, speed = 40 }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);

  // Duplicate items to make the loop seamless
  // Using 3 sets to ensure coverage during the transition
  const items = [...achievements, ...achievements, ...achievements];

  if (achievements.length === 0) return null;

  return (
    <div
      className="relative w-full py-4 overflow-hidden group"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
      }}
    >
      {/* Animation Wrapper */}
      <div className="w-full">
        <div
          ref={rowRef}
          className="flex gap-8 w-max"
          style={{
            animation: `marquee-${direction} ${speed}s linear infinite`,
            willChange: "transform",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "translate3d(0,0,0)",
          }}

          // Pause on hover
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.animationPlayState = "paused";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.animationPlayState = "running";
          }}
        >
          {items.map((achievement, i) => (
            <AchievementCard key={`${achievement._id}-${i}`} achievement={achievement} />
          ))}
        </div>
      </div>
    </div>
  );
}

