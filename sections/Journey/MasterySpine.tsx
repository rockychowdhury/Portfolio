"use client";

import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const MasterySpine = ({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  // Percentage is relative to the moving wrapper, which spans the full spine
  // height — so this compiles to transform (composited) instead of `top` (layout).
  const tipTranslateY = useTransform(pathLength, (p) => `${p * 100}%`);

  return (
    <div className="absolute left-[20px] top-4 bottom-4 w-px pointer-events-none">
      {/* Background Track (Groove) */}
      <div className="absolute inset-0 w-[2px] -ml-[0.5px] bg-border/40" />

      {/* Active Line (Glowing Path) */}
      <motion.div
        style={{ scaleY: pathLength, opacity, originY: 0 }}
        className="absolute inset-0 w-[2px] -ml-[0.5px] bg-foreground shadow-[0_0_10px_rgba(var(--foreground),0.5)] z-10"
      />

      {/* Subtle indicator at the tip ( glowing spark ) — uses transform, not `top`, to avoid per-frame layout */}
      <motion.div
        style={{ y: tipTranslateY, opacity }}
        className="absolute inset-y-0 left-[-3.5px] w-[8px] z-20"
      >
        <div className="w-[8px] h-[8px] rounded-full bg-background border-[2px] border-foreground shadow-[0_0_15px_rgba(var(--foreground),0.8)]" />
      </motion.div>
    </div>
  );
};

export default MasterySpine;
