"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ICertification } from "@/lib/db/models/Certification";
import SectionWrapper from "../SectionWrapper";
import BentoGrid from "./BentoGrid";
import ShowAllButton from "./ShowAllButton";
import { EducationSkeleton } from "./EducationSkeleton";

export default function Education() {
  const [data, setData] = useState<ICertification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-10%" });

  const educationTitle = "Education &".split(" ");
  const certsTitle = "Certifications.".split("");

  const premiumEase: [number, number, number, number] = [0.25, 0.4, 0.25, 1] as const;
  const letterAnimation = {
    hidden: { opacity: 0, y: 100, rotateX: 60 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        delay: 0.1 + i * 0.02,
        ease: premiumEase,
      },
    }),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/education?limit=all");
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch education data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Initial set: Hero (Education) + 2 Certifications
  const heroItem = data.find(item => item.type === "education");
  const certItems = data.filter(item => item.type === "certification");
  
  const initialCerts = certItems.slice(0, 2);
  const remainingCerts = certItems.slice(2);
  
  const visibleData = showAll 
    ? data 
    : (heroItem ? [heroItem, ...initialCerts] : initialCerts);

  return (
    <SectionWrapper id="education" className="relative pt-24 lg:pt-40 pb-16 lg:pb-24 bg-background overflow-hidden">
      <div className="container-main relative z-10" ref={sectionRef}>
        
        {/* Section Header */}
        <div className="mb-24 lg:mb-32 flex flex-col items-start">
          <h2 className="flex flex-wrap items-center justify-start text-[clamp(3rem,8vw,6.5rem)] font-light tracking-tighter text-foreground leading-[1.1] cursor-default select-none">
            {educationTitle.map((word, wordIdx) => (
              <div key={wordIdx} className="flex overflow-hidden mr-4 lg:mr-8 pb-4 -mb-4">
                {word.split("").map((letter, i) => (
                  <motion.span
                    key={i}
                    custom={i + (wordIdx * 10)}
                    variants={letterAnimation}
                    initial="hidden"
                    animate={isSectionInView ? "visible" : "hidden"}
                    className="inline-block origin-bottom"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            ))}
            <div className="flex overflow-hidden pb-4 -mb-4">
              {certsTitle.map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i + 20}
                  variants={letterAnimation}
                  initial="hidden"
                  animate={isSectionInView ? "visible" : "hidden"}
                  className="inline-block origin-bottom text-muted-foreground/20"
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </h2>
        </div>

        {/* Bento Grid Container */}
        <div className="relative min-h-[400px]">
          {isLoading ? (
            <EducationSkeleton />
          ) : (
            <>
              <BentoGrid data={visibleData} isVisible={isSectionInView} />
              
              {remainingCerts.length > 0 && (
                 <ShowAllButton 
                    isExpanded={showAll} 
                    onClick={() => {
                      setShowAll(!showAll);
                      if (showAll) {
                        sectionRef.current?.scrollIntoView({ behavior: "smooth" });
                      }
                    }} 
                    count={remainingCerts.length} 
                 />
              )}
            </>
          )}
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
    </SectionWrapper>
  );
}
