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
  useInView(sectionRef, { once: true, margin: "-10%" });

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
    <SectionWrapper id="education" className="relative py-24 lg:py-40 bg-background overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const }}
          className="mb-24 lg:mb-32 max-w-5xl"
        >
          <h2 className="flex flex-wrap items-end text-5xl font-light tracking-tighter text-foreground md:text-7xl lg:text-8xl leading-[1.1] cursor-default select-none">
            {"Education & Certifications.".split(" ").map((word, wordIdx) => (
              <div key={wordIdx} className="flex overflow-visible mr-6 lg:mr-10 pb-6 -mb-6">
                {word.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 100, rotateX: 60 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      delay: wordIdx * 0.2 + i * 0.04,
                      ease: [0.25, 0.4, 0.25, 1] as const,
                    }}
                    className="inline-block origin-bottom"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            ))}
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground/60 leading-relaxed font-medium tracking-tight max-w-2xl">
            Formal education backed by hands-on certifications from industry leading platforms.
          </p>
        </motion.div>

        {/* Bento Grid Container */}
        <div className="relative min-h-[400px]" ref={sectionRef}>
          {isLoading ? (
            <EducationSkeleton />
          ) : (
            <>
              <BentoGrid data={visibleData} />
              
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
