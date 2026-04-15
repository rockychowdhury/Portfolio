"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import AchievementCard, { Achievement } from "./AchievementCard";
import ClosingCard from "./ClosingCard";
import MasterySpine from "./MasterySpine";
import { JourneySkeleton } from "./JourneySkeleton";


const JourneySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

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
    >
      <div className="mx-auto max-w-[800px] px-6 lg:px-20">
        {/* Simple Section Header */}
        <div className="mb-16">
          <h2 className="text-3xl font-light tracking-tight text-foreground">
            Professional <span className="font-medium">Journey</span>
          </h2>
          <div className="mt-2 h-px w-12 bg-primary/20" />
        </div>

        <div className="relative pl-10 pr-4">
          {/* Animated Vertical Spine */}
          <MasterySpine containerRef={containerRef} />

          {/* Achievement Stream */}
          <div className="flex flex-col gap-8 min-h-[400px]">
            {loading ? (
              <JourneySkeleton />
            ) : groupedAchievements.map(([month, achs], groupIdx) => (
              <div key={month} className="flex flex-col gap-2">
                {/* Time Caption Header */}
                <div className="flex items-center gap-4 py-2 opacity-40">
                   <div className="absolute left-[-20px] w-[9px] h-[9px] rounded-full border border-primary bg-background z-20" />
                   <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                     {month}
                   </span>
                </div>

                <div className="flex flex-col gap-1">
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
          </div>


          {/* Closing Card inline */}
          <div className="mt-16 pt-16 border-t border-border/50">
             <ClosingCard />
          </div>
        </div>
      </div>
    </section>
  );
};




export default JourneySection;
