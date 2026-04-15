"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import AchievementCard, { Achievement } from "./AchievementCard";
import ClosingCard from "./ClosingCard";
import MasterySpine from "./MasterySpine";
import { JourneySkeleton } from "./JourneySkeleton";

import { motion, useInView } from "framer-motion";

// Premium easing for sections
const premiumEase: [number, number, number, number] = [0.25, 0.4, 0.25, 1] as const;

const letterAnimation = {
  hidden: { opacity: 0, y: 40, rotateX: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      delay: 0.1 + i * 0.05,
      ease: premiumEase,
    },
  }),
};

const JourneySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-10%" });
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

  const titleWords = "Professional".split(" ");
  const accentWords = "Journey".split("");

  return (
    <section 
      ref={containerRef}
      id="journey"
      className="relative min-h-screen w-full overflow-hidden bg-background py-24 px-6 md:px-12 lg:px-20 text-foreground"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Animated Section Header */}
        <div className="mb-16 lg:pl-16 text-left" ref={titleRef}>
          <div className="flex flex-col gap-2">
            <h2 className="flex flex-wrap items-end text-[3.5rem] font-medium leading-[1.1] tracking-tighter text-foreground sm:text-[5rem] md:text-[6rem] lg:text-[8rem]">
              {titleWords.map((word, wordIdx) => (
                <div key={wordIdx} className="flex overflow-hidden mr-4 pb-4 -mb-4">
                  {word.split("").map((letter, i) => (
                    <motion.span
                      key={i}
                      custom={i + (wordIdx * 5)}
                      variants={letterAnimation}
                      initial="hidden"
                      animate={isTitleInView ? "visible" : "hidden"}
                      className="inline-block origin-bottom"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>
              ))}
              <div className="flex overflow-hidden pb-4 -mb-4">
                {accentWords.map((letter, i) => (
                  <motion.span
                    key={i}
                    custom={i + 15}
                    variants={letterAnimation}
                    initial="hidden"
                    animate={isTitleInView ? "visible" : "hidden"}
                    className="inline-block origin-bottom text-muted-foreground/30 font-light"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={isTitleInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.8, ease: premiumEase }}
            className="mt-8 flex items-center gap-4"
          >
            <div className="h-px w-8 bg-foreground/40" />
            <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground/60">
              [ 04. JOURNEY ]
            </p>
          </motion.div>
        </div>

        <div className="relative lg:pl-[120px] pr-4 max-w-[900px] mx-auto lg:mx-0">
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
