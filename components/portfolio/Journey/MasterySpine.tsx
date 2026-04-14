"use client";

import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const MasterySpine = ({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) => {
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

  return (
    <div className="absolute left-[20px] top-4 bottom-4 w-px pointer-events-none">
      {/* Background Track */}
      <div className="absolute inset-0 border-l border-black/[0.08] dark:border-white/[0.08]" />
      
      {/* Active Line (Drawing) */}
      <motion.div
        style={{ scaleY: pathLength, opacity, originY: 0 }}
        className="absolute inset-0 border-l border-primary z-10"
      />

      {/* Subtle indicator at the tip */}
      <motion.div
        style={{ 
          top: useTransform(pathLength, (p) => `${p * 100}%`),
          opacity 
        }}
        className="absolute left-[-2.5px] w-[6px] h-[6px] rounded-full bg-primary z-20"
      />
    </div>
  );
};


export default MasterySpine;
