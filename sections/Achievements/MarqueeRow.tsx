"use client";

import { useRef } from "react";
import type { IAchievement } from "@/types/achievement";
import { MarqueeAchievementCard } from "./MarqueeAchievementCard";
import { useElementInView } from "@/lib/useElementInView";

type Props = {
  achievements: IAchievement[];
  direction: "left" | "right";
  speed?: number;  // seconds to complete one cycle
};

export function MarqueeRow({ achievements, direction, speed = 40 }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const { ref: visibilityRef, inView } = useElementInView<HTMLDivElement>("100px 0px");

  // Duplicate items to make the loop seamless
  // Using 3 sets to ensure coverage during the transition
  const items = [...achievements, ...achievements, ...achievements];

  if (achievements.length === 0) return null;

  return (
    <div ref={visibilityRef} className="relative w-full py-4 overflow-hidden group">
      {/* Edge Fading Overlays — Much more performant than mask-image */}
      <div className="absolute inset-y-0 left-0 w-24 z-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 z-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      {/* Animation Wrapper */}
      <div className="w-full">
        <div
          ref={rowRef}
          className="flex gap-8 w-max"
          style={{
            animation: `marquee-${direction} ${speed}s linear infinite`,
            animationPlayState: inView ? "running" : "paused",
            willChange: inView ? "transform" : "auto",
            transform: "translate3d(0,0,0)",
          }}

          // Pause on hover
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.animationPlayState = "paused";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.animationPlayState = inView ? "running" : "paused";
          }}
        >
          {items.map((achievement, i) => (
            <MarqueeAchievementCard key={`${achievement._id}-${i}`} achievement={achievement} />
          ))}
        </div>
      </div>
    </div>
  );
}

