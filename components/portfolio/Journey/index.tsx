"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import AchievementCard, { Achievement } from "./AchievementCard";
import ClosingCard from "./ClosingCard";
import MasterySpine from "./MasterySpine";
import { JourneySkeleton } from "./JourneySkeleton";


const JourneySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const res = await fetch("/api/journey");
        const data = await res.json();
        if (Array.isArray(data)) {
          setAchievements(data);
        }
      } catch (error) {
        console.error("Failed to fetch journey:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJourney();
  }, []);

  // Update scroll progress for the Spine
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const progress = scrollLeft / (scrollWidth - clientWidth);
      setScrollProgress(isNaN(progress) ? 0 : progress);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loading, achievements]);

  // Scroll Jacking: Vertical wheel -> Horizontal scroll
  useEffect(() => {
    const outer = containerRef.current;
    const inner = scrollContainerRef.current;
    if (!outer || !inner) return;

    const handleWheel = (e: WheelEvent) => {
      // Only intercept if we are hovering and deltaY is present
      if (!isHovered || Math.abs(e.deltaY) < 1) return;

      const canScrollLeft = inner.scrollLeft > 0;
      const canScrollRight = inner.scrollLeft < inner.scrollWidth - inner.clientWidth;

      // If we can scroll horizontally in the direction of deltaY, prevent default
      if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
        e.preventDefault();
        inner.scrollLeft += e.deltaY;
      }
    };

    outer.addEventListener("wheel", handleWheel, { passive: false });
    return () => outer.removeEventListener("wheel", handleWheel);
  }, [isHovered]);

  // Smooth Auto Scroll
  useEffect(() => {
    if (loading || isHovered) return;

    let rafId: number;
    const scroll = () => {
      if (scrollContainerRef.current) {
        const inner = scrollContainerRef.current;
        // Slow constant movement
        inner.scrollLeft += 0.5;
        
        // Loop back if reached end (optional, but requested "auto scroll smoothly")
        if (inner.scrollLeft >= inner.scrollWidth - inner.clientWidth) {
           // Wait a bit or reset
           // For a portfolio, maybe just stay at the end or slowly reverse?
           // Let's just stop at the end for now or loop if desired.
           // Ticker usually loops.
        }
      }
      rafId = requestAnimationFrame(scroll);
    };

    rafId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(rafId);
  }, [loading, isHovered]);

  // Grouping achievements by month/year for headers
  const groupedAchievements = useMemo(() => {
    const groups: Record<string, Achievement[]> = {};
    achievements.forEach((ach) => {
      const key = ach.date; // MMM YYYY
      if (!groups[key]) groups[key] = [];
      groups[key].push(ach);
    });
    return Object.entries(groups).sort((a, b) => {
      const dateA = new Date(a[1][0].date_sortable);
      const dateB = new Date(b[1][0].date_sortable);
      return dateA.getTime() - dateB.getTime();
    });
  }, [achievements]);

  return (
    <section 
      ref={containerRef}
      id="journey"
      className="relative w-full bg-background py-24 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-20">
        {/* Simple Section Header */}
        <div className="mb-16">
          <h2 className="text-3xl font-light tracking-tight text-foreground">
            Professional <span className="font-medium">Journey</span>
          </h2>
          <div className="mt-2 h-px w-12 bg-primary/20" />
        </div>

        <div className="relative pt-12">
          {/* Animated Horizontal Spine */}
          <MasterySpine progress={scrollProgress} />

          {/* Achievement Stream */}
          <div 
            ref={scrollContainerRef}
            className="flex flex-row gap-16 overflow-x-auto scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {loading ? (
              <JourneySkeleton />
            ) : groupedAchievements.map(([month, achs], groupIdx) => (
              <div key={month} className="flex flex-col gap-6 shrink-0 min-w-[300px]">
                {/* Time Caption Header - Positioned relative to the horizontal line */}
                <div className="flex items-center gap-4 py-2 opacity-50 relative">
                   {/* Dot on the horizontal line */}
                   <div className="absolute top-[-28px] left-0 w-2 h-2 rounded-full border border-primary bg-background z-20" />
                   <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                     {month}
                   </span>
                </div>

                <div className="flex flex-col gap-4">
                  {achs.map((achievement, achIdx) => (
                    <AchievementCard 
                      key={achievement._id} 
                      achievement={achievement} 
                      index={achIdx}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Closing Section inline at the end */}
            {!loading && (
              <div className="flex flex-col gap-6 shrink-0 min-w-[300px] border-l border-border/50 pl-16 ml-8">
                <div className="flex items-center gap-4 py-2 opacity-50 relative">
                   <div className="absolute top-[-28px] left-0 w-2 h-2 rounded-full border border-amber-500 bg-background z-20" />
                   <span className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-600/60">
                     Present Day
                   </span>
                </div>
                <ClosingCard />
              </div>
            )}
          </div>
          
          {/* Subtle fade edges to indicate scroll */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
};




export default JourneySection;
