"use client";

import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const MasterySpine = ({ progress }: { progress: number }) => {
  const pathLength = useSpring(progress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="absolute top-[24px] left-0 right-0 h-px pointer-events-none">
      {/* Background Track */}
      <div className="absolute inset-0 border-t border-black/[0.1] dark:border-white/[0.1]" />
      
      {/* Active Line (Drawing) */}
      <motion.div
        style={{ scaleX: pathLength, originX: 0 }}
        className="absolute inset-0 border-t border-primary z-10 shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]"
      />

      {/* Subtle indicator at the tip */}
      <motion.div
        style={{ 
          left: useTransform(pathLength, (p) => `${p * 100}%`),
        }}
        className="absolute top-[-3.5px] w-2 h-2 rounded-full bg-primary z-20 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
      />
    </div>
  );
};


export default MasterySpine;
