"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import BackgroundText from "./BackgroundText";
import BrowserWindow from "./BrowserWindow";
import ProjectMeta from "./ProjectMeta";

interface FeaturedProjectsProps {
  projects: any[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  if (!projects || projects.length === 0) return null;

  return (
    <div 
      ref={containerRef} 
      className="relative z-0"
      style={{ height: `${projects.length * 200}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        {/* Cinematic Guidelines */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div className="mx-auto h-full max-w-[1400px] border-x border-dashed border-foreground/5">
            <div className="absolute top-0 left-12 h-full w-px border-l border-dashed border-foreground/5 hidden lg:block" />
          </div>
        </div>

        <BackgroundText scrollYProgress={scrollYProgress} projects={projects} />
        <BrowserWindow scrollYProgress={scrollYProgress} projects={projects} />
        <ProjectMeta scrollYProgress={scrollYProgress} projects={projects} />

        {/* Scroll Hint */}
        <div className="absolute bottom-8 right-12 hidden md:block">
          <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-foreground/20 [writing-mode:vertical-lr]">
              Scroll to explore
            </span>
            <div className="h-12 w-px bg-foreground/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
