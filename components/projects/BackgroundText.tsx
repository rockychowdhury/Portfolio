"use client";

import { motion, AnimatePresence } from "framer-motion";

interface BackgroundTextProps {
  activeIndex: number;
  projects: any[];
}

export default function BackgroundText({ activeIndex, projects }: BackgroundTextProps) {
  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
      <AnimatePresence mode="wait">
        {projects.map((project, i) => {
          if (i !== activeIndex) return null;

          return (
            <motion.h2
              key={project._id || i}
              initial={{ opacity: 0, scale: 0.8, x: -50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 1.2, x: 50 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{ 
                WebkitTextStroke: "1px var(--stroke-color, rgba(0, 0, 0, 0.15))",
                opacity: 0.1, // Overall slightly more visible
              }}
              className="absolute whitespace-nowrap text-[12vw] font-black uppercase tracking-tighter text-transparent select-none leading-none font-anton dark:[--stroke-color:rgba(255,255,255,0.15)]"
            >
              {project.title}
            </motion.h2>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
