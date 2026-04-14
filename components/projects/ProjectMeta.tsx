"use client";

import { motion, useTransform, MotionValue } from "framer-motion";

interface ProjectMetaProps {
  scrollYProgress: MotionValue<number>;
  projects: any[];
}

export default function ProjectMeta({ scrollYProgress, projects }: ProjectMetaProps) {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none p-8 md:p-24 flex flex-col justify-end md:justify-center">
      {projects.map((project, i) => {
        const start = i / projects.length;
        const end = (i + 1) / projects.length;
        const segmentSize = 1 / projects.length;
        const transitionWidth = segmentSize * 0.2;

        const opacity = useTransform(
          scrollYProgress,
          [start, start + transitionWidth, end - transitionWidth, end],
          [0, 1, 1, 0]
        );

        const x = useTransform(
          scrollYProgress,
          [start, start + transitionWidth, end - transitionWidth, end],
          [-20, 0, 0, 20]
        );

        return (
          <motion.div
            key={project._id || i}
            style={{ opacity, x }}
            className="absolute left-8 bottom-12 md:left-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 max-w-[320px]"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-black text-foreground/10 tracking-widest font-mono">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="h-px flex-1 bg-foreground/10" />
            </div>

            <h3 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4 uppercase font-anton">
              {project.title}
            </h3>

            <p className="text-sm font-medium text-foreground/40 leading-relaxed mb-6">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.techStack?.map((tag: string) => (
                <span 
                  key={tag} 
                  className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-foreground/5 bg-foreground/5 text-foreground/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Navigation Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {projects.map((_, i) => {
          const segmentSize = 1 / projects.length;
          const start = i * segmentSize;
          const end = (i + 1) * segmentSize;
          const indicatorWidth = segmentSize * 0.1;
          
          const opacity = useTransform(
            scrollYProgress,
            [
              Math.max(0, start - indicatorWidth),
              Math.max(0, start),
              Math.min(1, end),
              Math.min(1, end + indicatorWidth)
            ],
            [0.2, 1, 1, 0.2]
          );

          const width = useTransform(
            scrollYProgress,
            [
              Math.max(0, start - indicatorWidth),
              Math.max(0, start),
              Math.min(1, end),
              Math.min(1, end + indicatorWidth)
            ],
            [4, 24, 24, 4]
          );

          return (
            <motion.div
              key={i}
              style={{ opacity, width }}
              className="h-1 rounded-full bg-foreground"
            />
          );
        })}
      </div>
    </div>
  );
}
