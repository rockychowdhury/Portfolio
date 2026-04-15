"use client";

import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import BackgroundText from "./BackgroundText";
import BrowserWindow from "./BrowserWindow";
import ProjectMeta from "./ProjectMeta";

interface FeaturedProjectsProps {
  projects: any[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  
  const isInView = useInView(containerRef, { amount: 0.5, once: false });

  const scrollLockRef = useRef<HTMLDivElement>(null);

  // Refined Scroll Locking implementation
  useEffect(() => {
    const el = scrollLockRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (isLocked) {
        e.preventDefault();
      }
    };

    // We must use a non-passive listener to be allowed to preventDefault
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [isLocked]);

  const handleVideoEnded = (index: number) => {
    if (index === activeIndex && index < projects.length - 1) {
      // Small delay for the flip animation to feel natural
      setTimeout(() => {
        setActiveIndex(prev => prev + 1);
      }, 300); // Slightly faster for responsiveness
    }
  };

  if (!projects || projects.length === 0) return null;

  return (
    <div 
      ref={containerRef} 
      className="relative z-0 min-h-screen w-full bg-muted/30 flex flex-col justify-center overflow-hidden"
    >
      <div className="relative h-screen w-full flex flex-col justify-center">
        <BackgroundText activeIndex={activeIndex} projects={projects} />
        
        {/* Centered container for the content */}
        <div className="relative z-10 w-full flex-1 flex items-center justify-center pointer-events-none">
          {/* Precise Hover Zone for Scroll Lock - matches BrowserWindow dimensions */}
          <div 
            ref={scrollLockRef}
            className="relative w-full max-w-[900px] aspect-[16/10] mx-4 md:mx-12 pointer-events-auto bg-background rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-foreground/5"
            onMouseEnter={() => setIsLocked(true)}
            onMouseLeave={() => setIsLocked(false)}
          >
            <BrowserWindow 
              activeIndex={activeIndex} 
              projects={projects} 
              onVideoEnded={handleVideoEnded}
              isPlaying={isInView}
            />
          </div>
        </div>

        <ProjectMeta activeIndex={activeIndex} projects={projects} />

        {/* Status Hint */}
        <div className="absolute bottom-8 right-12 hidden md:block">
          <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-foreground/40 [writing-mode:vertical-lr]">
              {activeIndex + 1} / {projects.length}
            </span>
            <div className="h-12 w-px bg-foreground/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
