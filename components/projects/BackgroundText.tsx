"use client";

import { motion, useTransform, MotionValue } from "framer-motion";

interface BackgroundTextProps {
  scrollYProgress: MotionValue<number>;
  projects: any[];
}

export default function BackgroundText({ scrollYProgress, projects }: BackgroundTextProps) {
  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
      {projects.map((project, i) => {
        const start = i / projects.length;
        const end = (i + 1) / projects.length;
        const segmentSize = 1 / projects.length;
        const transitionWidth = segmentSize * 0.2;

        // Fade in/out logic
        const opacity = useTransform(
          scrollYProgress,
          [
            Math.max(0, start),
            Math.max(0, start + transitionWidth),
            Math.min(1, end - transitionWidth),
            Math.min(1, end)
          ],
          [0, 1, 1, 0]
        );

        // Drift logic
        const x = useTransform(
          scrollYProgress,
          [start, end],
          ["-5%", "5%"]
        );

        // Vertical drift logic
        const y = useTransform(
          scrollYProgress,
          [
            Math.max(0, start),
            Math.max(0, start + transitionWidth),
            Math.min(1, end - transitionWidth),
            Math.min(1, end)
          ],
          ["5%", "0%", "0%", "-5%"]
        );

        return (
          <motion.h2
            key={project._id || i}
            style={{ 
              opacity, 
              x, 
              y,
              WebkitTextStroke: "1px var(--stroke-color, rgba(0, 0, 0, 0.08))",
            }}
            className="absolute whitespace-nowrap text-[12vw] font-black uppercase tracking-tighter text-transparent select-none leading-none font-anton dark:[--stroke-color:rgba(255,255,255,0.08)]"
          >
            {project.title}
          </motion.h2>
        );
      })}
    </div>
  );
}
