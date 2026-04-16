"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
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

  // Auto-advance logic (fallback for static content)
  useEffect(() => {
    if (!isInView || isLocked) return;

    const timer = setInterval(() => {
      setActiveIndex(current => (current + 1) % projects.length);
    }, 12000); // 12 seconds fallback

    return () => clearInterval(timer);
  }, [isInView, isLocked, activeIndex, projects.length]);

  // Refined Scroll Locking implementation
  useEffect(() => {
    const el = scrollLockRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (isLocked) {
        // If scrolling heavily, unlock and allow normal scroll
        if (Math.abs(e.deltaY) > 50) {
           // Allow natural scroll to take over
        } else {
           e.preventDefault();
        }
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [isLocked]);

  const handleVideoEnded = (index: number) => {
    if (index === activeIndex) {
      setTimeout(() => {
        setActiveIndex(prev => (prev + 1) % projects.length);
      }, 300);
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
              isPlaying={isInView && !isLocked}
            />
          </div>
        </div>

        <ProjectMeta activeIndex={activeIndex} projects={projects} />

        {/* Status Hint */}
        <div className="absolute bottom-12 right-12 hidden md:block">
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col gap-2">
              {projects.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1 transition-all duration-500 rounded-full ${i === activeIndex ? "h-8 bg-primary" : "h-2 bg-foreground/10"}`}
                />
              ))}
            </div>
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-foreground/40 [writing-mode:vertical-lr]">
              {String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

