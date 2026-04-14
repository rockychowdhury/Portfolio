"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";

interface BrowserWindowProps {
  scrollYProgress: MotionValue<number>;
  projects: any[];
}

export default function BrowserWindow({ scrollYProgress, projects }: BrowserWindowProps) {
  return (
    <div className="relative z-10 flex h-full items-center justify-center p-4 md:p-12 [perspective:2000px]">
      <div className="relative mx-auto max-w-[900px] w-full aspect-[16/10] z-10 hidden md:block" style={{ transformStyle: "preserve-3d" }}>
        {projects.map((project, i) => {
          const segmentSize = 1 / projects.length;
          const start = i * segmentSize;
          const end = (i + 1) * segmentSize;
          const mid = (start + end) / 2;
          const transitionWidth = segmentSize * 0.2;

          const rotateY = useTransform(
            scrollYProgress,
            [
              Math.max(0, end - transitionWidth),
              Math.min(1, end),
              Math.min(1, end + transitionWidth)
            ],
            [0, 90, 180]
          );

          const opacity = useTransform(
            scrollYProgress,
            [start, start + 0.02, end - 0.02, end],
            [0, 1, 1, 0]
          );

          const translateY = useTransform(
            scrollYProgress,
            [start, end],
            ["0%", "-30%"]
          );

          return (
            <motion.div
              key={project._id || i}
              style={{
                rotateY,
                opacity,
                transformStyle: "preserve-3d"
              }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Browser Frame */}
              <div className="relative w-full h-full rounded-2xl border border-foreground/10 bg-background shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-foreground/5 bg-muted/30">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 max-w-sm px-4">
                    <div className="h-6 w-full rounded-lg bg-foreground/5 border border-foreground/5 flex items-center px-4 overflow-hidden">
                      <span className="text-[10px] text-foreground/40 font-mono truncate">
                        {project.liveUrl || "https://project.ai"}
                      </span>
                    </div>
                  </div>
                  <div className="w-16 h-4 bg-foreground/5 rounded-full" />
                </div>

                {/* Content (Screen) */}
                <div className="relative flex-1 w-full overflow-hidden bg-muted/20 min-h-[500px]">
                  {project.image ? (
                    <motion.div
                      style={{ y: translateY }}
                      className="relative w-full flex items-start"
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={1200}
                        height={2400}
                        className="w-full h-auto brightness-[0.98] contrast-[1.02]"
                        unoptimized={true}
                        priority
                      />
                    </motion.div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black uppercase tracking-[1em] text-foreground/10">
                      {project.title} Preview
                    </div>
                  )}
                </div>
              </div>

              {/* Reflection/Glow Effect */}
              <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-tr from-transparent via-foreground/[0.02] to-transparent" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
